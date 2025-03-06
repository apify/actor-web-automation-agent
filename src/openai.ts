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
            input: 0.0015,
            output: 0.002,
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
    'gpt-4o-mini': {
        model: 'gpt-4o-mini',
        maxTokens: 16384,
        interface: 'chat',
        cost: {
            input: 0.00015,
            output: 0.0006,
        },
    },
    'gpt-4o': {
        model: 'gpt-4o',
        maxTokens: 16384,
        interface: 'chat',
        cost: {
            input: 0.0025,
            output: 0.01,
        },
    },
    'o3-mini': {
        model: 'o3-mini',
        maxTokens: 4096,
        interface: 'chat',
        cost: {
            input: 0.0011,
            output: 0.0044,
        },
    },
    'o1-mini': {
        model: 'o1-mini',
        maxTokens: 2048,
        interface: 'chat',
        cost: {
            input: 0.0165,
            output: 0.066,
        },
    },
};
