import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const IS_PROD = process.env.VERCEL_ENV === 'production';

export default function robots(): MetadataRoute.Robots {
    if (!IS_PROD) {
        return {
            rules: { userAgent: '*', disallow: '/' },
        };
    }

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/dashboard', '/api'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
