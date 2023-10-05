# Web Automation Agent

> The Agent is currently in **experimental** stage. It is not recommended to use it in production. Please forward all feedback to issues.

The agent using natural language instructions to browse web and extract data.

## How does Extended GPT Scraper work?

The Web Automation Agent is a tool that allows you to browse the web and extract data from websites using natural language instructions.
It uses generative AI from [OpenAI API](https://openai.com/) to generate actions which should be process.

The agent have access to set of actions that can process:

* Go to URL
* Click on element
* Fill and submit form
* Extract data from the page
* Save data to output
* Save data to dataset
* Take and save screenshot

## How much does it cost?

There are two costs associated with using agent.

## Cost of the OpenAI API
You can find the cost of the OpenAI API on the [OpenAI pricing page](https://openai.com/pricing).
The cost depends on the model you are using and the action browser process. The cost is calculated based on the number of tokens used.
You can see these cost in the log of the actor run.

## Cost of the running browser
The agent uses a headless browser running in Actor. The cost of the browser is based on the amount of time it takes to run the agent.
You can find information about the cost on the [pricing page](https://apify.com/pricing).

## How to use Web Automation Agent

To get started with Web Agent, you need to
1. Set up the page where you want to start automation using [**Start URL**](#start-url).
2. Set up [**Instructions**](#instructions) on how the agent should browse the web.
3. Set up [**OpenAI API key**](#openai-api-key). You can get it from <a href='https://platform.openai.com/account/api-keys' target='_blank' rel='noopener'>OpenAI platform</a>.

For example, to browse https://apify.com/ find pricing page and get the cheapest pricing plan you can use:

### Start URL

https://apify.com/

### Instructions

Goto pricing page and get all pricing plans, extract all information about plan and save information about the cheapest pricing plan as output.

## Input configuration

Web Automation Agent accepts following configuration settings.
These can be entered either manually in the user interface in [Apify Console](https://console.apify.com)
or programmatically in a JSON object using the [Apify API](https://apify.com/docs/api/v2#/reference/actors/run-collection/run-actor).

### Start URL

The **Start URL** (`startUrl`) field represents the initial page URL that the Actor will visit.

### Instructions

This option tells agent how to browse the web.

### OpenAI API key

The API key for accessing OpenAI. You can get it from <a href='https://platform.openai.com/account/api-keys' target='_blank' rel='noopener'>OpenAI platform</a>.

### GPT Model

The **GPT Model** (`model`) option specifies which GPT model to use.
You can find more information about the models on the [OpenAI API documentation](https://platform.openai.com/docs/models/overview).
Keep in mind that each model has different pricing and features.

### Proxy configuration

The **Proxy configuration** (`proxyConfiguration`) option enables you to set proxies.
The scraper will use these to prevent its detection by target websites.
You can use both [Apify Proxy](https://apify.com/proxy) and custom HTTP or SOCKS5 proxy servers.

