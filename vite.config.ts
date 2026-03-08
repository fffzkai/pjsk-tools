import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import * as path from "node:path";
import vitePluginIcon from "./vite-plugins/vite-plugin-icon.ts";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), tailwindcss(), vitePluginIcon()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    }
});
