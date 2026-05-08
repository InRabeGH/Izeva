'use client';

import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function SignOutButton() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    async function handleClick() {
        setIsPending(true);
        await authClient.signOut();
        router.push('/');
        router.refresh();
    }

    return (
        <Button type="button" variant="ghost" size="sm" onClick={handleClick} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" aria-hidden /> : <LogOut aria-hidden />}
            Salir
        </Button>
    );
}
