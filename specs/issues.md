# Issues

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

