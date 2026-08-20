import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://everychecklist.co',
  outDir: './dist',
  build: { format: 'file' },
});
