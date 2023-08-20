import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from "vite-plugin-dts";
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts(),
    Components({
      resolvers: [ElementPlusResolver({})],
      dts:false
    }),
  ],
  build: {
    outDir: "dist",
    minify: false,
    lib: {
      entry: "src/index.ts",
    },
    rollupOptions: {
      external: ["vue",/^element-plus/,"lodash"],
      input: ["src/index.ts"],
      output: [
        {
          format: "es",
          entryFileNames: "[name].mjs",
          preserveModules: true,
          exports: "named",
          dir: "dist",
        },
        {
          format: "cjs",
          entryFileNames: "[name].js",
          preserveModules: true,
          exports: "named",
          dir: "dist",
        },
      ],
    },
  },
})
