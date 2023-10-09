import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteSSR from "vite-ssr/plugin";
import path from "path";

export default defineConfig(() => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: { format: "cjs" },
  plugins: [
    viteSSR(),
    vue({ ssr: true }),
  ],
}));
