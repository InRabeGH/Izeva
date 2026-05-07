# Tests

Tests con [`bun:test`](https://bun.sh/docs/cli/test) (built-in, sin config).

## Correr

```bash
bun test                  # todos los tests
bun test --watch          # modo watch
bun test tests/db         # solo tests de DB
bun test tests/lib        # solo tests de utilities
```

## Estructura

- `tests/setup.ts` — chequea que existan las env vars antes de correr cualquier test
- `tests/db/` — tests que tocan la base de datos real (Neon)
- `tests/lib/` — tests unitarios de helpers puros

## Pre-requisitos para tests de DB

Los tests bajo `tests/db/` se conectan a una base de datos **real**. Antes de ejecutarlos:

1. `DATABASE_URL` debe estar configurada en `.env`
2. El schema debe estar aplicado: `bun run db:push`

> Recomendación: apunta `DATABASE_URL` a una **branch de Neon dedicada a tests**
> (ej. `branch dev-tests`), no a producción. Las branches de Neon son baratas y
> aisladas.
