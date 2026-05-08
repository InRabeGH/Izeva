# Contribuir a Izeva

Gracias por tu interés en contribuir. Este documento explica cómo levantar el
proyecto en local, las convenciones de código y el flujo para enviar cambios.

## Tabla de contenidos

- [Código de conducta](#código-de-conducta)
- [Cómo puedes contribuir](#cómo-puedes-contribuir)
- [Setup local](#setup-local)
- [Workflow de desarrollo](#workflow-de-desarrollo)
- [Convenciones de código](#convenciones-de-código)
- [Convención de commits](#convención-de-commits)
- [Pull Requests](#pull-requests)
- [Pruebas](#pruebas)
- [Documentación](#documentación)
- [Reportar vulnerabilidades](#reportar-vulnerabilidades)

## Código de conducta

Este proyecto sigue el [Código de conducta](CODE_OF_CONDUCT.md) basado en el
Pacto del Colaborador. Al participar se espera que respetes ese código.

## Cómo puedes contribuir

- **Reportar bugs:** abre un issue usando la plantilla de _bug report_
- **Proponer features:** abre un issue usando la plantilla de _feature request_
- **Enviar pull requests:** revisa la sección de [Pull Requests](#pull-requests)
- **Mejorar documentación:** correcciones en `docs/`, `README.md` o cualquier
  otro archivo `.md` son siempre bienvenidas

## Setup local

### Requisitos previos

- [Bun](https://bun.sh) `>= 1.1`
- Cuenta gratuita en [Neon](https://neon.tech) (Postgres serverless)
- Cuenta gratuita en [Uploadthing](https://uploadthing.com)
- (Opcional) Credenciales OAuth de Google si quieres probar login social

### Pasos

```bash
# 1. Clona el repo
git clone git@github.com:InRabeGH/Izeva.git
cd Izeva

# 2. Instala dependencias
bun install

# 3. Copia las variables de entorno
cp .env.example .env

# 4. Edita .env con tus credenciales reales
# - DATABASE_URL: connection string de tu branch dev en Neon
# - BETTER_AUTH_SECRET: openssl rand -base64 32
# - UPLOADTHING_TOKEN: del dashboard de Uploadthing

# 5. Aplica el schema a la base de datos
bun run db:generate
bun run db:migrate

# 6. Levanta el servidor de desarrollo
bun run dev
```

Si vas a contribuir frecuentemente, te recomendamos crear una **branch de Neon
dedicada** para tu desarrollo local. Ver [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Workflow de desarrollo

### Branches

- **`develop`** — branch por defecto, donde se integran todas las features
- **`main`** — solo recibe merges desde `develop` cuando se hace un release

Para tu trabajo crea una branch desde `develop` con uno de estos prefijos:

| Prefijo | Uso |
| --- | --- |
| `feat/` | Nueva funcionalidad |
| `fix/` | Corrección de bug |
| `refactor/` | Refactor sin cambio de comportamiento |
| `docs/` | Solo documentación |
| `chore/` | Tooling, deps, configuración |
| `test/` | Agregar o ajustar pruebas |

Ejemplos: `feat/admin-product-form`, `fix/auth-redirect-loop`,
`refactor/db-helpers`.

### Hooks automáticos (lefthook)

[Lefthook](https://lefthook.dev) corre verificaciones automáticas en
distintos puntos del flujo de git. Se instalan al ejecutar `bun install`
gracias al script `prepare` en `package.json`.

| Hook | Qué corre | Bloquea el commit/push si falla |
| --- | --- | --- |
| `commit-msg` | `commitlint` (Conventional Commits) | ✅ |
| `pre-commit` | `biome check --write` en archivos staged | ✅ (pero auto-corrige y re-stagea) |
| `pre-push` | `tsc --noEmit` + tests unitarios | ✅ |

Si un hook se tarda demasiado, puedes saltarlo con `LEFTHOOK=0 git commit`,
pero **es mala idea** — es probable que CI te rebote igualmente.

### Antes de mandar el PR

```bash
bun run lint        # Biome
bun run typecheck   # TypeScript
bun run knip        # Detectar código/deps muertos
bun test            # Tests
```

> 💡 [Knip](https://knip.dev) detecta archivos, exports y dependencias que
> nadie usa. Si knip se queja de algo que es API pública intencional (un
> tipo que aún no tiene consumidor pero estará disponible para otros
> módulos), márcalo con `/** @public */` y knip lo ignorará. Si se queja
> de una dep que aún no usamos pero usaremos pronto (ej. shadcn primitives),
> agrégala a `ignoreDependencies` en `knip.json` con un comentario.

El [workflow de CI](.github/workflows/ci.yml) corre lo mismo en cada PR
y además [valida que todos los commits sean conventional](.github/workflows/commitlint.yml)
— fallar localmente significa fallar en CI.

## Convenciones de código

- **TypeScript estricto.** Evita `any`. Si necesitas escapar el tipo, usa
  `unknown` y narrowing.
- **Indentación:** 4 espacios. Configurado en [biome.json](biome.json) — el
  formatter lo aplica automáticamente.
- **Comillas:** simples para strings (`'hola'`), dobles para JSX (`<div className="..."/>`)
- **Imports:** `import type { ... }` cuando importas solo tipos
- **Nombrado:**
    - Componentes y clases: `PascalCase` (`ProductCard`, `AuthClient`)
    - Funciones, variables, archivos: `camelCase` (`getProducts`, `userId`)
    - Constantes: `SCREAMING_SNAKE_CASE` (`MAX_UPLOAD_SIZE`)
    - Tablas y columnas en DB: `snake_case` (`product_image`, `created_at`)
- **Comentarios:** evítalos. Si el código no se explica solo, refactoriza
  primero. Solo agrega un comentario cuando exista una razón no obvia
  (un workaround, una invariante oculta, una decisión contraintuitiva).
- **Componentes:** prefiere Server Components por defecto. Solo agrega
  `'use client'` cuando necesites interactividad de browser.
- **Mutaciones:** usa Server Actions con
  [next-safe-action](https://next-safe-action.dev) y validación con Zod 4.

### TailwindCSS

- Sin _dark mode_ por ahora — todo el diseño es _light_
- Si necesitas un valor _custom_, agrégalo a las variables CSS en
  [`app/globals.css`](app/globals.css), no inline en el componente
- Componentes de UI vienen de [shadcn/ui](https://ui.shadcn.com) — añádelos
  con `bunx shadcn@latest add <componente>`

## Convención de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/),
validados por [commitlint](https://commitlint.js.org/) tanto en el hook local
de `commit-msg` como en CI. Formato:

```
<tipo>(<scope opcional>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

| Tipo | Cuándo usarlo |
| --- | --- |
| `feat` | Nueva funcionalidad visible para el usuario |
| `fix` | Corrección de bug |
| `refactor` | Cambio interno sin alterar comportamiento |
| `perf` | Mejora de rendimiento |
| `docs` | Solo documentación |
| `test` | Agrega o ajusta pruebas |
| `chore` | Tooling, dependencias, configuración |
| `ci` | Cambios al pipeline de CI |
| `style` | Formateo, sin cambio de lógica |

### Scopes permitidos

Configurados en [`commitlint.config.mjs`](commitlint.config.mjs):

`admin`, `auth`, `catalog`, `db`, `ui`, `uploadthing`, `config`, `deps`,
`docs`, `claude`, `tests`, `release`.

Si necesitas un scope nuevo, agrégalo al config en el mismo PR donde lo
introduces y justifícalo en la descripción.

### Ejemplos

```
feat(admin): agregar formulario de creación de producto
fix(auth): redirigir a /sign-in cuando la sesión expira
refactor(db): extraer queries comunes a lib/db/queries.ts
docs(readme): actualizar instrucciones de setup
chore(deps): bump drizzle-orm a 0.37
```

### Breaking changes

Marca con `!` después del tipo y agrega un footer `BREAKING CHANGE:`:

```
feat(api)!: cambiar signature de createProduct

BREAKING CHANGE: ahora recibe un objeto en lugar de argumentos posicionales
```

## Releases

Las versiones y el `CHANGELOG.md` los maneja
[release-please](https://github.com/googleapis/release-please) automáticamente:

1. Cuando se mergean commits con `feat:`/`fix:`/etc. a `main`, el workflow
   [`release-please.yml`](.github/workflows/release-please.yml) abre (o
   actualiza) un PR titulado `chore(release): vX.Y.Z`
2. Ese PR incluye el bump de versión en `package.json` + entradas nuevas
   en `CHANGELOG.md` agrupadas por sección (Funcionalidades, Correcciones,
   etc.)
3. Cuando alguien hace merge del PR de release, release-please crea el tag
   `vX.Y.Z` y la release de GitHub correspondientes

**Reglas de versión** (semver):

- `feat:` → bump minor (`0.1.0` → `0.2.0`)
- `fix:` → bump patch (`0.1.0` → `0.1.1`)
- `feat!:` o footer `BREAKING CHANGE:` → bump major (`0.1.0` → `1.0.0`)
- `chore:`, `docs:`, `test:`, etc. → no bump (no aparecen en CHANGELOG por
  default)

> Mientras estemos en `0.x.x` los breaking changes pueden ser bump minor.
> Cuando lleguemos a `1.0.0` la regla es estricta.

## Pull Requests

1. Asegúrate de partir de `develop` actualizado
2. Crea tu branch siguiendo el [naming](#branches)
3. Haz commits siguiendo [convenciones](#convención-de-commits)
4. Antes de abrir el PR corre `bun run lint && bun run typecheck && bun test`
5. Abre el PR contra `develop`
6. Llena la [plantilla del PR](.github/PULL_REQUEST_TEMPLATE.md)
7. Resuelve los comentarios de revisión y espera CI verde
8. Un mantenedor hará merge — preferimos **squash merge** para mantener
   `develop` lineal

### Buenas prácticas

- **Un PR, una responsabilidad.** Si encuentras un bug mientras haces una
  feature, abre un PR aparte para el fix
- **Mantenlos pequeños.** PRs grandes se revisan tarde y mal. Si una feature
  necesita >500 líneas, parte en commits o PRs incrementales
- **Describe el _por qué_, no solo el _qué_.** El diff muestra qué cambia;
  el cuerpo del PR debe explicar la motivación

## Pruebas

Tests con [`bun:test`](https://bun.sh/docs/cli/test).

```bash
bun test                  # todos los tests
bun test --watch          # modo watch
bun test tests/lib        # solo unit tests (sin DB)
bun run test:db           # solo tests que tocan la DB
```

### Estructura

- `tests/lib/` — tests unitarios de helpers puros (sin red, sin DB)
- `tests/db/` — tests que se conectan a Neon (lentos, requieren `DATABASE_URL`)

### Cuándo agregar tests

- **Nueva utilidad pura** (`lib/`) → test unitario en `tests/lib/`
- **Cambio en el schema de DB** → agrega assertion en `tests/db/schema.test.ts`
- **Server Action o lógica que toca la DB** → test de integración en `tests/db/`
- **UI** → no testeamos con jest/vitest aún; valida manualmente con `bun run dev`

## Documentación

- [`README.md`](README.md) — overview y quickstart
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — visión general del stack
  y cómo encajan las piezas
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — despliegue a Vercel + Neon
- [`docs/decisions/`](docs/decisions/) — Architecture Decision Records
  (por qué elegimos cada pieza del stack)

Si tu PR cambia el comportamiento documentado en alguno de esos archivos,
actualízalo en el mismo PR.

## Reportar vulnerabilidades

**No** abras un issue público. Sigue las instrucciones de
[`SECURITY.md`](SECURITY.md).
