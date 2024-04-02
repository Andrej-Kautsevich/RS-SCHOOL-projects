import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import createSvgSpritePlugin from 'vite-plugin-svg-spriter';
import path from 'path';

const SRC_PATH = path.resolve(__dirname, 'src');
const SVG_FOLDER_PATH = path.resolve(SRC_PATH, 'assets', 'img');

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    createSvgSpritePlugin({
      svgFolder: SVG_FOLDER_PATH,
      transformIndexHtmlTag: {
        injectTo: 'head',
      },
    }),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  base: './',
  publicDir: './public',
});
