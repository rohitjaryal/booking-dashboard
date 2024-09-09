// https://vitejs.dev/config/
/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  test: {
    globals: true,
  },
  base: "https://rohitjaryal.github.io/booking-dashboard/",
  plugins: [vue()],
});
