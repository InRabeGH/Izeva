# Izeva

Catálogo online de carteras, bolsas, joyería, cosméticos y maquillaje.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, Cache Components, React Compiler) |
| UI | Tailwind CSS v4 + shadcn/ui |
| Lenguaje | TypeScript estricto |
| Base de datos | Neon (Postgres serverless) |
| ORM | Drizzle ORM + drizzle-kit |
| Autenticación | Better Auth (email/password + OAuth) |
| Subida de archivos | Uploadthing |
| Validación | Zod 4 + next-safe-action |
| Lint / Format | Biome 2 |
| Runtime / package manager | Bun |
| Tests | `bun:test` |
| Despliegue | Vercel |

## Requisitos

- [Bun](https://bun.sh) `>= 1.3`
- Cuenta en [Neon](https://neon.tech) (Postgres serverless)
- Cuenta en [Uploadthing](https://uploadthing.com)
- (Opcional) Credenciales OAuth de Google

## Setup

```bash
bun install
cp .env.example .env
```

Edita `.env` con tus credenciales reales. Genera el secreto de Better Auth:

```bash
openssl rand -base64 32
```

Aplica el schema a la base de datos:

```bash
bun run db:generate
bun run db:migrate
```

> ⚠️ Por ahora **no uses `bun run db:push`** — un bug de `drizzle-kit 0.30`
> con Postgres 18 lo rompe. Usa el flujo de migraciones de arriba.

Levanta el servidor de desarrollo:

```bash
bun run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Descripción |
| --- | --- |
| `bun run dev` | Servidor de desarrollo con Turbopack |
| `bun run build` | Build de producción |
| `bun run start` | Servir el build |
| `bun run lint` | Lint con Biome |
| `bun run lint:fix` | Lint + autofix |
| `bun run format` | Formatear con Biome |
| `bun run typecheck` | Verificación de tipos |
| `bun run knip` | Detectar código, exports y deps muertos |
| `bun test` | Correr todos los tests |
| `bun run test:db` | Solo tests que tocan la DB |
| `bun run test:watch` | Tests en modo watch |
| `bun run db:generate` | Generar migraciones desde el schema |
| `bun run db:migrate` | Aplicar migraciones |
| `bun run db:studio` | UI visual de la DB |
| `bun run auth:generate` | Regenerar tablas de auth desde la config |

## Estructura

```
app/
  api/auth/[...all]/   Better Auth handler
  api/uploadthing/     Uploadthing route + router
  layout.tsx
  page.tsx
  globals.css
lib/
  auth.ts              Configuración del servidor de Better Auth
  auth-client.ts       Cliente de Better Auth para componentes
  db/
    index.ts           Cliente Drizzle (Neon HTTP)
    schema.ts          Schema (auth + catálogo)
  uploadthing.ts       Helpers cliente de Uploadthing
  utils.ts             cn() para shadcn
proxy.ts               Protección de rutas /admin y /dashboard (ex-middleware en Next 15)
drizzle.config.ts      Config de drizzle-kit
tests/
  lib/                 Tests unitarios (sin DB)
  db/                  Tests de integración con Neon
docs/                  Documentación técnica
```

## Documentación

| Documento | Para qué sirve |
| --- | --- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Visión de alto nivel del stack y cómo se conectan las piezas |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Despliegue a Vercel + Neon, branches por entorno |
| [`docs/decisions/`](docs/decisions/) | Architecture Decision Records — por qué elegimos cada pieza |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Cómo contribuir, convenciones, branching, commits |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | Código de conducta (Pacto del Colaborador 2.1) |
| [`SECURITY.md`](SECURITY.md) | Cómo reportar vulnerabilidades (canal privado) |
| [`SUPPORT.md`](SUPPORT.md) | Canales de soporte y FAQ |
| [`CHANGELOG.md`](CHANGELOG.md) | Historial de cambios (Keep a Changelog) |

## Convenciones

- [Conventional Commits](https://www.conventionalcommits.org/) en commits y títulos de PR
- Indentación de 4 espacios, comillas simples (config en [`biome.json`](biome.json))
- TypeScript estricto, evitar `any`
- Server Actions sobre rutas API tradicionales para mutaciones internas

Para más detalle ver [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Licencia

[MIT](LICENSE)
