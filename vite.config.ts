import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

export default defineConfig({
  // plugins: [react()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
