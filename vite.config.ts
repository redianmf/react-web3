import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": env,
      global:
        process.env.NODE_ENV === "development" ? { global: "window" } : {},
    },
    plugins: [react()],
  };
});
