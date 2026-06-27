import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.getemoji.online',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  server: {
    port: 4321,
  },
});
