import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/components/**/*.{js,jsx}',
        'src/utils/**/*.{js,jsx}',
        'src/store/**/*.{js,jsx}',
        'src/api/**/*.{js,jsx}',
        'src/hooks/**/*.{js,jsx}',
        'src/router/**/*.{js,jsx}',
        'src/pages/**/*.{js,jsx}',
      ],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js',
        '**/*.test.js',
        '**/*.test.jsx',
        'src/router/index.jsx',
      ],
      threshold: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});