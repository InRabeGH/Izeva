import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-svh flex-col">
            <header className="px-6 py-6">
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
                >
                    {siteConfig.name}
                </Link>
            </header>
            <main className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">{children}</div>
            </main>
        </div>
    );
}
