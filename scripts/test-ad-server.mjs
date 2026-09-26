import { createServer } from 'vite';
import { readFileSync } from 'node:fs';

// Only this test server substitutes the ad response. Production files retain
// the real provider URL. No website credentials or real ad clicks are needed.
process.env.VITE_SUPABASE_URL = 'http://127.0.0.1:4178';
process.env.VITE_SUPABASE_ANON_KEY = 'local-test-key';
const server = await createServer({
  server: { host: '127.0.0.1', port: 4178, strictPort: true },
  plugins: [{
    name: 'local-ad-regression-fixture',
    configureServer(vite) {
      vite.middlewares.use((req, res, next) => {
        const path = new URL(req.url, 'http://localhost').pathname;
        if (path === '/ads/adsterra-native.html') {
          const html = readFileSync(new URL('../public/ads/adsterra-native.html', import.meta.url), 'utf8')
            .replace('https://pl30819791.effectivecpmnetwork.com/d442018b3295375e1db86739cf9bafcb/invoke.js', '/tests/ads/mock-creative.js');
          res.setHeader('Content-Type', 'text/html'); res.end(html); return;
        }
        if (path.startsWith('/rest/v1/')) {
          res.setHeader('Content-Type', 'application/json'); res.end('[]'); return;
        }
        if (path === '/tests/ads/air') {
          req.url = '/tests/ads/index.html'; next(); return;
        }
        if (path === '/tests/ads/destination' || path === '/tests/ads/hijacked') {
          res.setHeader('Content-Type', 'text/html');
          res.end(`<h1>${path.endsWith('hijacked') ? 'FAIL: parent navigated' : 'Legitimate mock ad destination'}</h1>`); return;
        }
        next();
      });
    },
  }],
});
await server.listen();
console.log('Local-only ad regression fixture: http://127.0.0.1:4178/tests/ads/index.html');
