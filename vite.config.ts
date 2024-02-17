import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  // assetsInclude: [
    // 'src/assets',
  // ],
});
