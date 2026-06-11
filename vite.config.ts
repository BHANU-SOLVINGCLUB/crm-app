import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Resolves trailing-slash URLs under /krisantec/doc/ to their index.html
// before Vite's SPA fallback hijacks the request.
function staticDocFallback() {
  return {
    name: 'static-doc-fallback',
    configureServer(server: { middlewares: { use: (fn: (req: { url?: string }, _res: unknown, next: () => void) => void) => void } }) {
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          const workStatusMatch = req.url.match(/^\/krisantec\/doc\/workstatus\/(\d{4}-\d{2}-\d{2})\/?$/)
          if (workStatusMatch) {
            const date = workStatusMatch[1]
            req.url = `/krisantec/doc/index.html?workDate=${date}#daily-work`
            next()
            return
          }
        }
        if (req.url && req.url.startsWith('/krisantec/doc') && req.url.endsWith('/')) {
          req.url = req.url + 'index.html'
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), staticDocFallback()],
  server: {
    port: 5180,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
