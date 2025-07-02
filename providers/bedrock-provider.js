import { LLMProvider } from '../llm-provider-api.js';

// Dynamic imports for AWS SDK to avoid browser module resolution issues
let BedrockRuntimeClient, InvokeModelCommand;

export class BedrockProvider extends LLMProvider {
    constructor(config = {}) {
        super(config);
        this.accessKeyId = null;
        this.secretAccessKey = null;
        this.sessionToken = null;
        this.region = config.region || 'us-east-1';
        this.model = config.model || 'anthropic.claude-sonnet-4-20250514-v1:0';
        this.useCrossRegionInference = config.useCrossRegionInference || false;
        this.client = null;
    }

    /**
     * Check browser compatibility for AWS Bedrock
     */
    checkBrowserCompatibility() {
        return {
            supported: true, // AWS SDK v3 supports browser environment
            requirements: [
                'AWS credentials must be provided securely',
                'CORS must be configured for Bedrock endpoints',
                'Temporary credentials recommended for browser usage',
                'Consider AWS Cognito for credential management'
            ],
            recommendations: [
                'Use AWS Cognito Identity Pools for temporary credentials',
                'Implement proper IAM policies with least privilege',
                'Consider using AWS STS for temporary credentials',
                'Store credentials securely, never in client-side code'
            ]
        };
    }

    /**
     * Get available authentication methods for browser environment
     */
    getBrowserAuthMethods() {
        return [
            {
                method: 'cognito-identity',
                description: 'AWS Cognito Identity Pools for temporary credentials',
                feasible: true,
                implementation: 'AWS Cognito with federated identity'
            },
            {
                method: 'sts-assume-role',
                description: 'AWS STS AssumeRole for temporary credentials',
                feasible: true,
                implementation: 'Backend service that provides temporary credentials'
            },
            {
                method: 'direct-credentials',
                description: 'Direct AWS credentials (Access Key + Secret)',
                feasible: true,
                implementation: 'AWS SDK v3 with provided credentials',
                warning: 'Not recommended for production - credentials exposed in browser'
            }
        ];
    }

    async initialize(credentials) {
        if (!credentials || typeof credentials !== 'object') {
            throw new Error('AWS credentials are required for Bedrock provider');
        }

        const { accessKeyId, secretAccessKey, sessionToken, region } = credentials;

        if (!accessKeyId || typeof accessKeyId !== 'string') {
            throw new Error('AWS Access Key ID is required');
        }

        if (!secretAccessKey || typeof secretAccessKey !== 'string') {
            throw new Error('AWS Secret Access Key is required');
        }

        // Validate AWS Access Key format
        if (!accessKeyId.match(/^AKIA[0-9A-Z]{16}$/) && !accessKeyId.match(/^ASIA[0-9A-Z]{16}$/)) {
            throw new Error('Invalid AWS Access Key format. Should start with AKIA or ASIA followed by 16 characters');
        }

        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
        this.sessionToken = sessionToken;
        
        if (region) {
            this.region = region;
        }

        // Dynamically import AWS SDK modules from bundled file
        try {
            const awsModule = await import('/dist/aws-sdk-bundle.js');
            BedrockRuntimeClient = awsModule.BedrockRuntimeClient;
            InvokeModelCommand = awsModule.InvokeModelCommand;
        } catch (error) {
            throw new Error(`Failed to load AWS SDK: ${error.message}. Make sure the AWS SDK bundle is built.`);
        }

        // Create Bedrock Runtime client
        try {
            this.client = new BedrockRuntimeClient({
                region: this.region,
                credentials: {
                    accessKeyId: this.accessKeyId,
                    secretAccessKey: this.secretAccessKey,
                    ...(this.sessionToken && { sessionToken: this.sessionToken })
                }
            });

            // Test the connection by attempting to list models or make a simple call
            await this.testConnection();
            
            this.initialized = true;
            return true;
        } catch (error) {
            throw new Error(`Failed to initialize Bedrock client: ${error.message}`);
        }
    }

    async testConnection() {
        if (!this.client) {
            throw new Error('Bedrock client not initialized');
        }

        // Test connection with a small request to Claude model
        try {
            const testPayload = {
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: 10,
                messages: [{ role: 'user', content: 'Hi' }]
            };

            const command = new InvokeModelCommand({
                modelId: this.model,
                contentType: 'application/json',
                accept: 'application/json',
                body: JSON.stringify(testPayload)
            });

            const response = await this.client.send(command);
            
            // If we get here without an error, the connection is working
            return { status: 'connected', model: this.model, region: this.region };
        } catch (error) {
            // Handle specific AWS errors
            if (error.name === 'AccessDeniedError') {
                throw new Error('AWS credentials do not have permission to access Bedrock');
            } else if (error.name === 'ValidationException') {
                throw new Error('Invalid model ID or request format');
            } else if (error.name === 'ServiceUnavailableException') {
                throw new Error('Bedrock service is currently unavailable');
            } else {
                throw new Error(`Bedrock connection test failed: ${error.message}`);
            }
        }
    }

    async chat(messages, options = {}) {
        if (!this.initialized || !this.client) {
            throw new Error('Provider not initialized. Call initialize() first.');
        }

        // Format messages for Bedrock Claude API
        const formattedMessages = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        const requestBody = {
            anthropic_version: 'bedrock-2023-05-31',
            max_tokens: options.max_tokens || 4096,
            temperature: options.temperature || 0.7,
            messages: formattedMessages
        };

        try {
            const command = new InvokeModelCommand({
                modelId: options.model || this.model,
                contentType: 'application/json',
                accept: 'application/json',
                body: JSON.stringify(requestBody)
            });

            const response = await this.client.send(command);
            
            // Parse response body
            const responseText = new TextDecoder().decode(response.body);
            const data = JSON.parse(responseText);
            
            return {
                success: true,
                reply: data.content[0].text,
                usage: {
                    input_tokens: data.usage?.input_tokens || 0,
                    output_tokens: data.usage?.output_tokens || 0,
                    total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
                }
            };
        } catch (error) {
            // Handle specific AWS/Bedrock errors
            if (error.name === 'AccessDeniedError') {
                throw new Error('AWS credentials do not have permission to access this Bedrock model');
            } else if (error.name === 'ValidationException') {
                throw new Error('Invalid request format or model parameters');
            } else if (error.name === 'ServiceQuotaExceededException') {
                throw new Error('Bedrock service quota exceeded');
            } else if (error.name === 'ThrottlingException') {
                throw new Error('Bedrock API rate limit exceeded');
            } else {
                throw new Error(`Bedrock API error: ${error.message}`);
            }
        }
    }

    async processMemo(content, options = {}) {
        if (!this.initialized) {
            throw new Error('Provider not initialized. Call initialize() first.');
        }

        // Sanitize content using inherited method
        const sanitizedContent = this.sanitizeContent(content);
        
        // Create system message for memo processing
        const systemPrompt = `You are an AI assistant that processes web content into structured memos. 
Extract key information from the provided HTML content and return a JSON object with the following structure:
{
    "title": "Main title or heading of the content",
    "summary": "A concise 2-3 sentence summary of the main points",
    "narrative": "A more detailed description of the content and its significance",
    "structuredData": {
        "key": "value pairs of important structured information"
    },
    "selectedTag": "A single relevant tag from: article, research, news, tutorial, reference, documentation, blog, social, product, company, person, event, other"
}

Return only valid JSON without any additional text or formatting.`;

        const messages = [
            { role: 'user', content: `${systemPrompt}\n\nContent to process:\n${sanitizedContent}` }
        ];

        try {
            const response = await this.chat(messages, {
                temperature: 0.3, // Lower temperature for more consistent structured output
                ...options
            });

            let parsedResponse;
            try {
                parsedResponse = JSON.parse(response.reply);
            } catch (parseError) {
                throw new Error('Failed to parse Bedrock response as JSON');
            }

            // Validate required fields
            const requiredFields = ['title', 'summary', 'narrative', 'structuredData', 'selectedTag'];
            for (const field of requiredFields) {
                if (!(field in parsedResponse)) {
                    parsedResponse[field] = field === 'structuredData' ? {} : '';
                }
            }

            return parsedResponse;
        } catch (error) {
            throw error;
        }
    }

    calculateTokens(text) {
        if (!text || typeof text !== 'string') {
            return 0;
        }

        // Use Claude's token calculation since Bedrock uses Claude models
        // Claude uses approximately 3.5 characters per token
        const avgCharsPerToken = 3.5;
        return Math.ceil(text.length / avgCharsPerToken);
    }

    getAvailableModels() {
        const baseModels = [
            'anthropic.claude-opus-4-20250514-v1:0',
            'anthropic.claude-sonnet-4-20250514-v1:0',
            'anthropic.claude-3-7-sonnet-20250219-v1:0',
            'anthropic.claude-3-5-sonnet-20241022-v2:0',
            'anthropic.claude-3-5-haiku-20241022-v1:0'
        ];

        if (this.useCrossRegionInference) {
            return baseModels.map(model => model.replace('anthropic.', 'us.anthropic.'));
        }

        return baseModels;
    }

    getCrossRegionModels() {
        return [
            'us.anthropic.claude-opus-4-20250514-v1:0',
            'us.anthropic.claude-sonnet-4-20250514-v1:0',
            'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
            'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
            'us.anthropic.claude-3-5-haiku-20241022-v1:0'
        ];
    }

    getAvailableRegions() {
        return [
            'us-east-1',
            'us-west-2',
            'eu-west-1',
            'eu-central-1',
            'ap-northeast-1',
            'ap-southeast-1',
            'ap-southeast-2'
        ];
    }

    getProviderInfo() {
        return {
            id: 'bedrock',
            name: 'AWS Bedrock',
            description: 'Claude models via AWS Bedrock (requires server-side proxy for browser)',
            requiresApiKey: true,
            models: this.getAvailableModels(),
            regions: this.getAvailableRegions(),
            browserLimitations: true,
            recommendedSetup: 'server-side-proxy'
        };
    }

    validateConfig(config) {
        if (!config || typeof config !== 'object') {
            return false;
        }

        // Check if config is empty object
        if (Object.keys(config).length === 0) {
            return false;
        }

        // Check AWS credentials
        if (!config.accessKeyId || typeof config.accessKeyId !== 'string') {
            return false;
        }

        if (!config.secretAccessKey || typeof config.secretAccessKey !== 'string') {
            return false;
        }

        // Validate AWS Access Key format
        if (!config.accessKeyId.match(/^AKIA[0-9A-Z]{16}$/) && !config.accessKeyId.match(/^ASIA[0-9A-Z]{16}$/)) {
            return false;
        }

        // Check region if provided
        if (config.region && !this.getAvailableRegions().includes(config.region)) {
            return false;
        }

        // Check model if provided
        if (config.model && !this.getAvailableModels().includes(config.model)) {
            return false;
        }

        return true;
    }

    getBrowserLimitationError() {
        return `AWS Bedrock provider is now supported in browser using AWS SDK v3. However, be aware of security considerations when storing AWS credentials in browser environment. Consider using temporary credentials via AWS Cognito or STS for production use.`;
    }

    getSuggestions() {
        return [
            'Use AWS Cognito Identity Pools for temporary credentials',
            'Implement AWS STS AssumeRole for secure credential management',
            'Configure IAM policies with least privilege access',
            'Store credentials securely using Chrome extension storage',
            'Consider using AWS credentials rotation for enhanced security',
            'Test in development environment before production deployment'
        ];
    }

    getFutureCompatibilityConfig() {
        return {
            awsSDKVersion: '3.540.0+',
            browserSupport: true,
            cognitoIdentityPoolId: 'us-east-1:example-identity-pool-id',
            recommendedAuthMethod: 'cognito-identity',
            iamRoleArn: 'arn:aws:iam::123456789012:role/BedrockBrowserRole',
            documentation: 'https://docs.aws.amazon.com/bedrock/latest/userguide/api-setup.html',
            sdkDocumentation: 'https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_bedrock-runtime_code_examples.html'
        };
    }
}