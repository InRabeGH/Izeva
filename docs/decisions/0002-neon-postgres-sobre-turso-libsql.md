# 0002. Usar Neon (Postgres) en lugar de Turso/LibSQL

- **Fecha:** 2026-05-07
- **Estado:** aceptado

## Contexto

Necesitamos una base de datos para Izeva con estos requisitos:

- **Serverless / pago por uso** — el tráfico inicial es bajo, no queremos
  pagar por una instancia siempre encendida
- **Compatible con drivers HTTP** para que las RSC en edge funcionen sin
  pools de conexiones
- **Branching** para tener entornos `dev` y `production` aislados (clave
  para experimentar sin romper datos reales)
- **Features de DB que típicamente usaremos en e-commerce**: full-text
  search, JSON, transacciones, índices compuestos, foreign keys,
  enums

## Decisión

Usar **Neon** (Postgres serverless) como base de datos primaria.

## Alternativas consideradas

### Turso / LibSQL

**Pros:**

- Latencia _edge_ casi cero (réplicas regionales)
- Free tier muy generoso (>1 GB)
- SQLite es simple, sin tipos extra, sin extensiones que aprender

**Contras:**

- Sin **JSON** nativo en queries (workarounds existen pero son frágiles)
- Sin **enums** — habría que simular con CHECK constraints
- Full-text search más limitado vs `pg_trgm` y `tsvector` de Postgres
- El driver HTTP existe pero el ecosistema (Drizzle, ORMs en general)
  está más sólido en Postgres
- Sin **branching de DB** — Turso tiene "child databases" pero el modelo
  es distinto y menos integrado con tooling como Drizzle

### Supabase

**Pros:**

- Postgres real, con extensiones (pgvector, pg_trgm, etc.)
- Auth integrado, pero ya tenemos Better Auth
- Tier gratis sólido

**Contras:**

- Más "BaaS" — viene con UI admin, auth, storage, RLS… que no necesitamos
- Branching es funcional pero no tan barato/instantáneo como Neon
- Vendor lock-in mayor (RLS y triggers específicos)

### Postgres tradicional (Railway / Render / DigitalOcean)

**Pros:**

- Postgres puro sin ataduras

**Contras:**

- Pago mensual fijo aunque el tráfico sea cero
- Sin branching
- Latencia de TCP pool desde Vercel edge es más alta vs HTTP

### Cloudflare D1

**Pros:**

- Cero costos hasta cierto volumen
- Edge nativo

**Contras:**

- SQLite, mismos problemas que Turso para nuestro caso
- Ecosistema más joven, menos integrado con Drizzle

## Consecuencias

### Más fácil

- **Branching trivial** (`bunx neonctl branches create`) → cada feature
  o PR puede tener su propia DB
- Postgres 18 con todas las features modernas (`gen_random_uuid()`,
  `IDENTITY` columns, `MERGE`, etc.)
- Drizzle + `neon-http` adapter funciona en edge sin pool TCP
- Si crece el proyecto, podemos migrar a un Postgres _self-hosted_ sin
  reescribir queries

### Más difícil

- **Auto-suspend.** En el free tier la DB se "duerme" tras 5 min sin
  tráfico; la primera query toma ~1s en despertar. Es aceptable para
  desarrollo pero hay que tenerlo en mente para tests CI (mitigado con
  retry / warm-up query).
- **Storage limitado** en free tier (0.5 GB). Cuando crezca el catálogo
  con muchas imágenes, necesitaremos upgrade — pero las imágenes viven en
  Uploadthing, no en Postgres, así que el límite es realista.
- **Drizzle-kit 0.30 + Postgres 18** tiene un bug conocido con
  `db:push` (ver [SUPPORT.md](../../SUPPORT.md#bun-run-dbpush-falla-con-column-id-is-in-a-primary-key)).
  Mitigación: usar `db:generate` + `db:migrate` exclusivamente.

### Riesgos asumidos

- Vendor lock-in con Neon (relativo). Mitigación: usamos Drizzle, que
  habla SQL estándar; si tenemos que migrar a otro Postgres es viable.
- Tier gratis puede cambiar de condiciones. Si pasa, evaluamos pago u
  otra opción. El mismo `DATABASE_URL` funciona contra cualquier
  Postgres compatible.
