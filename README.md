> ⚠️ The AI Web Agent is an experimental project and is currently not actively maintained. While we have plans for long-term improvements, these will not be implemented in the near future. We welcome and appreciate any contributions, including pull requests or documentation enhancements.
> 



## 😎 How does AI Web Agent work?

The AI Web Agent is a tool that allows you to browse the web and extract data from websites using simple, natural language instructions. It combines the powers of the Apify platform and large language models from [OpenAI API](https://openai.com/) to generate actions that should be performed.

You can use AI Web Agent to **automate any action on the web:** 

🌐 Go to URL

🖱️ Click on element

📝 Fill and submit forms

📦 Extract data from the page

💾 Save data to output

📊 Save data to dataset

📸 Take and save a screenshot💸

## 📚 How to use AI Web Agent?

AI Web Agent was designed for an easy start even if you've never tried automating tasks on the web before. To get started, you need to:

1. **Add page URL** that you want the Web Agent to start with.
2. Provide **Instructions** on what the Web Agent should do while on that page. Use simple and straightforward language.
3. Set up **OpenAI API key**. You can get it from <a href='https://platform.openai.com/account/api-keys' target='_blank' rel='noopener'>OpenAI platform</a>.
4. Choose **GPT Model** that decyphers your prompt to the Web Agent: GPT-3.5 Turbo 16k, GPT-4, GPT-4 32k.
5. Click **Start**.

For example, to browse a website such as [https://apify.com/](https://apify.com/) and get the cheapest pricing plan, you can use the following instructions:

<img width="75%" src="https://github.com/apify-projects/actor-readme-images/blob/master/AI%20Web%20Agent%20full%20input.png?raw=true" />

## ⬇️ Input

AI Web Agent accepts the following configuration settings:

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
