import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { SignUpForm } from '@/components/sign-up-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';

export default function SignUpPage() {
    return (
        <>
            <Suspense fallback={null}>
                <RedirectIfSignedIn />
            </Suspense>
            <Card>
                <CardHeader>
                    <CardTitle>Crea tu cuenta</CardTitle>
                    <CardDescription>
                        Te tomará menos de un minuto. La contraseña debe tener al menos 8
                        caracteres.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <SignUpForm />
                    <p className="text-center text-sm text-muted-foreground">
                        ¿Ya tienes cuenta?{' '}
                        <Link
                            href="/sign-in"
                            className="font-medium text-foreground hover:underline"
                        >
                            Entra aquí
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </>
    );
}

async function RedirectIfSignedIn() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session) redirect('/admin');
    return null;
}
