'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

export function SignUpForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsPending(true);

        const result = await authClient.signUp.email({
            email,
            password,
            name,
        });

        if (result.error) {
            setError(translateAuthError(result.error.message));
            setIsPending(false);
            return;
        }

        router.push('/admin');
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={1}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                />
            </div>
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
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">Al menos 8 caracteres.</p>
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
                        Creando cuenta…
                    </>
                ) : (
                    'Crear cuenta'
                )}
            </Button>
        </form>
    );
}

function translateAuthError(message: string | undefined) {
    if (!message) return 'No pudimos crear la cuenta. Intenta de nuevo.';
    const lower = message.toLowerCase();
    if (lower.includes('already') || lower.includes('exists'))
        return 'Ya existe una cuenta con ese email.';
    if (lower.includes('password')) return 'La contraseña no cumple los requisitos.';
    return message;
}
