# Issues

[x] When testing connection for Bedrock I get error: Connection test failed: Failed to load AWS SDK: Failed to resolve module specifier '@aws-sdk/client-bedrock-runtime'. Make sure @aws-sdk/client-bedrock-runtime is installed.

[x] Next to the title "Avnam AI Memo" provide a tiny font model provider indicator like (using Gemini)

[x] Test connection returns really fast. Are you actually testing an LLM call for testing connection?

[x] When in Bedrock settings missing an option for using cross-region inference and prefix model ids with `us.` if selected.

[x] When selecting Gemini model and capturing memo I see processing notification but saved memo does not show up. I get Error processing memo: Error: Failed to parse Gemini response as JSON.

[x] When I select Settings, then select Memos, I still see settings screen below Memos screen. It hides when I click on any other menu like tags and come back to memos.

[x] Error processing memo: Error: Unrecognized request arguments supplied: tags, url

[x] When saving AWS credentials after selecting Bedrock provider in settings I get Invalid Configuration error.

[x] Ensure the model ids drop down in choosing Bedrock provider are matching https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html. Use Claude Opus 4, Sonnet 4, Sonnet 3.7, Sonnet 3.5v2, and Haiku 3.5. Provide an option for using cross-region inference and prefix model ids with `.us` if selected.

[x] For Gemini models use https://ai.google.dev/gemini-api/docs/models and provide options for Gemini 2.5 Pro and Gemini 2.5 Flash

[x] For Anthropic models use https://docs.anthropic.com/en/docs/about-claude/models/overview and provide options for Claude Opus 4, Sonnet 4, Sonnet 3.7, Sonnet 3.5v2, and Haiku 3.5

[x] Uncaught SyntaxError: Unexpected reserved word
Context: sidepanel.html

Partial stacktrace
```
// Initialize provider configuration manager
    const providerConfigManager = new ProviderConfigManager();

        // Initialize provider settings
257:    await initializeProviderSettings();

    async function initializeProviderSettings() {
```

[x] Service worker registration failed. Status code: 15

[x] Uncaught TypeError: Failed to resolve module specifier "@aws-sdk/client-bedrock-runtime". Relative references must start with either "/", "./", or "../".

[x] I am not able to choose my AI provider. I only get an option to add Anthropic key like prior feature release
[x] Settings screen only shows Anthropic key

