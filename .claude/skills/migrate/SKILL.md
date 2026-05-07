---
name: migrate
description: Safely apply Drizzle schema changes — runs db:generate, lets the user inspect the generated SQL, then runs db:migrate. Never uses db:push (broken on PG18). Use whenever the user changes lib/db/schema.ts and wants to push the change to the DB.
allowed-tools: Bash(bun run db:generate), Bash(bun run db:migrate), Bash(bun run test:db), Read, Glob
arguments: []
---

You are running the safe Drizzle migration workflow for Izeva.

# Steps

## 1. Verify the schema is dirty

Compare `lib/db/schema.ts` against the latest migration in `drizzle/`.
If they're already in sync, tell the user "no schema changes detected —
nothing to migrate" and stop.

## 2. Generate the migration

```bash
bun run db:generate
```

If it prints `No changes detected`, stop with that message.

## 3. Show the user the generated SQL

List the new file(s) under `drizzle/` (the highest-numbered migration).
Read it and show the user the SQL **before** applying. Highlight:

- Any `DROP COLUMN`, `DROP TABLE`, `ALTER TYPE` (data loss risk)
- Any column with `NOT NULL` added to an existing populated table
  (will fail if there are existing rows)
- Any rename (Drizzle may emit `DROP + ADD` instead of `RENAME` —
  flag this)

Ask the user: "¿Aplicar esta migración? (y/n)"

## 4. Apply on confirmation

If user says yes:

```bash
bun run db:migrate
```

If it fails:

- Read the error
- Suggest a path forward (manual edit of the `.sql`, rollback, etc.)
- Do **not** auto-retry

## 5. Verify with tests

```bash
bun run test:db
```

If tests pass, report the migration as successful and remind the user
to commit the new SQL file in `drizzle/` along with the schema change.

# Reglas

- **Nunca uses `db:push`.** Está bloqueado por hook y rompería en PG18.
- **Nunca apliques sin mostrar el SQL primero.** Drizzle puede generar
  cambios destructivos sin avisar.
- **Si la branch de Neon es `production`**, detente y pide confirmación
  explícita antes de migrar — solo migrar a producción se hace desde
  `main` y con un humano dándole enter.
