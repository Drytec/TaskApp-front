import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        dashboard: resolve(__dirname, "dashboard.html"),
        signup: resolve(__dirname, "signup.html"),
        profile: resolve(__dirname, "profile.html"),
        "new-task": resolve(__dirname, "new-task.html"),
        "welcome-dashboard": resolve(__dirname, "welcome-dashboard.html"),
        "password-recovery": resolve(__dirname, "password-recovery.html"),
        "reset-password": resolve(__dirname, "reset-password.html"), 
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5100",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});