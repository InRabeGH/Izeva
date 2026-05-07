# Memoria de Izeva para Claude Code

Este archivo se carga automáticamente al iniciar una sesión en este repo.
Es la fuente de verdad sobre cómo trabajar en Izeva.

## Stack en una línea

Next.js 16 (App Router, Cache Components, React Compiler) + Tailwind v4
+ shadcn/ui + Drizzle + Neon Postgres + Better Auth + Uploadthing.
Bun como runtime/PM. Biome 2 para lint+format. `bun:test` para pruebas.

Para detalle ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Cheatsheet de comandos

```bash
bun run dev           # Servidor de desarrollo (Turbopack)
bun run build         # Build de producción
bun run lint          # Biome check
bun run lint:fix      # Biome check --write
bun run typecheck     # tsc --noEmit
bun run knip          # Detectar código/deps muertos
bun test              # Todos los tests
bun run test:db       # Solo tests de DB
bun run db:generate   # Generar migración SQL desde el schema
bun run db:migrate    # Aplicar migraciones a la DB
bun run db:studio     # UI visual de la DB
```

## Reglas duras

### Nunca

- **Comentarios en código.** Si el código no se explica solo, renómbralo
  o refactorízalo. La única excepción válida es un comentario de _por qué_
  cuando hay una invariante no obvia, un workaround específico, o una
  decisión contraintuitiva. Nunca comentar el _qué_.
- **Crear archivos `.md` por iniciativa propia.** No agregues README,
  guías, notas de implementación ni resúmenes de actividades a menos que
  el usuario lo pida explícitamente. Los `.md` que ya existen en el repo
  (CLAUDE.md, CONTRIBUTING.md, docs/, etc.) son la documentación oficial
  — no inventes paralelas.
- **Referenciar a Claude, agentes, o IA en commits, PRs o código.** Nada
  de `Co-Authored-By: Claude`, ni `Generated with Claude Code`, ni
  comentarios tipo `// added by AI`. Los commits son del usuario humano.
- **`bun run db:push`** — está roto en `drizzle-kit 0.30` con Postgres 18.
  Siempre usar `db:generate` + `db:migrate` (hay un hook que lo bloquea).
- **`npm install` / `pnpm install` / `yarn`** — este proyecto es Bun.
- **`any` en TypeScript.** Si necesitas escapar el tipo, usa `unknown` y
  haz narrowing.
- **`'use client'` por default.** Solo agregarlo cuando el componente
  realmente necesite interactividad de browser.
- **Mockear la DB en tests.** Los tests de `tests/db/` se conectan a
  Neon real (branch `dev`). Para tests sin DB, ponlos en `tests/lib/`.
- **Commit a `main` directo.** El merge a `main` es solo desde `develop`.

### Siempre

- **Conventional Commits** en commits y títulos de PR
- **4 espacios + comillas simples** (Biome lo enforza, ver [`biome.json`](biome.json))
- **`snake_case` en columnas de DB**, `camelCase` en TypeScript,
  `PascalCase` en componentes y clases
- **Validar entrada de Server Actions con Zod** vía
  [next-safe-action](https://next-safe-action.dev)
- **Importar tipos con `import type`** cuando solo se usen como tipos

## Layout del proyecto

```
app/                  Rutas, layouts, páginas (App Router)
  api/auth/[...all]/  Better Auth route handler
  api/uploadthing/    Uploadthing router + endpoint
components/           Componentes reutilizables
  ui/                 Componentes de shadcn (no editar manualmente)
lib/
  auth.ts             Config server de Better Auth
  auth-client.ts      Cliente Better Auth para componentes
  db/
    index.ts          Cliente Drizzle (neon-http)
    schema.ts         Schema (auth + dominio)
  uploadthing.ts      Helpers cliente Uploadthing
  utils.ts            cn() para shadcn
proxy.ts              Protección de /admin y /dashboard (ex-middleware en Next 15)
drizzle/              Migraciones generadas (no editar a mano salvo necesidad)
tests/
  lib/                Unit tests (sin DB)
  db/                 Integration tests (con Neon real)
  setup.ts            Pre-load: chequea env vars
docs/                 Documentación técnica + ADRs
.claude/              Config de Claude Code (este archivo + skills/agents/hooks)
```

## Path aliases

- `@/*` → raíz del repo. Ejemplo: `import { db } from '@/lib/db'`

## Patrones recurrentes

### Crear una Server Action

```ts
'use server';
import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';
import { db } from '@/lib/db';
import { product } from '@/lib/db/schema';

const schema = z.object({
    name: z.string().min(1),
    priceCents: z.number().int().positive(),
});

export const createProduct = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        await db.insert(product).values(parsedInput);
    });
```

### Verificar sesión y rol en server

```ts
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect('/sign-in');
if (session.user.role !== 'admin') redirect('/');
```

### Agregar un componente de shadcn

```bash
bunx shadcn@latest add button input card
```

(O usa la skill `/shadcn-add button input card`.)

### Aplicar un cambio al schema

```bash
bun run db:generate                                    # crea drizzle/000X_*.sql
# revisa el SQL en drizzle/ — ajústalo si Drizzle hizo algo raro
bun run db:migrate                                     # aplica a la DB
bun run test:db                                        # valida
```

(O usa la skill `/migrate`.)

## Skills y agents disponibles

Ver [`.claude/README.md`](.claude/README.md) para el detalle.

| Slash | Para qué |
| --- | --- |
| `/migrate` | Workflow seguro de migración Drizzle |
| `/shadcn-add <componentes>` | Instala componentes de shadcn |
| `/new-adr <título>` | Crea un ADR nuevo en `docs/decisions/` |
| `/commit` | Genera un commit conventional con scope adecuado |
| `/design <tarea>` | Asiste con trabajo de UI manteniendo consistencia con DESIGN.md |

| Agent (subagent) | Para qué |
| --- | --- |
| `schema-reviewer` | Review de cambios a `lib/db/schema.ts` |
| `rsc-auditor` | Detecta `'use client'` innecesarios |

## Documentación crítica

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — cómo encajan las piezas
- [`docs/DESIGN.md`](docs/DESIGN.md) — sistema de diseño (tokens, componentes, voz, A11y). **Lectura obligatoria antes de cualquier trabajo de UI**
- [`docs/decisions/`](docs/decisions/) — por qué cada decisión
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — fases y prioridades
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — workflow detallado
- [`SUPPORT.md`](SUPPORT.md) — FAQ con problemas conocidos
