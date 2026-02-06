import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Plugin to copy apps folder to dist during build
function copyApps() {
  return {
    name: 'copy-apps',
    closeBundle() {
      const srcApps = path.join(process.cwd(), 'src', 'apps');
      const distApps = path.join(process.cwd(), 'dist', 'apps');
      if (fs.existsSync(srcApps)) {
        fs.cpSync(srcApps, distApps, { recursive: true });
      }
    }
  };
}

// Plugin to serve apps from src/apps in dev mode with HMR
function serveApps() {
  return {
    name: 'serve-apps',
    configureServer(server) {
      server.middlewares.use('/apps', (req, res, next) => {
        let urlPath = req.url.split('?')[0];
        if (urlPath.startsWith('/apps')) {
          urlPath = urlPath.replace('/apps', '');
        }
        if (urlPath === '' || urlPath === '/') {
          next();
          return;
        }
        const filePath = path.join(process.cwd(), 'src', 'apps', urlPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath);
          const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml'
          };
          res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');

          // Inject HMR client into HTML files
          if (ext === '.html') {
            let content = fs.readFileSync(filePath, 'utf-8');
            // Reload iframe when parent window regains focus
            const hmrScript = `<script>
              (function() {
                let lastSrc = location.href;
                setInterval(function() {
                  if (document.visibilityState === 'visible') {
                    var xhr = new XMLHttpRequest();
                    xhr.open('HEAD', location.href, true);
                    xhr.onload = function() {
                      if (xhr.status === 200 && window.frameElement) {
                        var etag = xhr.getResponseHeader('ETag');
                        if (window.lastEtag !== etag) {
                          window.lastEtag = etag;
                          location.reload();
                        }
                      }
                    };
                    xhr.send();
                  }
                }, 2000);
              })();
            </script>`;
            content = content.replace('</body>', hmrScript + '</body>');
            res.end(content);
          } else {
            res.end(fs.readFileSync(filePath));
          }
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyApps(), serveApps()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['**/*.test.{js,jsx}'],
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
