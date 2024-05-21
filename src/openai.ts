export interface OpenaiAPICost {
    input: number; // USD cost per 1000 tokens
    output: number; // USD cost per 1000 tokens
}

export interface GPTModelConfig {
    model: string;
    maxTokens: number;
    maxOutputTokens?: number;
    interface: 'text' | 'chat';
    cost: OpenaiAPICost; // USD cost per 1000 tokens
}

/**
 * List of GPT models that can be used.
 * Should be in sync with https://platform.openai.com/docs/models/
 */
export const GPT_MODEL_LIST: {[key: string]: GPTModelConfig} = {
    'gpt-3.5-turbo-16k': {
        model: 'gpt-3.5-turbo-16k',
        maxTokens: 16384,
        interface: 'chat',
        cost: {
            input: 0.003,
            output: 0.004,
        },
    },
    'gpt-4': {
        model: 'gpt-4',
        maxTokens: 8192,
        interface: 'chat',
        cost: {
            input: 0.03,
            output: 0.06,
        },
    },
    'gpt-4-32k': {
        model: 'gpt-4-32k',
        maxTokens: 32768,
        interface: 'chat',
        cost: {
            input: 0.06,
            output: 0.12,
        },
    },
    'gpt-4-1106-preview': {
        model: 'gpt-4-128k',
        maxTokens: 128000,
        interface: 'chat',
        cost: {
            input: 0.01,
            output: 0.03,
        },
    },
    'gpt-4o': {
        model: 'gpt-4o',
        maxTokens: 128000,
        interface: 'chat',
        cost: {
            input: 0.005,
            output: 0.015,
        },
    },
};
