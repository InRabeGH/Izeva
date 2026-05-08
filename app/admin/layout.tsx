import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { SignOutButton } from '@/components/sign-out-button';
import { auth } from '@/lib/auth';
import { siteConfig } from '@/lib/site-config';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-svh flex-col">
            <Suspense fallback={<HeaderSkeleton />}>
                <AdminHeader />
            </Suspense>
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">{children}</main>
        </div>
    );
}

async function AdminHeader() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect('/sign-in?callbackUrl=/admin');

    return (
        <header className="border-b bg-background">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
                <Link href="/admin" className="text-lg font-bold tracking-tight">
                    {siteConfig.name} <span className="text-muted-foreground">/ admin</span>
                </Link>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{session.user.email}</span>
                    <SignOutButton />
                </div>
            </div>
        </header>
    );
}

function HeaderSkeleton() {
    return <div className="h-16 border-b bg-background" aria-hidden />;
}
