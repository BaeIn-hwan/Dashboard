import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig((payload) => {
  const mode = payload.mode;
  const env = loadEnv(mode, process.cwd(), "");
  console.log(env);

  return {
    plugins: [react(), tailwindcss()],
    env: {
      browser: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
