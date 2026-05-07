#!/usr/bin/env bash
# PostToolUse hook for Edit/Write/MultiEdit. Auto-formats the modified file
# with Biome if it's a TS/TSX/JS/JSON/MD file inside the project.
#
# Silently no-ops on:
# - Files outside the repo
# - Files in node_modules, .next, drizzle/, dist
# - Files where Biome doesn't apply (lockfiles, env files, etc.)
#
# Errors are non-blocking (exit 0) so a formatting failure never blocks
# Claude's progress.

set -uo pipefail

payload=$(cat)
file_path=$(printf '%s' "$payload" | jq -r '.tool_input.file_path // empty')

if [ -z "$file_path" ] || [ ! -f "$file_path" ]; then
    exit 0
fi

case "$file_path" in
    *node_modules/* | *.next/* | *drizzle/0*.sql | *dist/* | *build/* | *coverage/*)
        exit 0
        ;;
    *.env | *.env.* | *bun.lock | *package-lock.json | *pnpm-lock.yaml)
        exit 0
        ;;
esac

case "$file_path" in
    *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.json | *.jsonc | *.md | *.css)
        ;;
    *)
        exit 0
        ;;
esac

# Use absolute path so Biome always finds the right file.
abs_path=$(realpath "$file_path" 2>/dev/null || echo "$file_path")

# Bun may not be on PATH for hooks — try common locations.
if command -v bunx >/dev/null 2>&1; then
    bunx biome format --write "$abs_path" >/dev/null 2>&1 || true
elif [ -x "$HOME/.bun/bin/bunx" ]; then
    "$HOME/.bun/bin/bunx" biome format --write "$abs_path" >/dev/null 2>&1 || true
fi

exit 0
