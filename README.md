# Web Automation Agent [Experimental]

> The Agent is currently in **experimental** stage. It is not recommended to use it in production. Please forward all feedback to issues.

The agent using natural language instructions to browse web and extract data.

## How to use Web Automation Agent

To get started with Web Agent, you need to set up the pages you want to start automation using [**Start URL**](#start-url) and then set up instructions on how the agent should browse the web.
For instance, using a simple automation to browse the URL https://apify.com/ and instructing agent to browse to pricing page and extract information from it will look like this:


You can configure the Actor using Input configuration to set up a more complex workflow.

## Input configuration

Web Automation Agent accepts following configuration settings.
These can be entered either manually in the user interface in [Apify Console](https://console.apify.com)
or programmatically in a JSON object using the [Apify API](https://apify.com/docs/api/v2#/reference/actors/run-collection/run-actor).

### Start URL

The **Start URL** (`startUrl) field represents the initial page URL that the Actor will visit.

### Instructions

This option tells agent how to browse the web. For example, you can send the following prompts:

- "Goto pricing page and get all pricing plans, extract all information about plan and save information about the cheapest pricing plan as output."

### Proxy configuration

The **Proxy configuration** (`proxyConfiguration`) option enables you to set proxies.
The scraper will use these to prevent its detection by target websites.
You can use both [Apify Proxy](https://apify.com/proxy) and custom HTTP or SOCKS5 proxy servers.


## Issues to solve
- [ ] Cannot fill special inputs like date or special selects like "Monthly budget" on https://apify.com/enterprise#form
- [ ] The agent can throw because it limits number of token, we can improve the way reove HTML from previous messages

