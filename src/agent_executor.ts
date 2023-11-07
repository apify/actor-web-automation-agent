/* eslint-disable max-classes-per-file */
import {
    AgentAction,
    AgentFinish,
    AgentStep,
    ChainValues,
} from 'langchain/schema';
import { OutputParserException } from 'langchain/schema/output_parser';
import { Tool } from 'langchain/tools';
import { BaseChain } from 'langchain/chains';
import { BaseSingleActionAgent, StoppingMethod, AgentExecutorInput } from 'langchain/agents';
import { CallbackManagerForChainRun } from 'langchain/callbacks';

export class ToolInputParsingException extends Error {
    output?: string;

    constructor(message: string, output?: string) {
        super(message);
        this.output = output;
    }
}

/**
 * The WebAgentExecutor extends the AgentExecutor to allow pass
 * a function to update the previous step.
 */
export interface WebAgentExecutorInput extends AgentExecutorInput {
    agent: BaseSingleActionAgent;
    updatePreviousStepMethod?: (step: AgentStep) => AgentStep;
}

/**
 * Tool that just returns the query.
 * Used for exception tracking.
 * NOTE: This is a copy of the ExceptionTool from langchain/src/agents/executor.ts
 */
export class ExceptionTool extends Tool {
    name = '_Exception';

    description = 'Exception tool';

    async _call(query: string) {
        return query;
    }
}

/**
 * A chain managing an agent using tools.
 * NOTE: This is a copy of the AgentExecutor from langchain/src/agents/executor.ts
 * with a few modifications.
 * @augments BaseChain
 */
export class WebAgentExecutor extends BaseChain {
    static override lc_name() {
        return 'WebAgentExecutor';
    }

    override get lc_namespace() {
        return ['langchain', 'agents', 'executor'];
    }

    agent: BaseSingleActionAgent;

    tools: this['agent']['ToolType'][];

    returnIntermediateSteps = false;

    maxIterations?: number = 15;

    earlyStoppingMethod: StoppingMethod = 'force';

    updatePreviousStepMethod?: (step: AgentStep) => AgentStep;

    /**
     * How to handle errors raised by the agent's output parser.
     Defaults to `False`, which raises the error.

     If `true`, the error will be sent back to the LLM as an observation.
     If a string, the string itself will be sent to the LLM as an observation.
     If a callable function, the function will be called with the exception
     as an argument, and the result of that function will be passed to the agent
     as an observation.
     */
    handleParsingErrors:
        | boolean
        | string
        | ((e: OutputParserException | ToolInputParsingException) => string) = false;

    get inputKeys() {
        return this.agent.inputKeys;
    }

    get outputKeys() {
        return this.agent.returnValues;
    }

    constructor(input: WebAgentExecutorInput) {
        super(input);
        this.agent = input.agent;
        this.tools = input.tools;
        this.handleParsingErrors = input.handleParsingErrors ?? this.handleParsingErrors;
        // eslint-disable-next-line no-underscore-dangle
        if (this.agent._agentActionType() === 'multi') {
            for (const tool of this.tools) {
                if (tool.returnDirect) {
                    throw new Error(
                        `Tool with return direct ${tool.name} not supported for multi-action agent.`,
                    );
                }
            }
        }
        this.returnIntermediateSteps = input.returnIntermediateSteps ?? this.returnIntermediateSteps;
        this.maxIterations = input.maxIterations ?? this.maxIterations;
        this.earlyStoppingMethod = input.earlyStoppingMethod ?? this.earlyStoppingMethod;
        this.updatePreviousStepMethod = input.updatePreviousStepMethod;
    }

    /** Create from agent and a list of tools. */
    static fromAgentAndTools(fields: WebAgentExecutorInput): WebAgentExecutor {
        return new WebAgentExecutor(fields);
    }

    /**
     * Method that checks if the agent execution should continue based on the
     * number of iterations.
     * @param iterations The current number of iterations.
     * @returns A boolean indicating whether the agent execution should continue.
     */
    private shouldContinue(iterations: number): boolean {
        return this.maxIterations === undefined || iterations < this.maxIterations;
    }

    /** @ignore */
    async _call(
        inputs: ChainValues,
        runManager?: CallbackManagerForChainRun,
    ): Promise<ChainValues> {
        const toolsByName = Object.fromEntries(
            this.tools.map((t) => [t.name.toLowerCase(), t]),
        );
        const steps: AgentStep[] = [];
        let iterations = 0;

        const getOutput = async (finishStep: AgentFinish) => {
            const { returnValues } = finishStep;
            const additional = await this.agent.prepareForOutput(returnValues, steps);

            if (this.returnIntermediateSteps) {
                return { ...returnValues, intermediateSteps: steps, ...additional };
            }
            await runManager?.handleAgentEnd(finishStep);
            return { ...returnValues, ...additional };
        };

        while (this.shouldContinue(iterations)) {
            let output;
            try {
                output = await this.agent.plan(steps, inputs, runManager?.getChild());
            } catch (e) {
                if (e instanceof OutputParserException) {
                    let observation;
                    if (this.handleParsingErrors === true) {
                        observation = 'Invalid or incomplete response';
                    } else if (typeof this.handleParsingErrors === 'string') {
                        observation = this.handleParsingErrors;
                    } else if (typeof this.handleParsingErrors === 'function') {
                        observation = this.handleParsingErrors(e);
                    } else {
                        throw e;
                    }
                    output = {
                        tool: '_Exception',
                        toolInput: observation,
                        log: e.message,
                    };
                } else {
                    throw e;
                }
            }
            // Check if the agent has finished
            if ('returnValues' in output) {
                return getOutput(output);
            }

            let actions: AgentAction[];
            if (Array.isArray(output)) {
                actions = output as AgentAction[];
            } else {
                actions = [output as AgentAction];
            }

            const newSteps = await Promise.all(
                actions.map(async (action) => {
                    await runManager?.handleAgentAction(action);
                    const tool = action.tool === '_Exception'
                        ? new ExceptionTool()
                        : toolsByName[action.tool?.toLowerCase()];
                    let observation;
                    try {
                        observation = tool
                            ? await tool.call(action.toolInput, runManager?.getChild())
                            : `${action.tool} is not a valid tool, try another one.`;
                    } catch (e) {
                        if (e instanceof ToolInputParsingException) {
                            if (this.handleParsingErrors === true) {
                                observation = 'Invalid or incomplete tool input. Please try again.';
                            } else if (typeof this.handleParsingErrors === 'string') {
                                observation = this.handleParsingErrors;
                            } else if (typeof this.handleParsingErrors === 'function') {
                                observation = this.handleParsingErrors(e);
                            } else {
                                throw e;
                            }
                            observation = await new ExceptionTool().call(
                                observation,
                                runManager?.getChild(),
                            );
                            return { action, observation: observation ?? '' };
                        }
                    }

                    return { action, observation: observation ?? '' };
                }),
            );

            const previousSteps = steps[steps.length - 1];
            if (previousSteps && this.updatePreviousStepMethod) {
                steps[steps.length - 1] = this.updatePreviousStepMethod(previousSteps);
            }

            steps.push(...newSteps);

            const lastStep = steps[steps.length - 1];
            const lastTool = toolsByName[lastStep.action.tool?.toLowerCase()];

            if (lastTool?.returnDirect) {
                return getOutput({
                    returnValues: { [this.agent.returnValues[0]]: lastStep.observation },
                    log: '',
                });
            }

            iterations += 1;
        }

        const finish = await this.agent.returnStoppedResponse(
            this.earlyStoppingMethod,
            steps,
            inputs,
        );

        return getOutput(finish);
    }

    _chainType() {
        return 'agent_executor' as const;
    }
}
