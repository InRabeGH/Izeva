import { and, eq } from 'drizzle-orm';
import { Instagram, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { product } from '@/lib/db/schema';
import { siteConfig } from '@/lib/site-config';

const SKELETON_KEYS = ['s1', 's2', 's3', 's4'] as const;
const FOOTER_YEAR = 2026;

export default function HomePage() {
    return (
        <main>
            <Hero />
            <Categories />
            <Featured />
            <Story />
            <SiteFooter />
        </main>
    );
}

function Hero() {
    return (
        <section className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-6 py-24 text-center">
            <h1 className="text-6xl font-bold tracking-tight md:text-8xl">{siteConfig.name}</h1>
            <div className="flex flex-col gap-2">
                <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                    {siteConfig.tagline}
                </p>
                <p className="max-w-xl text-sm text-muted-foreground/70">{siteConfig.subtagline}</p>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                    <Link href="#nuevo">Ver lo nuevo</Link>
                </Button>
                {siteConfig.instagram.url && (
                    <Button asChild size="lg" variant="outline">
                        <Link href={siteConfig.instagram.url} target="_blank" rel="noreferrer">
                            <Instagram aria-hidden />
                            Síguenos en Instagram
                        </Link>
                    </Button>
                )}
            </div>
        </section>
    );
}

function Categories() {
    return (
        <section id="categorias" className="border-t py-20">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        Categorías
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                        Encuentra lo que buscas
                    </h2>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {siteConfig.categories.map((category) => (
                        <CategoryCard key={category.slug} label={category.label} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function CategoryCard({ label }: { label: string }) {
    return (
        <div className="group relative flex aspect-square items-center justify-center rounded-lg border bg-secondary/40 p-6 transition-colors hover:bg-secondary">
            <span className="text-center text-base font-medium leading-snug">{label}</span>
        </div>
    );
}

function Featured() {
    return (
        <section id="nuevo" className="border-t bg-secondary/30 py-20">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            Recién llegado
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                            Lo nuevo en {siteConfig.name}
                        </h2>
                    </div>
                </div>
                <Suspense fallback={<FeaturedSkeleton />}>
                    <FeaturedProducts />
                </Suspense>
            </div>
        </section>
    );
}

async function FeaturedProducts() {
    const products = await db
        .select({
            id: product.id,
            slug: product.slug,
            name: product.name,
            priceCents: product.priceCents,
            currency: product.currency,
        })
        .from(product)
        .where(and(eq(product.published, true), eq(product.featured, true)))
        .limit(8);

    if (products.length === 0) {
        return <FeaturedEmptyState />;
    }

    return (
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((p) => (
                <article
                    key={p.id}
                    className="group flex flex-col gap-3 rounded-lg border bg-background p-3 transition-colors hover:border-foreground/20"
                >
                    <div className="aspect-square w-full rounded-md bg-secondary" aria-hidden />
                    <div className="space-y-1 px-1 pb-1">
                        <p className="text-sm font-medium leading-tight">{p.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {formatPrice(p.priceCents, p.currency)}
                        </p>
                    </div>
                </article>
            ))}
        </div>
    );
}

function FeaturedEmptyState() {
    return (
        <div className="mt-12 rounded-lg border border-dashed bg-background py-16 text-center">
            <p className="mx-auto max-w-md px-6 text-base text-muted-foreground">
                Estamos preparando el catálogo. Síguenos para ser la primera en saber cuándo
                publiquemos las nuevas piezas.
            </p>
            {siteConfig.instagram.url && (
                <Button asChild className="mt-6">
                    <Link href={siteConfig.instagram.url} target="_blank" rel="noreferrer">
                        <Instagram aria-hidden />
                        Seguir en Instagram
                    </Link>
                </Button>
            )}
        </div>
    );
}

function FeaturedSkeleton() {
    return (
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {SKELETON_KEYS.map((key) => (
                <div
                    key={key}
                    className="flex animate-pulse flex-col gap-3 rounded-lg border bg-background p-3"
                >
                    <div className="aspect-square w-full rounded-md bg-secondary" />
                    <div className="space-y-2 px-1 pb-1">
                        <div className="h-4 w-3/4 rounded bg-secondary" />
                        <div className="h-4 w-1/3 rounded bg-secondary" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function Story() {
    return (
        <section className="border-t py-24">
            <div className="mx-auto max-w-2xl px-6 text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {siteConfig.story.eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                    {siteConfig.story.title}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                    {siteConfig.story.body}
                </p>
            </div>
        </section>
    );
}

function SiteFooter() {
    const hasContact = Boolean(
        siteConfig.whatsapp.url || siteConfig.instagram.url || siteConfig.email,
    );

    return (
        <footer className="border-t bg-secondary/30 py-12">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-2xl font-bold">{siteConfig.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {siteConfig.subtagline.replace(/\.$/, '')}
                    </p>
                </div>
                {hasContact && (
                    <nav aria-label="Contacto" className="flex flex-col gap-2 text-sm">
                        {siteConfig.whatsapp.url && (
                            <FooterLink
                                href={siteConfig.whatsapp.url}
                                icon={<MessageCircle aria-hidden className="size-4" />}
                                label={siteConfig.whatsapp.label || 'WhatsApp'}
                            />
                        )}
                        {siteConfig.instagram.url && (
                            <FooterLink
                                href={siteConfig.instagram.url}
                                icon={<Instagram aria-hidden className="size-4" />}
                                label={siteConfig.instagram.handle}
                            />
                        )}
                        {siteConfig.email && (
                            <FooterLink
                                href={`mailto:${siteConfig.email}`}
                                icon={<Mail aria-hidden className="size-4" />}
                                label={siteConfig.email}
                            />
                        )}
                    </nav>
                )}
                <p className="text-xs text-muted-foreground">
                    © {FOOTER_YEAR} {siteConfig.name}
                </p>
            </div>
        </footer>
    );
}

function FooterLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
            {icon}
            {label}
        </Link>
    );
}

function formatPrice(cents: number, currency: string) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(cents / 100);
}
