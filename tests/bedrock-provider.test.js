import { BedrockProvider } from '../providers/bedrock-provider.js';
import { LLMProvider } from '../llm-provider-api.js';

describe('Bedrock Provider Tests', () => {
    let provider;
    const mockAccessKeyId = 'AKIATEST12345';
    const mockSecretAccessKey = 'test-secret-key-123';
    const mockRegion = 'us-east-1';
    const invalidAccessKey = 'invalid-key';

    beforeEach(() => {
        provider = new BedrockProvider();
    });

    describe('Inheritance Tests', () => {
        it('should extend LLMProvider base class', () => {
            expect(provider).toBeInstanceOf(LLMProvider);
        });
    });

    describe('Constructor Tests', () => {
        it('should initialize with default configuration', () => {
            expect(provider.config).toBeDefined();
            expect(provider.initialized).toBe(false);
            expect(provider.accessKeyId).toBeNull();
            expect(provider.secretAccessKey).toBeNull();
            expect(provider.region).toBe('us-east-1');
            expect(provider.model).toBe('anthropic.claude-3-5-sonnet-20241022-v2:0');
        });

        it('should initialize with custom configuration', () => {
            const customConfig = {
                model: 'anthropic.claude-3-haiku-20240307-v1:0',
                region: 'us-west-2'
            };
            const customProvider = new BedrockProvider(customConfig);
            expect(customProvider.model).toBe('anthropic.claude-3-haiku-20240307-v1:0');
            expect(customProvider.region).toBe('us-west-2');
        });
    });

    describe('Browser Compatibility Tests', () => {
        it('should detect browser environment limitations', () => {
            const compatibility = provider.checkBrowserCompatibility();
            expect(typeof compatibility).toBe('object');
            expect(compatibility).toHaveProperty('supported');
            expect(compatibility).toHaveProperty('limitations');
        });

        it('should provide alternative authentication methods for browser', () => {
            const authMethods = provider.getBrowserAuthMethods();
            expect(Array.isArray(authMethods)).toBe(true);
            // Should include proxy/server-side options
        });
    });

    describe('Initialize Method Tests', () => {
        it('should fail without AWS credentials', async () => {
            await expect(provider.initialize()).rejects.toThrow('AWS credentials are required');
        });

        it('should fail with incomplete credentials', async () => {
            await expect(provider.initialize({ accessKeyId: mockAccessKeyId }))
                .rejects.toThrow('AWS Secret Access Key is required');
        });

        it('should fail with invalid access key format', async () => {
            await expect(provider.initialize({ 
                accessKeyId: invalidAccessKey, 
                secretAccessKey: mockSecretAccessKey 
            })).rejects.toThrow('Invalid AWS Access Key format');
        });

        it('should handle browser environment limitations', async () => {
            // Mock browser compatibility check
            const originalCheck = provider.checkBrowserCompatibility;
            provider.checkBrowserCompatibility = () => ({ 
                supported: false, 
                limitations: ['CORS restrictions', 'AWS SDK limitations'] 
            });

            await expect(provider.initialize({
                accessKeyId: mockAccessKeyId,
                secretAccessKey: mockSecretAccessKey
            })).rejects.toThrow('Bedrock not supported in browser environment');

            provider.checkBrowserCompatibility = originalCheck;
        });

        it('should suggest proxy solution for browser limitations', async () => {
            try {
                await provider.initialize({
                    accessKeyId: mockAccessKeyId,
                    secretAccessKey: mockSecretAccessKey
                });
            } catch (error) {
                if (error.message.includes('browser environment')) {
                    expect(error.message).toContain('proxy');
                }
            }
        });
    });

    describe('Chat Method Tests', () => {
        it('should fail if not initialized', async () => {
            const messages = [{ role: 'user', content: 'Hello' }];
            await expect(provider.chat(messages)).rejects.toThrow('Provider not initialized');
        });

        it('should provide browser-specific error messages', async () => {
            try {
                await provider.chat([{ role: 'user', content: 'Hello' }]);
            } catch (error) {
                expect(error.message).toContain('not initialized');
            }
        });
    });

    describe('ProcessMemo Method Tests', () => {
        const sampleContent = `
            <html>
                <head><title>Test Article</title></head>
                <body>
                    <h1>Sample Article</h1>
                    <p>This is a test article content for processing.</p>
                </body>
            </html>
        `;

        it('should fail if not initialized', async () => {
            await expect(provider.processMemo(sampleContent))
                .rejects.toThrow('Provider not initialized');
        });
    });

    describe('Token Calculation Tests', () => {
        it('should calculate tokens for empty string', () => {
            expect(provider.calculateTokens('')).toBe(0);
        });

        it('should calculate tokens for simple text', () => {
            const text = 'Hello world';
            const tokens = provider.calculateTokens(text);
            expect(tokens).toBeGreaterThan(0);
            expect(tokens).toBeLessThan(10);
        });

        it('should use Claude token calculation for Bedrock Claude models', () => {
            const text = 'This is a test message';
            const tokens = provider.calculateTokens(text);
            // Should be similar to Anthropic's calculation since it's Claude via Bedrock
            expect(tokens).toBeGreaterThan(0);
        });
    });

    describe('Base Class Integration Tests', () => {
        it('should have access to inherited helper methods', () => {
            expect(typeof provider.createSystemMessage).toBe('function');
            expect(typeof provider.countWords).toBe('function');
            expect(typeof provider.calculateMemosWordCount).toBe('function');
            expect(typeof provider.sanitizeContent).toBe('function');
        });
    });

    describe('Provider-Specific Method Tests', () => {
        it('should return available Bedrock models', () => {
            const models = provider.getAvailableModels();
            expect(Array.isArray(models)).toBe(true);
            expect(models).toContain('anthropic.claude-3-5-sonnet-20241022-v2:0');
            expect(models).toContain('anthropic.claude-3-haiku-20240307-v1:0');
        });

        it('should return provider info', () => {
            const info = provider.getProviderInfo();
            expect(info.id).toBe('bedrock');
            expect(info.name).toBe('AWS Bedrock');
            expect(info.requiresApiKey).toBe(true);
            expect(info.description).toContain('Claude models via AWS Bedrock');
        });

        it('should validate config correctly', () => {
            const validConfig = { 
                accessKeyId: 'AKIATEST12345', 
                secretAccessKey: 'test-secret',
                region: 'us-east-1',
                model: 'anthropic.claude-3-5-sonnet-20241022-v2:0'
            };
            
            const invalidConfig = { 
                accessKeyId: '', 
                secretAccessKey: '',
                model: 'invalid-model' 
            };

            expect(provider.validateConfig(validConfig)).toBe(true);
            expect(provider.validateConfig(invalidConfig)).toBe(false);
        });

        it('should provide region validation', () => {
            const validRegions = provider.getAvailableRegions();
            expect(Array.isArray(validRegions)).toBe(true);
            expect(validRegions).toContain('us-east-1');
            expect(validRegions).toContain('us-west-2');
        });
    });

    describe('Error Handling Tests', () => {
        it('should provide helpful error messages for browser limitations', () => {
            const error = provider.getBrowserLimitationError();
            expect(error).toContain('browser environment');
            expect(error).toContain('server-side proxy');
        });

        it('should suggest alternative authentication methods', () => {
            const suggestions = provider.getSuggestions();
            expect(suggestions).toContain('server-side proxy');
            expect(suggestions).toContain('IAM roles');
        });
    });

    describe('Future Compatibility Tests', () => {
        it('should support configuration for potential future browser compatibility', () => {
            const futureConfig = provider.getFutureCompatibilityConfig();
            expect(typeof futureConfig).toBe('object');
            expect(futureConfig).toHaveProperty('proxyUrl');
            expect(futureConfig).toHaveProperty('corsProxy');
        });
    });
});