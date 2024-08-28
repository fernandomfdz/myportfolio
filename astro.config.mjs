import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import markdownConfig from "./markdown.config";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: markdownConfig,
  integrations: [
    tailwind(),
    vue(),
    expressiveCode(), 
    mdx({
      ...markdownConfig,
      extendPlugins: false,
    }),
  ]
});