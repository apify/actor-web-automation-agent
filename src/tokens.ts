import { encode } from 'gpt-3-encoder';

const chunkText = (text:string, maxLength: number) => {
    const numChunks = Math.ceil(text.length / maxLength);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += maxLength) {
        chunks[i] = text.substr(o, maxLength);
    }

    return chunks;
};
export const getNumberOfTextTokens = (text: string) => {
    const encodedText = encode(text);
    return encodedText.length;
};

export const maybeShortsTextByTokenLength = (text: string, maxTokenLength: number) => {
    // OpenAI: A helpful rule of thumb is that one token generally corresponds to ~4 characters of text for common English text.
    if (text.length <= maxTokenLength * 4 && getNumberOfTextTokens(text) <= maxTokenLength) {
        return text;
    }
    let shortText = '';
    let shortTextTokens = 0;
    for (const textPart of chunkText(text, 100)) {
        shortTextTokens += getNumberOfTextTokens(textPart);
        if (shortTextTokens <= maxTokenLength) {
            shortText += textPart;
        } else {
            break;
        }
    }
    return shortText;
};
