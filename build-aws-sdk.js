import { build } from 'esbuild';
import fs from 'fs/promises';

// Create a wrapper module that exports AWS SDK
const wrapperContent = `
export { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
`;

async function buildAwsSdk() {
    try {
        // Write the wrapper file
        await fs.writeFile('aws-sdk-wrapper.js', wrapperContent);
        
        // Bundle the AWS SDK
        await build({
            entryPoints: ['aws-sdk-wrapper.js'],
            bundle: true,
            format: 'esm',
            platform: 'browser',
            outfile: 'dist/aws-sdk-bundle.js',
            minify: true,
            sourcemap: false,
            target: ['chrome90']
        });
        
        // Clean up wrapper file
        await fs.unlink('aws-sdk-wrapper.js');
        
        console.log('AWS SDK bundled successfully');
    } catch (error) {
        console.error('Error bundling AWS SDK:', error);
        process.exit(1);
    }
}

buildAwsSdk();