/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'build',
    chunkSizeWarningLimit: 700,
  },
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  server: {
    host: true,
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8', // 'v8' or 'istanbul'
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/src/setupTests.ts',
        '**/__mocks__/*',
        '**/node_modules/**/*',
        '**/build/**',
        '**/dist/**',
        '**/coverage/**',
        '**/public/**',
        '**/*.d.ts',
        '**/index.tsx',
        '**/index.ts',
        '**/index.html',
        '**/.eslintrc.cjs',
        '**/*.config.{js, ts}',
      ],
    },
  },
});
