> This Actor is a work in progress. Got feedback? Head to the [Issues tab](https://console.apify.com/actors/dLXH5Ia8gLsNjieKV/issues) in Console.
> ⚠️ The AI Web Agent is an experimental project and is currently not actively maintained. While we have plans for long-term improvements, these will not be implemented in the near future. We welcome and appreciate any contributions, including pull requests or documentation enhancements.
>

## Open external connectivity

This project is intended to be free and open source, externally connected by default, and interoperable rather than confined to a closed vendor loop. The target architecture supports public APIs, MCP servers, web services, repositories, automation platforms, and user-supplied endpoints through documented interfaces. See [Open External Connectivity Policy](docs/architecture/external-connectivity.md).

External connectors are enabled by default when their adapters are available. Provider credentials and scopes remain controlled by the connected service and are supplied through the runtime environment or a secret manager. No secrets belong in source control. The policy describes the target contract; runtime behavior must be verified against implementation before it is represented as active.

## 😎 How does AI Web Agent work?

The AI Web Agent browses the web and extracts data from websites using natural-language instructions. It combines the Apify platform and large language models to generate browser actions.
You can use AI Web Agent to **automate any action on the web:**

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
1. **Add page URL** that you want the Web Agent to start with.
2. Provide **Instructions** on what the Web Agent should do while on that page. Use simple and straightforward language.
3. Set up **OpenAI API key**. You can get it from <a href='https://platform.openai.com/account/api-keys' target='_blank' rel='noopener'>OpenAI platform</a>.
4. Choose **GPT Model** that decyphers your prompt to the Web Agent: GPT-4o-mini, GPT-4o, o1-mini, o3-mini, GPT-3.5 Turbo 16k, GPT-4, GPT-4 32k.
5. Click **Start**.

A minimal Python example (`codex_fin.py`) demonstrates sample transaction analysis and suggested actions. It is illustrative and does not itself establish a live financial-account connection.

## Stitch design-to-code integration

See [Google Stitch Skills Integration](docs/integrations/google-stitch-skills.md) for the design-generation, component-building, and browser-validation workflow.

## Axiom of Duality

The [Axiom of Duality](docs/axiom-of-duality.html) summary explores the relationship between conceptual goals and computational implementation.
**Start URL**

The **Start URL** (`startUrl`) field represents the initial page URL that the Agent will visit.

**Instructions**

This field instructs the Web Agent how to browse the web.

**OpenAI API key**

The API key for accessing OpenAI. You can get it from <a href='https://platform.openai.com/account/api-keys' target='_blank' rel='noopener'>OpenAI platform</a>.

**GPT Model**

The **GPT Model** (`model`) option specifies which GPT model to use. You can find more information about the models on the [OpenAI API documentation](https://platform.openai.com/docs/models/overview). Keep in mind that each GPT model has different pricing and features.

**Proxy configuration**

The **Proxy configuration** (`proxyConfiguration`) option enables you to set proxies. The Web Agent will use these to prevent getting blocked by target websites. You can use both [Apify Proxy](https://apify.com/proxy) and custom HTTP or SOCKS5 proxy servers.

You can enter these either directly in [Apify Console](https://console.apify.com/) or programmatically in a JSON object using the [Apify API](https://apify.com/docs/api/v2#/reference/actors/run-collection/run-actor). Watch [this video](https://www.youtube.com/watch?v=ViYYDHSBAKM) to learn how get your data via the cURL command and with both Apify's API clients (Python and Node.js).

[AI Web Agent API](https://www.youtube.com/watch?v=ViYYDHSBAKM)

## ⬇️ Output

You can find the results of the run in the **Storage tab → Key-value store** under the `OUTPUT` key. You can also view the recorded Web Agent's browsing session under`recording.mp4`.

## 💸 How much does it cost to use AI Web Agent?

Your total cost will be calculated based on **combined costs for running OpenAI’s LLMs and browser runtime**.

**Cost of the OpenAI API**

The cost depends on the model you are using and the action browser process. The cost is calculated based on the number of tokens used. You can see the cost in the log of the Actor run. You can find the cost of the OpenAI API on the [OpenAI pricing page](https://openai.com/pricing).

**Cost of the running browser**

The Web Agent uses a headless browser. The cost of the browser is based on the amount of time it takes to run the Agent. You can find information about the cost on the [pricing page](https://apify.com/pricing).

## 📘 Resources

- [What are AI Agents?](https://blog.apify.com/what-are-ai-agents/)
- [11 AI agent use cases (on Apify)](https://blog.apify.com/ai-agent-use-cases/)
- [AI agent workflow: building an agent to query Apify datasets](https://blog.apify.com/ai-agent-workflow/)

