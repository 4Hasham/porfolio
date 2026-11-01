import { defineConfig, loadEnv } from 'vite';

// Site-wide settings that differ per deployment, read from .env (see
// .env.example):
//   VITE_SITE_URL             the live origin, e.g. https://hashamali.dev —
//                             SEO needs absolute URLs (canonical, Open Graph
//                             image, sitemap), so index.html writes
//                             %SITE_URL% and this plugin fills it in.
//   VITE_GA_MEASUREMENT_ID    Google Analytics 4 ID (G-XXXXXXXXXX). The gtag
//                             snippet is only injected when it's set, so dev
//                             and preview builds don't pollute the stats.
function seoAndAnalytics(env) {
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/+$/, '');
  const gaId = env.VITE_GA_MEASUREMENT_ID || '';

  return {
    name: 'seo-and-analytics',

    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        // Without a site URL the canonical href would be a bare "/", which
        // Vite then tries to bundle as a file — and is meaningless anyway.
        if (!siteUrl) html = html.replace(/\s*<link rel="canonical"[^>]*>/, '');
        html = html.replaceAll('%SITE_URL%', siteUrl);
        if (!gaId) return html;
        return {
          html,
          tags: [
            {
              tag: 'script',
              attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${gaId}` },
              injectTo: 'head',
            },
            {
              tag: 'script',
              children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              injectTo: 'head',
            },
          ],
        };
      },
    },

    // robots.txt and sitemap.xml need the absolute site URL too, so they're
    // written at build time instead of living as static files in public/.
    generateBundle() {
      if (!siteUrl) {
        this.warn('VITE_SITE_URL is not set — canonical/Open Graph URLs and sitemap.xml will be incomplete.');
      }
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [seoAndAnalytics(loadEnv(mode, process.cwd(), 'VITE_'))],
}));
