import 'zx/globals';
import fs from 'fs/promises';
import { TEST_CASES } from './agent_test_cases.js';

for (const c of TEST_CASES) {
    const input = {
        startUrl: c.startUrl,
        instructions: c.instructions,
        openaiApiKey: process.env.OPENAI_API_KEY,
    };
    await fs.writeFile('./storage/key_value_stores/default/INPUT.json', JSON.stringify(input));
    await $`npm run start:dev`;
    const outputRaw = await fs.readFile('./storage/key_value_stores/default/OUTPUT.json', { encoding: 'utf8' });
    const output = JSON.parse(outputRaw);
    Object.keys(c.expectedOutput).forEach((expectedKey) => {
        if (!output[expectedKey]) {
            console.log(`ERROR: ${expectedKey} does not exist in the output`);
        } else if (c.expectedOutput[expectedKey] !== output[expectedKey]) {
            console.log(`ERROR: Expected value for key ${expectedKey} "${c.expectedOutput[expectedKey]}" `
                + `does not correspond to "${output[expectedKey]}" in the output.`);
        } else {
            console.log('OK');
        }
    });
}
