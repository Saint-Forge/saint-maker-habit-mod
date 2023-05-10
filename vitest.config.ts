import { defineConfig } from 'vitest/config'
import { getGeneratedAliases } from './getGeneratedAliases'

export default defineConfig({
    resolve: {
        alias: getGeneratedAliases(),
    },
    test: {
        root: '.',
        globals: true,
        setupFiles: './setup.js',
        globalSetup: './src/test-globals.ts',
        watch: false,
        environment: 'jsdom',
        coverage: {
            all: true,
            include: ['src'],
            exclude: ['src/constants', 'src/main.tsx', 'src/theme.ts', 'src/test-globals.ts'],
            provider: 'istanbul',
        },
    },
})
