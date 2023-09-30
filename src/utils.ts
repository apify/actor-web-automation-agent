import { log } from 'apify';

export const webAgentLog = log.child({ prefix: 'WebAutomationAgent' });

export function keyValueArrayToObject(keyValueArray: { key: string, value: string }[]) {
    const object: Record<string, string> = {};
    keyValueArray.forEach(({ key, value }: { key: string, value: string }) => {
        object[key] = value;
    });
    return object;
}
