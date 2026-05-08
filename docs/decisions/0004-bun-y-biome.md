# 0004. Adoptar Bun como runtime/package manager y Biome como lint+format

- **Fecha:** 2026-05-07
- **Estado:** aceptado

## Contexto

Para un proyecto nuevo en TypeScript necesitamos elegir:

- **Package manager** — npm, pnpm, yarn, o Bun
- **Runtime** para tooling local (tests, scripts) — Node, Deno, o Bun
- **Linter + Formatter** — ESLint + Prettier, Biome, o oxlint

Restricciones / objetivos:

- Velocidad: el ciclo `install → lint → test → build` se corre muchísimo.
  Cada segundo cuenta.
- Mantenimiento mínimo: queremos pocas configs, no quince archivos
  `.eslintrc.*`, `.prettierrc.*`, `.npmrc`.
- Compatibilidad con Vercel (donde se despliega). Vercel detecta Bun
  automáticamente en sus builds.

## Decisión

- **Bun 1.3+** como package manager y runtime de desarrollo (tests,
  scripts ad-hoc, CLI tools como `neonctl`)
- **Biome 2** como linter + formatter unificado

## Alternativas consideradas

### Package manager

| Opción | Pros | Contras |
| --- | --- | --- |
| **npm** | Default, viene con Node | Lento, lockfile gigante |
| **pnpm** | Rápido, _content-addressable_ store | Symlinks pueden romper en algunos contextos (Docker, CI raros) |
| **yarn 4** | Berry trae features avanzadas | Curva de aprendizaje, _zero installs_ es polémico |
| **Bun** | Más rápido que todos los anteriores, lockfile texto, runtime + PM unificado | Más nuevo, edge cases ocasionales |

Bun 1.3 es estable y tiene un ecosistema en explosión. Su lockfile en texto
(`bun.lock`) es legible en code review, a diferencia del binario `bun.lockb`.

### Runtime para tests

| Opción | Pros | Contras |
| --- | --- | --- |
| **Vitest** | DX excelente, muy popular, snapshot testing | Otra dependencia más, configuración aparte |
| **Jest** | Estándar histórico | Lento, configuración pesada, ESM friction |
| **`bun:test`** | Built-in en Bun, sin config, ~2x más rápido que Vitest | Menos plugins (no hay coverage HTML out of the box) |

Para un proyecto que ya usa Bun, `bun:test` es la opción de menor fricción.
La API es Jest-compatible (`describe`, `test`, `expect`), y migrar a
Vitest después es trivial si lo necesitamos.

### Lint + format

| Opción | Pros | Contras |
| --- | --- | --- |
| **ESLint + Prettier** | Ecosistema enorme, plugins para todo | Lento, dos configs, conflictos comunes entre ambos |
| **Biome 2** | ~25× más rápido, una config, hecho en Rust | Menos plugins, no soporta todas las reglas de ESLint |
| **oxlint** | El más rápido, también Rust | Sin formatter, todavía joven |

Biome tiene la mayoría de las reglas que importan (correctness, suspicious,
style) y un formatter equivalente a Prettier. Las pocas reglas custom de
ESLint que perdemos no se usan en este proyecto.

## Consecuencias

### Más fácil

- **`bun install`** es 10–20× más rápido que `npm install` en cold cache.
  Onboarding de un colaborador toma segundos.
- **Una sola config** ([`biome.json`](../../biome.json)) para lint+format.
  Editor configurado con la extensión de Biome y se acabó.
- **Tests rápidos** — `bun test` corre en milisegundos para los unit
  tests, lo que permite TDD real sin frustración.
- **`bunx`** funciona como `npx` pero más rápido y sin descargas
  duplicadas.

### Más difícil

- **Dependencias con post-install scripts** (raros en TypeScript moderno
  pero existen) pueden requerir `bun install --trust`. Hasta ahora
  ninguna dep nuestra ha pedido eso.
- **CI tiene que instalar Bun** explícitamente (`oven-sh/setup-bun@v2`
  ya está en [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)).
- **Algunas APIs Node-específicas** pueden comportarse distinto en Bun
  (esp. streams). Si pasa, podemos seguir corriendo el código de
  producción en Node (Vercel) — Bun es solo nuestro tooling local.
- **Reglas de Biome** son un subconjunto de las de ESLint. Si en algún
  momento necesitamos una regla específica que solo existe como plugin
  ESLint, evaluamos: importarla o pasarnos a la config dual.

### Riesgos asumidos

- Bun y Biome son proyectos jóvenes. Si alguno desaparece o cambia de
  licencia, migrar back a Node + ESLint+Prettier es viable pero
  costoso.
- Algunas librerías legacy podrían no funcionar bien con Bun. Hasta
  ahora no hemos encontrado ninguna en este proyecto, pero es algo a
  validar antes de adoptar libs nuevas.
