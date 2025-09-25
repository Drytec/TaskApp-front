import { defineConfig } from "vite";
import { resolve } from "path";

/**
 * Vite configuration file
 * 
 * @file vite.config.js
 * @description Configuration for Vite build and development server, including multiple HTML entry points
 *              and API proxy setup for local development.
 * 
 * @see {@link https://vitejs.dev/config/} for more configuration options.
 */
export default defineConfig({
  /**
   * Build options
   * @type {Object}
   */
  build: {
    rollupOptions: {
      /**
       * Multiple HTML entry points for Vite build
       * @type {Object<string, string>}
       */
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

  /**
   * Development server configuration
   * @type {Object}
   */
  server: {
    /**
     * Proxy configuration to redirect API calls to backend server
     * Useful for local development to avoid CORS issues
     */
    proxy: {
      "/api": {
        target: "http://localhost:5100",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
