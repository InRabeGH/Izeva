import { headers } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';

export default function AdminDashboard() {
    return (
        <div className="space-y-12">
            <Suspense fallback={<GreetingSkeleton />}>
                <Greeting />
            </Suspense>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Próximos módulos</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>· Productos (crear, editar, publicar, destacar)</li>
                    <li>· Categorías</li>
                    <li>· Pedidos (Fase 2)</li>
                </ul>
                <Button asChild variant="outline">
                    <Link href="/">Ver el sitio público</Link>
                </Button>
            </section>
        </div>
    );
}

async function Greeting() {
    const session = await auth.api.getSession({ headers: await headers() });
    const userName = session?.user.name ?? 'admin';
    const isAdmin = session?.user.role === 'admin';

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Panel
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                    Hola, {userName}
                </h1>
            </div>
            {!isAdmin && <RolePrompt />}
        </div>
    );
}

function GreetingSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-3 w-16 rounded bg-secondary" />
            <div className="h-9 w-64 rounded bg-secondary" />
        </div>
    );
}

function RolePrompt() {
    return (
        <div className="rounded-lg border border-dashed bg-secondary/40 p-6">
            <h2 className="text-base font-semibold">Tu cuenta aún no es admin</h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Para tener acceso completo al panel, actualiza el rol de tu usuario en la base de
                datos. Ejecuta esta query en Drizzle Studio o en una sesión SQL contra Neon:
            </p>
            <pre className="mt-4 overflow-x-auto rounded-md border bg-background p-4 text-xs">
                {`UPDATE "user" SET role = 'admin' WHERE email = 'tu-email@dominio.com';`}
            </pre>
        </div>
    );
}
