# Configuración de Claude Code para Izeva

Esta carpeta contiene la configuración versionada de [Claude Code](https://docs.claude.com/en/docs/claude-code/overview)
para este proyecto. Todo lo que está aquí se commitea y comparte con el equipo;
para ajustes personales usa `.claude/settings.local.json` (que está en
`.gitignore`).

## Estructura

```
.claude/
├── README.md              # Este archivo
├── settings.json          # Permisos y hooks compartidos
├── settings.local.json    # Personal — NO commitear
├── agents/                # Subagents especializados
│   ├── schema-reviewer.md
│   └── rsc-auditor.md
├── skills/                # Workflows invocables como /skill
│   ├── migrate/SKILL.md
│   ├── new-adr/SKILL.md
│   ├── shadcn-add/SKILL.md
│   └── commit/SKILL.md
└── hooks/                 # Scripts ejecutados en eventos
    ├── guard-bash.sh      # PreToolUse: bloquea comandos peligrosos
    └── format-on-edit.sh  # PostToolUse: corre Biome al editar archivos
```

Adicionalmente, en la raíz del repo:

- [`../CLAUDE.md`](../CLAUDE.md) — memoria de proyecto que Claude Code carga
  automáticamente al iniciar sesión

## Skills (slash commands)

Skills se invocan escribiendo `/<nombre>` en el chat.

| Slash | Qué hace |
| --- | --- |
| [`/migrate`](skills/migrate/SKILL.md) | Workflow seguro de migración Drizzle (genera SQL, lo muestra, aplica si confirmas). **Nunca usa `db:push`.** |
| [`/new-adr <título>`](skills/new-adr/SKILL.md) | Crea un Architecture Decision Record numerado en `docs/decisions/` |
| [`/shadcn-add <componentes>`](skills/shadcn-add/SKILL.md) | Instala componentes de shadcn/ui con `bunx shadcn add` |
| [`/commit`](skills/commit/SKILL.md) | Crea un Conventional Commit detectando type/scope desde el diff |
| [`/design <tarea>`](skills/design/SKILL.md) | Asiste con trabajo de UI manteniendo consistencia con `docs/DESIGN.md` |

## Agents (subagents)

Los agents se lanzan automáticamente por Claude cuando detecta que aplican,
o explícitamente con la herramienta Agent.

| Agent | Cuándo se usa |
| --- | --- |
| [`schema-reviewer`](agents/schema-reviewer.md) | Cada vez que cambias `lib/db/schema.ts`. Revisa naming, FKs, índices, compat con PG18 y Better Auth. |
| [`rsc-auditor`](agents/rsc-auditor.md) | Para detectar `'use client'` innecesarios o ausentes en `app/` y `components/`. |

## Hooks

| Evento | Script | Qué hace |
| --- | --- | --- |
| `PreToolUse` (Bash) | [`hooks/guard-bash.sh`](hooks/guard-bash.sh) | Bloquea `db:push`, `npm/pnpm/yarn install`, `rm -rf`, `git push --force`, `git reset --hard`, leer `.env` con `cat` |
| `PostToolUse` (Edit/Write/MultiEdit) | [`hooks/format-on-edit.sh`](hooks/format-on-edit.sh) | Corre `biome format --write` en archivos editados (silencioso, no-bloqueante) |

Los hooks reciben el payload del tool por stdin como JSON. `guard-bash.sh`
sale con código 2 (denegar) cuando matchea un patrón bloqueado; el resto
de salidas son 0 (permitir).

## Permisos

`settings.json` autoriza por adelantado los comandos de uso frecuente
(`bun run *`, `bunx shadcn`, `bunx neonctl`, `git status/diff/log`,
`gh pr/issue/run view/list`) y deniega por adelantado los peligrosos
(`db:push`, mezclar package managers, `rm -rf`, force push, etc.).

Cualquier comando no listado pide confirmación al usuario al ejecutarse.

## Cómo extender

### Agregar un agent

```bash
touch .claude/agents/<nombre>.md
```

Frontmatter mínimo:

```yaml
---
name: nombre-del-agent
description: Descripción precisa de cuándo invocarlo (la usa Claude para decidir).
tools: Read, Grep, Glob, Bash
model: sonnet
---

System prompt en el cuerpo.
```

### Agregar una skill

```bash
mkdir -p .claude/skills/<nombre>
touch .claude/skills/<nombre>/SKILL.md
```

Frontmatter mínimo:

```yaml
---
name: nombre-skill
description: Cuándo usar la skill.
allowed-tools: Bash(...), Read, Write
arguments: [arg1, arg2]
---

Cuerpo con instrucciones. Usa $1, $2 o $ARGUMENTS para los args.
```

### Agregar un hook

1. Crea el script en `.claude/hooks/<nombre>.sh` y dale `chmod +x`
2. Registralo en `settings.json` bajo `hooks.<EventName>` con un matcher

Eventos disponibles: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`,
`Stop`, `SubagentStop`, `SessionStart`, `SessionEnd`, `Notification`,
`FileChanged`. Ver [docs](https://docs.claude.com/en/docs/claude-code/hooks).

## Convenciones

- **Mantener todo aquí en español** salvo nombres técnicos (los agents
  hablan al modelo, así que pueden estar en inglés si es más natural —
  esos están en inglés)
- **Los hooks deben ser idempotentes y rápidos.** Si un hook tarda más de
  1 segundo, evalúa moverlo a un workflow de CI
- **Nunca commitear `settings.local.json`** — está en gitignore por
  default de Claude Code
- **Cambios a `.claude/` se discuten en PR.** Romper el config afecta a
  todo el equipo
