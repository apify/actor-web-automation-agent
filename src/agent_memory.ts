import { BaseChatMemory, BufferMemoryInput, getBufferString } from 'langchain/memory';
import { InputValues } from 'langchain/schema';
import { MemoryVariables } from 'langchain/dist/memory/base';

export class WebAgentMemory extends BaseChatMemory implements BufferMemoryInput {
    humanPrefix = 'Human';

    aiPrefix = 'AI';

    memoryKey = 'history';

    constructor(fields?: BufferMemoryInput) {
        super({
            chatHistory: fields?.chatHistory,
            returnMessages: fields?.returnMessages ?? false,
            inputKey: fields?.inputKey,
            outputKey: fields?.outputKey,
        });
        this.humanPrefix = fields?.humanPrefix ?? this.humanPrefix;
        this.aiPrefix = fields?.aiPrefix ?? this.aiPrefix;
        this.memoryKey = fields?.memoryKey ?? this.memoryKey;
    }

    get memoryKeys() {
        return [this.memoryKey];
    }

    /**
     * Loads the memory variables. It takes an `InputValues` object as a
     * parameter and returns a `Promise` that resolves with a
     * `MemoryVariables` object.
     * @param _values `InputValues` object.
     * @returns A `Promise` that resolves with a `MemoryVariables` object.
     */
    async loadMemoryVariables(_values: InputValues): Promise<MemoryVariables> {
        const messages = await this.chatHistory.getMessages();
        console.log('messages', messages)
        if (this.returnMessages) {
            const result = {
                [this.memoryKey]: messages,
            };
            return result;
        }
        const result = {
            [this.memoryKey]: getBufferString(
                messages,
                this.humanPrefix,
                this.aiPrefix,
            ),
        };
        return result;
    }

    override async saveContext(
        inputValues,
        outputValues
    ): Promise<void> {
        console.log('saveContext', inputValues, outputValues)
    }
}
