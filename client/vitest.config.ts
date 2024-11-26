import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        reporter: ['text', 'lcov', 'html'],
        exclude: [
          ...configDefaults.exclude,
          '**/wasm/**',
          '**/*config.js',
          '**/App.vue',
          '**/main.ts',
          'e2e/**'
        ],
      },
      environment: 'jsdom',
      exclude: [
        ...configDefaults.exclude,
        'e2e/**'
      ],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
