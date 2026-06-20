const { join } = require('path');

/**
 * Keep the downloaded Chromium inside the project so it lives next to
 * node_modules on the Vercel build host (instead of the user home cache,
 * which Vercel does not persist between cached builds).
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
