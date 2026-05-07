---
name: commit
description: Creates a Conventional Commit for staged or unstaged changes. Auto-detects the right type (feat/fix/refactor/docs/chore/test/ci) and scope (admin/auth/db/ui/catalog/uploadthing/config) based on the diff. Asks the user for confirmation before committing. Use whenever the user says "commit this" or "haz commit".
allowed-tools: Bash(git status*), Bash(git diff*), Bash(git log*), Bash(git add *), Bash(git commit *)
arguments: []
---

You are creating a Conventional Commit for Izeva.

# Steps

## 1. Inspect the working tree

Run in parallel:

- `git status` — see untracked + modified
- `git diff --staged` — see what's staged
- `git diff` — see what's modified but not staged
- `git log -5 --oneline` — see recent commit style

If there are no changes (staged or unstaged), tell the user
"no hay cambios para commitear" and stop.

## 2. Decide the type

Use the diff to pick the most accurate type. Definitions:

| Tipo | Cuándo |
| --- | --- |
| `feat` | Nueva funcionalidad visible para el usuario |
| `fix` | Corrección de bug observable |
| `refactor` | Reestructura código sin cambiar comportamiento |
| `perf` | Mejora de rendimiento |
| `docs` | Solo `.md` o comentarios de docstring |
| `test` | Solo archivos en `tests/` o ajustes a tests existentes |
| `chore` | Tooling, deps, configuración (`.github/`, `.claude/`, `package.json`, `biome.json`, etc.) |
| `ci` | Cambios solo en `.github/workflows/` |
| `style` | Formato, sin lógica (raro — Biome ya formatea) |

**Si el diff toca múltiples categorías, elige la dominante** (la que
contenga más cambios sustanciales). No inventes scopes plurales.

## 3. Decide el scope

Scopes válidos para este proyecto:

- `admin` — código bajo `app/admin/` o panel administrador
- `auth` — `lib/auth*`, `app/sign-*`, `proxy.ts`
- `catalog` — código del catálogo público
- `db` — `lib/db/`, `drizzle.config.ts`, `drizzle/`
- `ui` — `components/`, `app/globals.css`
- `uploadthing` — `lib/uploadthing.ts`, `app/api/uploadthing/`
- `config` — configuración general que no cae en los anteriores
- `deps` — solo cambios a `package.json`/`bun.lock`
- `docs` — cuando type es `docs`, scope opcional indicando qué doc
- `claude` — cambios en `.claude/` o `CLAUDE.md`

Si ningún scope aplica claramente, omítelo (commit válido sin scope).

## 4. Redacta el mensaje

Formato:

```
<type>(<scope>): <descripción corta en español, imperativo, sin punto final>

[cuerpo opcional explicando *por qué*, no qué]
```

Reglas:

- **Imperativo** en español: "agregar X", "corregir Y", no "agregado X"
- **Línea de asunto ≤ 72 chars**
- **Cuerpo solo si aporta contexto.** El diff ya muestra qué cambia;
  el cuerpo explica por qué
- **Breaking change?** Agrega `!` después del scope y un footer:
  ```
  feat(api)!: cambiar firma de createProduct

  BREAKING CHANGE: ahora recibe un objeto en vez de args posicionales
  ```

## 5. Muestra y pide confirmación

Imprime el mensaje propuesto al usuario y pregunta:

```
¿Commitear con este mensaje? (y / editar / cancelar)
```

- `y` o `sí` — proceder
- `editar` o cualquier texto distinto — usar el texto del usuario en su lugar
- `cancelar` o `n` — abortar sin commitear

## 6. Stage + commit

Si el usuario confirma:

- Si hay cambios sin staged, pregunta primero: "¿stagear todos los
  archivos modificados?" — si sí, `git add -A`. Si no, dile al usuario
  que stagee manualmente y vuelva a invocar la skill
- Hacer commit con HEREDOC para preservar formato:
  ```bash
  git commit -m "$(cat <<'EOF'
  <mensaje>
  EOF
  )"
  ```
- Después corre `git status` para confirmar el commit

## 7. Reporta

- Hash corto del commit
- Mensaje final
- Recordatorio: si el commit incluye breaking change, marcar el PR
  como tal en la descripción

# Reglas

- **Nunca referenciar a Claude, agentes o IA en el commit.** Esto incluye:
    - **No** agregar `Co-Authored-By: Claude` ni `Co-Authored-By: <bot>`
    - **No** poner `Generated with Claude Code` (ni cualquier variante)
      en el cuerpo
    - **No** mencionar "agent", "AI", "LLM" en el mensaje del commit
    - El commit es del usuario humano. Punto.
- **Nunca `--no-verify`.** Si un hook de pre-commit falla, investiga
  el error en lugar de saltártelo.
- **Nunca `--amend`** salvo que el usuario lo pida explícitamente.
  Es preferible un commit nuevo.
- **Nunca `git push`** desde esta skill. Solo crea el commit.
