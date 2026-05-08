# Changelog

Todos los cambios notables a este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Scaffold inicial del proyecto con Next.js 16 (App Router, Cache Components,
  React Compiler activos), Tailwind CSS v4, shadcn/ui (estilo new-york),
  TypeScript estricto
- Stack de datos: Drizzle ORM con driver `neon-http` apuntando a Neon
  (Postgres serverless)
- Schema inicial:
    - Tablas de Better Auth (`user`, `session`, `account`, `verification`)
    - Dominio del catálogo (`category`, `product`, `product_image`)
    - Enum `user_role` con valores `user` / `admin`
- Better Auth configurado con email/password, soporte opcional para Google
  OAuth, plugin `nextCookies`, campo custom `role` en `user`
- Uploadthing configurado con file router protegido para subir imágenes
  de producto (solo admins)
- Proxy (`proxy.ts`, ex-middleware en Next 15) que protege `/admin` y
  `/dashboard` contra accesos sin sesión
- Tests con `bun:test`:
    - 3 tests unitarios de helpers (`tests/lib/`)
    - 4 tests de DB que validan conexión y schema (`tests/db/`)
- Linter + formatter unificados con Biome 2 (4 espacios, comillas simples)
- Pipeline de CI en GitHub Actions:
    - Job `quality` (lint + typecheck + tests sin DB + build)
    - Job `test-db` que corre tests contra una branch de Neon vía secret
      `TEST_DATABASE_URL`
- Plantillas de issues (bug, feature) y de pull request en español
- `dependabot.yml` con grupos por familia de paquetes
- `CODEOWNERS` y `SECURITY.md` para gobernanza
- `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md` y `docs/decisions/`
  con los ADRs iniciales del stack

[Unreleased]: https://github.com/InRabeGH/Izeva/compare/HEAD
