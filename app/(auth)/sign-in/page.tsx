import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { SignInForm } from '@/components/sign-in-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';

type SearchParams = Promise<{ callbackUrl?: string }>;

export default function SignInPage({ searchParams }: { searchParams: SearchParams }) {
    return (
        <>
            <Suspense fallback={null}>
                <RedirectIfSignedIn searchParams={searchParams} />
            </Suspense>
            <Card>
                <CardHeader>
                    <CardTitle>Entrar a tu cuenta</CardTitle>
                    <CardDescription>Usa tu email y contraseña para continuar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Suspense fallback={<FormSkeleton />}>
                        <SignInFormWithParams searchParams={searchParams} />
                    </Suspense>
                    <p className="text-center text-sm text-muted-foreground">
                        ¿No tienes cuenta?{' '}
                        <Link
                            href="/sign-up"
                            className="font-medium text-foreground hover:underline"
                        >
                            Crea una
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </>
    );
}

async function RedirectIfSignedIn({ searchParams }: { searchParams: SearchParams }) {
    const [{ callbackUrl }, session] = await Promise.all([
        searchParams,
        auth.api.getSession({ headers: await headers() }),
    ]);
    if (session) redirect(callbackUrl ?? '/admin');
    return null;
}

async function SignInFormWithParams({ searchParams }: { searchParams: SearchParams }) {
    const { callbackUrl } = await searchParams;
    return <SignInForm callbackUrl={callbackUrl ?? '/admin'} />;
}

function FormSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-9 rounded-md bg-secondary" />
            <div className="h-9 rounded-md bg-secondary" />
            <div className="h-9 rounded-md bg-secondary/60" />
        </div>
    );
}
