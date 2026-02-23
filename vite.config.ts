import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/dls-kits/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      format: {
        comments: false
      },
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
