# Despliegue

Este documento describe cómo desplegar Izeva a producción (Vercel + Neon)
y cómo gestionar branches de DB para distintos entornos.

## Topología

```
GitHub develop ─────► Vercel Preview ─────► Neon branch dev
GitHub main    ─────► Vercel Production ──► Neon branch production
```

Cada `git push` a `develop` o un PR genera un preview en Vercel apuntando
a la branch `dev` de Neon. Solo `main` toca producción.

## Setup inicial

### 1. Neon

Si todavía no tienes proyecto:

1. Ve a [console.neon.tech](https://console.neon.tech) y crea un proyecto
   llamado `Izeva`
2. Región: cercana a tu audiencia (ej. `aws-us-east-1` para México/USA)
3. Postgres version: 18 (default actual)
4. Database name: `neondb` (default)

Crea las branches:

```bash
# Asumiendo neonctl autenticado con NEON_API_KEY en tu shell
bunx neonctl branches create \
    --project-id <tu-project-id> \
    --name dev \
    --parent <production-branch-id>
```

O desde la UI: **Branches** → **Create branch** → name `dev`, parent `production`.

Anota los **connection strings** de cada branch — los necesitas más
abajo. Formato:

```
postgresql://neondb_owner:npg_...@ep-...c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Vercel

#### Vincular el repo

1. Inicia sesión en [vercel.com](https://vercel.com)
2. **New Project** → importa `InRabeGH/Izeva`
3. **Framework Preset:** Next.js (autodetectado)
4. **Build Command:** `bun run build` (o déjalo en `next build` por defecto)
5. **Install Command:** `bun install`
6. **Root Directory:** `./`

#### Variables de entorno

En **Settings → Environment Variables** agrega los valores. Vercel separa
por entorno (`Production`, `Preview`, `Development`) — usa la columna
correspondiente:

| Variable | Production | Preview | Development |
| --- | --- | --- | --- |
| `DATABASE_URL` | branch `production` | branch `dev` | branch `dev` |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` (único y permanente) | mismo o uno aparte | uno local |
| `BETTER_AUTH_URL` | `https://izeva.vercel.app` (o tu dominio) | `https://izeva-git-develop.vercel.app` | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | mismo que `BETTER_AUTH_URL` | mismo | `http://localhost:3000` |
| `UPLOADTHING_TOKEN` | token de producción | token de dev | token de dev |
| `GOOGLE_CLIENT_ID` | (opcional) | (opcional) | (opcional) |
| `GOOGLE_CLIENT_SECRET` | (opcional) | (opcional) | (opcional) |

> ⚠️ **Nunca uses la misma branch de DB para Production y Preview.**
> Un PR mal hecho puede borrar datos reales de tus usuarios. Mantén
> Preview apuntando a `dev` siempre.

#### Branch de despliegue

En **Settings → Git**:

- **Production Branch:** `main`
- Las demás branches generan _previews_ automáticamente

### 3. Configurar dominios OAuth (si usas Google)

Si vas a usar Google OAuth, agrega los redirect URIs en
[Google Cloud Console](https://console.cloud.google.com/apis/credentials):

- `https://izeva.vercel.app/api/auth/callback/google` (production)
- `https://izeva-git-develop.vercel.app/api/auth/callback/google` (preview)
- `http://localhost:3000/api/auth/callback/google` (local)

## Workflow de releases

### Para subir cambios a producción

```bash
# Estás en develop, todo verde
git checkout main
git merge --ff-only develop
git push origin main
```

Vercel detecta el push a `main`, hace build con `DATABASE_URL` apuntando
a la branch `production`, y publica.

> Si falla el `--ff-only`, significa que `main` divergió. Resuelve antes
> de continuar — no hagas merge commit a menos que sea intencional.

### Migraciones de schema

**Antes** de mergear a `main`:

1. Genera la migración localmente:
   ```bash
   bun run db:generate
   ```
2. Verifica el SQL generado en `drizzle/0XXX_<nombre>.sql`. Edítalo a mano
   si Drizzle generó algo que no quieres.
3. Aplica a la branch `dev` para validar:
   ```bash
   bun run db:migrate
   ```
4. Corre los tests de DB: `bun run test:db`
5. Commit del SQL + push del PR
6. Tras merge a `main`, aplica a producción:
   ```bash
   DATABASE_URL=<production-uri> bun run db:migrate
   ```

> 🔮 **A futuro:** un job de GitHub Actions puede correr `db:migrate`
> automáticamente cuando se mergea a `main`. Por ahora se hace a mano
> para reducir el blast radius.

## Branches de Neon como recurso de desarrollo

Una de las cosas más potentes de Neon es que **una branch es prácticamente
gratis**. Aprovecha esto:

### Branch por feature compleja

```bash
bunx neonctl branches create \
    --project-id <id> \
    --name feat-checkout \
    --parent <production-id>
```

Apunta tu `.env` local a esa branch, experimenta libre, y cuando termines
borrar la branch:

```bash
bunx neonctl branches delete feat-checkout --project-id <id>
```

### Branch automática por PR

[Neon GitHub Integration](https://neon.tech/docs/guides/neon-github-integration)
crea una branch nueva por cada PR y la borra al cerrar/mergear. Para
activarla:

1. Instala la app: https://github.com/apps/neon
2. Conecta el proyecto Izeva
3. Vercel automáticamente picks up el `DATABASE_URL` por preview

Esto es _muy_ recomendable cuando tengan tráfico real — cada PR puede
testear contra datos aislados sin contaminar `dev`.

## Troubleshooting

### El build de Vercel falla con `DATABASE_URL is not set`

Drizzle hace `throw new Error('DATABASE_URL is not set')` si la variable
no está. Verifica que esté agregada **en el entorno correcto** (Production
vs Preview).

### `BETTER_AUTH_URL` rebota redirects

Better Auth usa `BETTER_AUTH_URL` como base para construir links de
verificación y callbacks. Si `BETTER_AUTH_URL` no coincide con la URL
real del despliegue (HTTP vs HTTPS, sub-dominio, etc.), los redirects
fallan. Asegúrate de que coincida exactamente con la URL pública.

### Imágenes de Uploadthing 404 en producción

[`next.config.ts`](../next.config.ts) tiene `remotePatterns` permitiendo
`utfs.io` y `*.ufs.sh`. Si Uploadthing emite imágenes desde otro dominio
(podría cambiar entre regiones), agrega ese dominio.
