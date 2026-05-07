#!/usr/bin/env bash
# PreToolUse hook for Bash. Reads the JSON tool input from stdin and blocks
# specific commands with an explanation, redirecting to the right workflow.
#
# Exits 0 if the command is allowed; exits 2 with a JSON payload if blocked.
# Stderr is shown to Claude as feedback when the hook denies.

set -euo pipefail

payload=$(cat)
command=$(printf '%s' "$payload" | jq -r '.tool_input.command // empty')

if [ -z "$command" ]; then
    exit 0
fi

block() {
    local reason="$1"
    jq -n --arg reason "$reason" '{
        hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason: $reason
        }
    }'
    printf '%s\n' "$reason" >&2
    exit 2
}

# 1. Drizzle push está roto en PG18 + drizzle-kit 0.30 — usar migraciones.
if printf '%s' "$command" | grep -qE '(bun (run )?db:push|bunx +drizzle-kit +push|drizzle-kit +push)'; then
    block "db:push está deshabilitado en este proyecto (drizzle-kit 0.30 + Postgres 18 incompatibles). Usa: bun run db:generate && bun run db:migrate"
fi

# 2. Bun es el package manager oficial — no mezclar managers.
if printf '%s' "$command" | grep -qE '^(npm|pnpm|yarn) +(install|i|ci)( |$)'; then
    block "Este proyecto usa Bun. Reemplaza el comando por su equivalente con bun (ej. 'bun install' o 'bun add <paquete>')."
fi

# 3. Comandos destructivos sin confirmación previa.
if printf '%s' "$command" | grep -qE 'rm +-(rf|fr)( |$)'; then
    block "rm -rf está bloqueado por hook. Si realmente lo necesitas, pide confirmación al usuario y ejecútalo a mano."
fi

if printf '%s' "$command" | grep -qE 'git +push +(--force|-f)( |$)'; then
    block "git push --force está bloqueado. Investiga la divergencia con 'git status' y 'git log' antes de forzar."
fi

if printf '%s' "$command" | grep -qE 'git +reset +--hard'; then
    block "git reset --hard puede destruir trabajo no commiteado. Usa 'git stash' o 'git restore --staged' según el caso."
fi

# 4. .env no debe leerse vía cat/head/tail (preferir Read tool con confirmación).
if printf '%s' "$command" | grep -qE '(cat|head|tail|less|more) +\.env( |$)'; then
    block "No leas .env con cat/head/tail (puede exponer secretos en logs). Usa el tool Read si necesitas inspeccionar variables específicas."
fi

exit 0
