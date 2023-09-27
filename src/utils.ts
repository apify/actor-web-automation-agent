import { log } from 'apify';

export const webAgentLog = log.child({ prefix: 'WebAutomationAgent' });

export function keyValueArrayToObject(keyValueArray: { key: string, value: string }[]) {
    const object = {};
    keyValueArray.forEach(({ key, value }: { key: string, value: string }) => {
        // @ts-ignore
        object[key] = value;
    });
    return object;
}
