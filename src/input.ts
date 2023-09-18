import { ProxyConfigurationOptions } from '@crawlee/core';
/**
 * Input schema in TypeScript format.
 */
export interface Input {
    startUrl: string;
    instructions: string;
    proxyConfiguration?: ProxyConfigurationOptions;
}
