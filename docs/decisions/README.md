# Architecture Decision Records (ADRs)

Cada archivo numerado en esta carpeta documenta una **decisión técnica
importante**: el contexto que la motivó, las alternativas que se evaluaron,
la decisión que se tomó y sus consecuencias.

## ¿Por qué?

A los seis meses se nos olvida _por qué_ elegimos algo. Después llega
alguien (o nosotros mismos), ve la elección, le parece rara, y se gasta
una semana cambiándola — solo para descubrir que la primera elección era
correcta.

Los ADRs son nuestra memoria escrita: capturan el _por qué_ en el momento
en que la decisión está fresca.

## Cuándo escribir uno

- Eliges entre múltiples librerías/frameworks que cumplen la misma función
- Adoptas un patrón arquitectural que afecta a varios módulos
- Decides _no_ hacer algo (también es decisión)
- Cambias una decisión previa — entonces creas un ADR nuevo que reemplaza
  el anterior, sin borrar el viejo

## Cuándo **no** escribir uno

- Decisiones reversibles en horas (nombre de variable, color de un botón)
- Convenciones de estilo (van en CONTRIBUTING)
- Detalles de implementación de un módulo (van en comentarios o nombres)

## Formato

Usamos [MADR](https://adr.github.io/madr/) simplificado:

```markdown
# NNNN. Título corto en imperativo

- **Fecha:** YYYY-MM-DD
- **Estado:** propuesto | aceptado | reemplazado por NNNN | descartado

## Contexto

Qué problema motiva la decisión. Restricciones, requisitos, fuerzas en juego.

## Decisión

Qué se decidió. Fórmula activa: "Vamos a usar X."

## Alternativas consideradas

Lista corta de lo que evaluamos y por qué no.

## Consecuencias

Qué se vuelve más fácil. Qué se vuelve más difícil. Qué deuda asumimos.
```

## Numeración

Sucesiva, empezando en `0001`. No reutilices números aunque borres un ADR
(deja el anterior con estado `descartado`).

## Índice

- [`0001-stack-tecnologico.md`](0001-stack-tecnologico.md) — Selección
  inicial del stack: Next.js 16, Tailwind v4, shadcn, Drizzle
- [`0002-neon-postgres-sobre-turso-libsql.md`](0002-neon-postgres-sobre-turso-libsql.md) —
  Postgres serverless en lugar de SQLite/edge
- [`0003-better-auth-sobre-clerk-authjs.md`](0003-better-auth-sobre-clerk-authjs.md) —
  Better Auth como solución de autenticación
- [`0004-bun-y-biome.md`](0004-bun-y-biome.md) — Bun + Biome para tooling
