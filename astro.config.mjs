// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://gpumarkets.dev',
  output: 'static',
  build: {
    format: 'directory',
  },
  trailingSlash: 'ignore',
  devToolbar: {
    enabled: false,
  },
});
