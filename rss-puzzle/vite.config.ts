import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, './public') + '/[!.]*',
          dest: './',
        },
      ],
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
