import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

const SRC_PATH = path.resolve(__dirname, 'src');
const SVG_FOLDER_PATH = path.resolve(SRC_PATH, 'assets', 'img');

export default defineConfig({
  plugins: [
    tsconfigPaths(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  base: './',
  publicDir: './public',
});