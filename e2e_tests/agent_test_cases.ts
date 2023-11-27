export const TEST_CASES: {
    name:string,
    expectedOutput: Record<string, unknown>,
    startUrl: string,
    instructions: string,
}[] = [{
    name: 'fetchActorName',
    startUrl: 'https://apify.com',
    instructions: `Go to the store page and perform a search for "AI Web Agent". Click the first result.
    Extract the name of the Actor and save it in the output as 'actorName'.`,
    expectedOutput: {
        actorName: 'AI Web Agent',
    },
}];
