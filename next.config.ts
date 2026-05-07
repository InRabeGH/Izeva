import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const securityHeaders = [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
];

const nextConfig: NextConfig = {
    cacheComponents: true,
    reactCompiler: true,
    poweredByHeader: false,
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'utfs.io' },
            { protocol: 'https', hostname: '*.ufs.sh' },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: securityHeaders,
            },
        ];
    },
};

const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
