import { defineConfig } from 'vitest/config'
import { getGeneratedAliases } from './getGeneratedAliases'

export default defineConfig({
    resolve: {
        alias: getGeneratedAliases(),
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './setup.js',
        globalSetup: './src/test-globals.ts',
        watch: false,
        coverage: {
            all: true,
            provider: 'istanbul',
            exclude: [
                'src/App.tsx',
                'src/main.tsx',
                'src/components',
                'src/constants',
                'src/pages',
                'src/redux',
                'src/styles',
                'src/tests',
                'src/utils/localStorage.ts',
            ],
            lines: 100,
            functions: 100,
            branches: 100,
            statements: 100,
        },
    },
})
