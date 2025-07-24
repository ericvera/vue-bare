import vue from '@vitejs/plugin-vue'
import { PluginOption } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [vue()] as PluginOption[],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/*.test.ts'],
    mockReset: true,
    restoreMocks: true,
  },
})
