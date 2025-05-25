import dotenv from 'dotenv';

dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const config = {
    horizonApi: {
        input: `${process.env.NEXT_PUBLIC_API_URL}/v3/api-docs`,
        output: {
            target: './src/api/generated/',
            schemas: './src/api/generated/schemas',
            client: 'react-query',
            mode: 'tags-split',
            mock: false,
            override: {
                mutator: {
                    path: './src/lib/axiosInstance.ts',
                    name: 'axiosInstance',
                },
            },
        },
    },

    horizonApiZod: {
        input: `${process.env.NEXT_PUBLIC_API_URL}/v3/api-docs`,
        output: {
            target: './src/api/generated/',
            client: 'zod',
            mode: 'tags-split',
            fileExtension: '.zod.ts', // to avoid collision with other files
        },
    },
};

export default config;

