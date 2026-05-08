# Arquitectura

Visión de alto nivel del proyecto: el stack, cómo se conectan las piezas
y dónde vive cada responsabilidad.

## Diagrama mental

```
                     ┌─────────────────────────┐
   Browser  ───────► │     Next.js 16          │
                     │  (App Router, RSC, PPR) │
                     │                         │
                     │  ├─ /         (público) │
                     │  ├─ /admin    (proxy)   │
                     │  ├─ /api/auth (BetterA) │
                     │  └─ /api/uploadthing    │
                     └────┬───────────┬────────┘
                          │           │
            ┌─────────────┘           └─────────────┐
            ▼                                       ▼
   ┌────────────────┐                      ┌────────────────┐
   │  Drizzle ORM   │                      │  Uploadthing   │
   │ neon-http      │                      │  (CDN imágenes)│
   └───────┬────────┘                      └────────────────┘
           ▼
   ┌────────────────┐
   │  Neon Postgres │
   │  branches:     │
   │   • production │
   │   • dev        │
   └────────────────┘
```

## Capas y responsabilidades

### 1. Capa de presentación — Next.js 16

**App Router** con Server Components por defecto.
[Cache Components](https://nextjs.org/docs/app/getting-started/caching)
y [React Compiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)
están activos en [`next.config.ts`](../next.config.ts).

| Carpeta | Qué vive ahí |
| --- | --- |
| [`app/`](../app) | Rutas, layouts y páginas |
| [`app/api/auth/[...all]/`](../app/api/auth/%5B...all%5D/) | Catch-all que mountea Better Auth |
| [`app/api/uploadthing/`](../app/api/uploadthing/) | Router y endpoint de Uploadthing |
| [`components/`](../components) | Componentes reutilizables (incluyendo `components/ui/` de shadcn) |
| [`lib/`](../lib) | Helpers, clientes y utilidades compartidas |
| [`proxy.ts`](../proxy.ts) | Protección de rutas (ex-`middleware.ts` en Next 15) |

**Convenciones:**

- **Server Components por default** — solo agregar `'use client'` cuando se
  necesita interactividad
- **Mutaciones** vía Server Actions, envueltas con
  [`next-safe-action`](https://next-safe-action.dev) + Zod 4 para validación
  type-safe
- **No hay API REST** propia — el frontend habla directo con la DB vía
  Server Components/Actions, evitando una capa innecesaria

### 2. Capa de datos — Drizzle + Neon

**Cliente:** [`lib/db/index.ts`](../lib/db/index.ts) crea un singleton
con el driver `drizzle-orm/neon-http` (HTTP edge-friendly, _no_ TCP pool).

**Schema:** [`lib/db/schema.ts`](../lib/db/schema.ts) define todas las
tablas. Convención `snake_case` para columnas.

| Tabla | Origen | Propósito |
| --- | --- | --- |
| `user` | Better Auth + custom field `role` | Cuentas de usuario y rol (`user` / `admin`) |
| `session` | Better Auth | Sesiones activas |
| `account` | Better Auth | Cuentas vinculadas (OAuth providers) |
| `verification` | Better Auth | Tokens de verificación de email/password reset |
| `category` | Dominio | Categorías del catálogo |
| `product` | Dominio | Productos (carteras, joyería, cosméticos…) |
| `product_image` | Dominio | Imágenes asociadas (vienen de Uploadthing) |

**Migraciones:** generadas con `bun run db:generate`, aplicadas con
`bun run db:migrate`. **No usamos `db:push`** por incompatibilidad con
Postgres 18 en `drizzle-kit 0.30`.

**Branching de Neon:** producción y desarrollo viven en branches separadas
del mismo proyecto Neon. Ver [DEPLOYMENT.md](DEPLOYMENT.md) para detalles.

### 3. Autenticación — Better Auth

Configurado en [`lib/auth.ts`](../lib/auth.ts). Soporta:

- Email + password (mínimo 8 chars)
- Google OAuth (opcional, se activa si `GOOGLE_CLIENT_ID` y
  `GOOGLE_CLIENT_SECRET` están en el entorno)
- Cookie cache de 5 min para reducir queries por request
- Plugin `nextCookies()` para que las Server Actions puedan setear cookies

**Cliente:** [`lib/auth-client.ts`](../lib/auth-client.ts) exporta
helpers tipados (`signIn`, `signUp`, `signOut`, `useSession`) para
componentes con `'use client'`.

**Autorización:** la columna custom `user.role` (enum `user` / `admin`) se
usa en:

- [`app/api/uploadthing/core.ts`](../app/api/uploadthing/core.ts) — solo
  admins pueden subir imágenes
- [`proxy.ts`](../proxy.ts) — protege `/admin/*` y `/dashboard/*` (a la
  fecha solo verifica que haya sesión; la verificación de rol vive en cada
  Server Action o Server Component)

### 4. Subida de archivos — Uploadthing

[`app/api/uploadthing/core.ts`](../app/api/uploadthing/core.ts) define el
router con un único endpoint `productImage` (8 imágenes máx, 4MB cada una).

El _middleware_ del router valida sesión y rol; el `onUploadComplete`
devuelve `{ url, key }` que se persiste en `product_image`.

[`lib/uploadthing.ts`](../lib/uploadthing.ts) exporta el `UploadButton` y
`UploadDropzone` tipados para usar en Client Components.

### 5. Pruebas — `bun:test`

Sin frameworks externos. El runner de Bun es nativo y rápido.

| Carpeta | Tipo |
| --- | --- |
| [`tests/lib/`](../tests/lib/) | Unitarios de helpers puros (sin DB) |
| [`tests/db/`](../tests/db/) | Integración: validan conexión y schema contra Neon real |
| [`tests/setup.ts`](../tests/setup.ts) | Pre-load: chequea env vars antes de cada run |

[`bunfig.toml`](../bunfig.toml) configura el preload.

### 6. Tooling

- **Bun** como package manager y runtime de tests/dev
- **Biome 2** como lint + formatter unificado (4 espacios, comillas simples).
  Reemplaza ESLint + Prettier para evitar duplicación de configs
- **TypeScript estricto** — `noUncheckedIndexedAccess` no está activo aún,
  pero el resto de _strict mode_ sí
- **Dependabot** agrupa updates por familia (next, drizzle, auth, tailwind)
  para reducir ruido de PRs

## Flujo de datos típico

### Lectura (catálogo público)

```
URL /                                 (RSC en app/page.tsx)
  └─► await db.select().from(product).where(eq(product.published, true))
        └─► Drizzle → SQL → Neon (HTTP edge)
              └─► Postgres devuelve rows
        └─► Drizzle deserializa
  └─► JSX renderiza ProductCard[]
  └─► Stream HTML al browser (con PPR / Cache Components donde aplique)
```

Cero JavaScript por defecto en el browser. Solo se hidrata si el
componente tiene `'use client'`.

### Escritura (admin crea producto)

```
Form submit → Server Action createProduct(input)
  ├─► Validación con Zod (next-safe-action)
  ├─► Verificación de auth.api.getSession + rol === 'admin'
  ├─► await db.insert(product).values(...)
  ├─► await db.insert(productImage).values(...) por cada imagen
  └─► revalidatePath('/admin/products')
```

Como las Server Actions corren en el servidor, no hay endpoint expuesto
que validar. La superficie de ataque se limita a las cookies de sesión
y la validación Zod en el _entry point_.

## Decisiones clave

Cada una está documentada como un ADR en [`decisions/`](decisions/):

- [`0001-stack-tecnologico.md`](decisions/0001-stack-tecnologico.md) —
  por qué Next.js + Tailwind + shadcn + Drizzle
- [`0002-neon-postgres-sobre-turso-libsql.md`](decisions/0002-neon-postgres-sobre-turso-libsql.md) —
  por qué Postgres en lugar de SQLite/edge
- [`0003-better-auth-sobre-clerk-authjs.md`](decisions/0003-better-auth-sobre-clerk-authjs.md) —
  por qué Better Auth en lugar de Clerk o Auth.js
- [`0004-bun-y-biome.md`](decisions/0004-bun-y-biome.md) —
  por qué Bun en lugar de pnpm y Biome en lugar de ESLint+Prettier

## Lo que **no** está aquí (todavía)

- Búsqueda full-text — usaremos `pg_trgm` o `tsvector` cuando el catálogo lo
  amerite
- Carrito y checkout — fase 2 del proyecto
- Pagos — TBD (probablemente Stripe)
- i18n — el proyecto es solo en español por ahora
- Dark mode — explícitamente fuera de alcance
