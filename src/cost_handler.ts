import { log } from 'apify';
import { BaseTracer } from 'langchain/callbacks';
import { Run } from 'langchain/callbacks/handlers/llmonitor';
import { GPT_MODEL_LIST, OpenaiAPICost } from './openai.js';

const openAiCostLog = log.child({ prefix: 'OpenAI' });

interface TotalCost {
    usd: number;
    tokens: number;
    totalModelCalls: number;
}

export class ConstHandler extends BaseTracer {
    name: string;
    modelName: string;
    modelCost: OpenaiAPICost;
    totalCost: TotalCost;

    constructor(modelName: string) {
        super();
        this.name = 'cost_handler';
        this.modelName = modelName;
        this.modelCost = GPT_MODEL_LIST[this.modelName].cost;
        this.totalCost = {
            usd: 0,
            tokens: 0,
            totalModelCalls: 0,
        };
    }

    // NOTE: We do not need to persist runs in this handler.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    persistRun(_run: Run) {
        return Promise.resolve();
    }

    /**
     * Logs tokens usage in $.
     * @returns void
     */
    override onLLMEnd(run: Run) {
        const tokenUsage = run?.outputs?.llmOutput?.tokenUsage;
        if (tokenUsage) {
            const inputCostsUSD = this.modelCost.input * (tokenUsage.promptTokens / 1000);
            const outputCostsUSD = this.modelCost.output * (tokenUsage.completionTokens / 1000);
            const callCostUSD = inputCostsUSD + outputCostsUSD;
            this.totalCost.usd += inputCostsUSD + outputCostsUSD;
            this.totalCost.tokens += tokenUsage.promptTokens + tokenUsage.completionTokens;
            this.totalCost.totalModelCalls++;
            const durationSecs = run.end_time && run.start_time && (run.end_time - run.start_time) / 1000;
            openAiCostLog.info(`LLM processed call`, { durationSecs, callCostUSD, totalCostUSD: this.totalCost.usd });
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override onLLMStart(_run: Run) {
        openAiCostLog.info(`Calling LLM model...`);
    }

    getTotalCost() {
        return this.totalCost;
    }
}
