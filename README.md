> This Actor is a work in progress. Got feedback? Head to the [Issues tab](https://console.apify.com/actors/dLXH5Ia8gLsNjieKV/issues) in Console.

## Open external connectivity

This project is intended to be free and open source, externally connected by default, and interoperable rather than confined to a closed vendor loop. The target architecture supports public APIs, MCP servers, web services, repositories, automation platforms, and user-supplied endpoints through documented interfaces. See [Open External Connectivity Policy](docs/architecture/external-connectivity.md).

External connectors are enabled by default when their adapters are available. Provider credentials and scopes remain controlled by the connected service and are supplied through the runtime environment or a secret manager. No secrets belong in source control. The policy describes the target contract; runtime behavior must be verified against implementation before it is represented as active.

## 😎 How does AI Web Agent work?

The AI Web Agent browses the web and extracts data from websites using natural-language instructions. It combines the Apify platform and large language models to generate browser actions.

It can navigate to URLs, click elements, fill and submit forms, extract page data, save datasets, and capture screenshots.

## How to use AI Web Agent

1. Add the starting page URL.
2. Provide the browser instructions.
3. Configure the required model-provider API key in the runtime secret store.
4. Select a supported model.
5. Start the Actor.

## Input

- **Start URL** (`startUrl`): initial page.
- **Instructions**: requested browser workflow.
- **Model provider credentials**: supplied securely through the runtime.
- **Model**: selected supported model.
- **Proxy configuration**: optional Apify Proxy or custom HTTP/SOCKS5 proxy.

## Output

Results are available in the Actor's key-value store under `OUTPUT`; browser recordings may be available as `recording.mp4`.

## Cost

Costs depend on the selected model provider, token usage, browser runtime, and any optional proxy service. Consult the relevant provider pricing.

## Financial automation example

A minimal Python example (`codex_fin.py`) demonstrates sample transaction analysis and suggested actions. It is illustrative and does not itself establish a live financial-account connection.

## Stitch design-to-code integration

See [Google Stitch Skills Integration](docs/integrations/google-stitch-skills.md) for the design-generation, component-building, and browser-validation workflow.

## Axiom of Duality

The [Axiom of Duality](docs/axiom-of-duality.html) summary explores the relationship between conceptual goals and computational implementation.
