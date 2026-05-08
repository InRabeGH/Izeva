# ¿Necesitas ayuda?

Este documento describe los canales de soporte para Izeva. **No abras un
issue para pedir ayuda general** — los issues son para bugs verificables y
propuestas de feature.

## ¿Por dónde empezar?

| Quiero… | Ve aquí |
| --- | --- |
| Levantar el proyecto en local | [`README.md`](README.md) → sección _Setup_ |
| Entender cómo está organizado el código | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Saber cómo desplegar | [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) |
| Entender por qué se eligió X tecnología | [`docs/decisions/`](docs/decisions/) |
| Contribuir con código | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Reportar un bug verificable | Abre un issue con la plantilla _bug report_ |
| Proponer una nueva funcionalidad | Abre un issue con la plantilla _feature request_ |
| Reportar una vulnerabilidad | [`SECURITY.md`](SECURITY.md) — **canal privado** |
| Hacer una pregunta general | [GitHub Discussions](https://github.com/InRabeGH/Izeva/discussions) |

## Preguntas frecuentes

### `bun run dev` falla con error de DB

Verifica que `DATABASE_URL` esté configurado en `.env` y que la branch de
Neon a la que apunta tenga el schema aplicado:

```bash
bun run db:generate
bun run db:migrate
```

### `bun run db:push` falla con `column "id" is in a primary key`

Es un bug conocido de `drizzle-kit` con Postgres 18 (cambió cómo representa
los `NOT NULL`). **Usa el flujo de migraciones en lugar de _push_:**

```bash
bun run db:generate
bun run db:migrate
```

### El test `bun run test:db` falla con `connection refused`

Tu `DATABASE_URL` apunta a una branch de Neon que está suspendida o
borrada. Verifica en el dashboard de Neon que la branch sigue activa.
Una primera query la "despierta" automáticamente — espera ~1s y reintenta.

### Quiero usar Postgres local en lugar de Neon

Drizzle es compatible con Postgres tradicional. Cambia el driver en
`lib/db/index.ts` de `drizzle-orm/neon-http` a `drizzle-orm/node-postgres`
y apunta `DATABASE_URL` a tu instancia local. Ten en cuenta que perderás
la latencia _edge_ y el branching de Neon en producción.

## Reportar bugs y proponer features

Antes de abrir un issue:

1. **Busca primero.** Tal vez ya esté reportado.
2. **Reproduce con la última versión de `develop`.** Bugs en commits viejos
   probablemente ya están arreglados.
3. **Aísla el problema.** Mientras menos código toque tu reproducción,
   más rápido se diagnostica.

Cuando estés listo, abre el issue con la plantilla correspondiente.

## ¿Sigues atascado?

Si nada de lo anterior te ayudó, abre una discussion (no un issue)
explicando lo que intentas hacer y lo que ya probaste. Te respondemos
en cuanto podemos — este es un proyecto pequeño, no esperes SLA.
