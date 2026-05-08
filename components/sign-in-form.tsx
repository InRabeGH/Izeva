'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

export function SignInForm({ callbackUrl }: { callbackUrl: string }) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsPending(true);

        const result = await authClient.signIn.email({
            email,
            password,
        });

        if (result.error) {
            setError(translateAuthError(result.error.message));
            setIsPending(false);
            return;
        }

        router.push(callbackUrl);
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                />
            </div>
            {error && (
                <p
                    role="alert"
                    aria-live="polite"
                    className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                >
                    {error}
                </p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="animate-spin" aria-hidden />
                        Entrando…
                    </>
                ) : (
                    'Entrar'
                )}
            </Button>
        </form>
    );
}

function translateAuthError(message: string | undefined) {
    if (!message) return 'No se pudo iniciar sesión. Intenta de nuevo.';
    const lower = message.toLowerCase();
    if (lower.includes('invalid') || lower.includes('password'))
        return 'Email o contraseña incorrectos.';
    if (lower.includes('not found')) return 'No encontramos una cuenta con ese email.';
    return message;
}
