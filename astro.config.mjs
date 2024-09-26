import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import glsl from "vite-plugin-glsl";
import vue from "@astrojs/vue";
import markdownConfig from "./markdown.config";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import { templateCompilerOptions } from "@tresjs/core";

// https://astro.build/config
export default defineConfig({
  markdown: markdownConfig,
  integrations: [
    tailwind(),
    vue({
      ...templateCompilerOptions,
    }),
    expressiveCode(),
    mdx({
      ...markdownConfig,
      extendPlugins: false,
    }),
  ],
  vite: {
    plugins: [glsl()]
  }
});