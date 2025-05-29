import dotenv from 'dotenv';
import {defaultPlugins, defineConfig } from '@hey-api/openapi-ts';

dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'development'}`,
});

export default defineConfig({
    input: `${process.env.NEXT_PUBLIC_API_URL}/v3/api-docs`,
    output: 'src/api/client',
    plugins: [
        ...defaultPlugins,
        '@hey-api/transformers',
        'zod',
        '@tanstack/react-query',
        {
            name: '@hey-api/client-axios',
            runtimeConfigPath: './src/lib/hey-api.ts',
        },
        {
            enums: 'javascript',
            name: '@hey-api/typescript',
        },
    ],
});