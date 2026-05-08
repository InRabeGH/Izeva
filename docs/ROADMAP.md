# Roadmap

Plan de evolución de Izeva. Este archivo es **versionado** y vive en
el repo a propósito: cada cambio de prioridad se discute en un PR.

> Para tickets accionables del día a día, usa
> [GitHub Issues](https://github.com/InRabeGH/Izeva/issues) y
> [GitHub Projects](https://github.com/InRabeGH/Izeva/projects).
> Este archivo es la **proyección estratégica**, no el backlog operativo.

## Estado actual

**Fase 0 — scaffolding** ✅
- Stack base montado y verificado (Next.js 16 + Tailwind v4 + shadcn + Drizzle + Better Auth + Uploadthing)
- CI/CD, linting (Biome), tests (`bun:test`), hooks (lefthook + commitlint), versioning (release-please), dead code (knip)
- Documentación inicial (ARCHITECTURE, DESIGN, USER, ADRs, CONTRIBUTING, SECURITY, SUPPORT, ROADMAP)
- Branch `dev` en Neon, secret `TEST_DATABASE_URL` configurado en GitHub
- Homepage con hero, categorías, featured (Suspense + DB query), story, footer
- Auth UI: `/sign-in`, `/sign-up`, admin shell `/admin` con auth-gating

## Fase 1 — MVP del catálogo (en curso)

Meta: catálogo público navegable + panel admin para gestionar productos.
Sin checkout todavía.

### Bloqueante: servicios externos

- [ ] **Resend + React Email** — emails transaccionales (verification,
      password reset). Bloquea el flow de auth con email/password
- [ ] **Sentry** — error tracking en producción. Sin esto, los errores
      en prod son invisibles
- [ ] **Vercel Analytics + Speed Insights** — un click si despliegas en
      Vercel, free para tráfico bajo
- [ ] **Vercel** — primer deploy a producción (branch `main` ↔ Neon
      branch `production`)

### Features

- [x] Auth UI (`/sign-in`, `/sign-up`) con shadcn — `forgot-password` queda
      pendiente hasta tener Resend
- [x] Homepage pública con featured products + empty state
- [ ] Panel admin `/admin/products` (CRUD con Server Actions + Uploadthing)
- [ ] Panel admin `/admin/categories` (CRUD)
- [ ] Catálogo público con grid de productos publicados (`/catalog`),
      filtro por categoría (`/catalog?categoria=...`), página de detalle
      (`/p/[slug]`)
- [ ] Búsqueda básica (`ILIKE` en Postgres, sin full-text aún)

### Branding pendiente

- [ ] Story real en [`lib/site-config.ts`](../lib/site-config.ts) — placeholder genérico hoy
- [ ] WhatsApp con número real (hoy `whatsapp.url = ''` esconde el link)
- [ ] Email de contacto real
- [ ] Verificar handle de Instagram (`@izeva` puede o no existir)
- [ ] Logo gráfico (hoy solo wordmark)
- [ ] Favicon set (hoy default de Next.js)

### Calidad

- [ ] Branch protection rules en GitHub (require CI green + review,
      no force push). _No es versionable, configurar en Settings_
- [ ] Aviso de privacidad y términos de servicio (LFPDPPP México)
- [ ] Investigación con 5 clientas para validar `docs/USER.md`
- [ ] Drizzle migrations setup propio (hoy aplicamos `featured` con
      script one-off; el primer cambio "real" requerirá baseline limpio
      o reset de la branch dev)
- [ ] Promover primer usuario a admin manualmente
      (`UPDATE "user" SET role='admin' WHERE email = '...'`)

## Fase 2 — checkout

- [ ] Carrito (state local + persistencia en cookie)
- [ ] **MercadoPago** integration (México first; Stripe como segunda
      opción si conviene internacionalizar)
- [ ] Webhooks de pagos validados
- [ ] Página de pedidos del usuario
- [ ] Emails de confirmación de pedido (Resend)
- [ ] Panel admin de pedidos

## Fase 3 — escalar

- [ ] Búsqueda full-text con `pg_trgm` o `tsvector`
- [ ] **Upstash Redis** — rate limiting + cache (Better Auth sessions
      distribuidas si llegamos a multi-region)
- [ ] **Inngest** — background jobs (procesamiento de imágenes,
      reportes, emails masivos)
- [ ] Lighthouse CI / size-limit en pipelines (gates de performance)
- [ ] Playwright e2e (al menos sign-in, checkout, admin create product)
- [ ] **PostHog** o **Plausible** — product analytics (privacy-friendly)

## Fase 4 — bonus

Cosas no críticas que pueden esperar mucho:

- Multi-currency (USD además de MXN)
- i18n con `next-intl` (si decidimos ofrecer inglés — actualmente
  fuera de alcance per [ADR-0001](decisions/0001-stack-tecnologico.md))
- PWA (`manifest.json`, service worker, offline catalog)
- Reviews y rating de productos
- Wishlist
- Notificaciones push
- Programa de referidos
- Dashboard de métricas para admin (ventas, productos top, etc.)

## Cosas que deliberadamente NO haremos (a menos que cambie el contexto)

- **Dark mode** — fuera de alcance por decisión de producto
- **Mobile app nativa** — la PWA cubre el caso. iOS/Android nativo es
  mantenimiento desproporcionado
- **Marketplace multi-vendor** — Izeva es una sola tienda
- **Server-side rendering 100% estático** — el catálogo cambia, no
  podemos pre-renderizar todo
- **Containerización (Docker / Kubernetes)** — Vercel deploya Next.js
  sin Docker. Solo agregar `Dockerfile` + `output: 'standalone'` si
  decidimos salir de Vercel; mientras tanto es overhead inútil
- **API Gateway tradicional** (Kong, Apollo Router, etc.) — Next.js
  + Server Actions ya cumple esa función. Solo lo reconsideramos si
  aparecen consumidores externos serios (mobile app, partners)

## Decisiones de tooling pendientes

Cosas que decidiremos cuando llegue el momento:

| Decisión | Opciones | Trigger para decidir |
| --- | --- | --- |
| Pago | MercadoPago vs Stripe vs ambos | Cuando arranque Fase 2 |
| Analytics | PostHog vs Plausible vs Vercel Analytics | Cuando tengamos tráfico real (>100 usuarios/día) |
| Búsqueda | `pg_trgm` vs Algolia vs Meilisearch self-hosted | Cuando el catálogo pase de ~500 productos |
| Renovate vs Dependabot | (quedamos con Dependabot) | Si Dependabot empieza a sentirse limitado en agrupaciones |
| CDN para imágenes | Uploadthing default vs Cloudflare R2 + Images | Si los costos de Uploadthing crecen |

Cada una de estas merecerá un ADR cuando se decida.

## Cómo se actualiza este roadmap

- **Cambios de prioridad**: PR con scope `docs(roadmap):`
- **Mover items entre fases**: misma cosa, PR + revisión
- **Marcar completados**: PR con scope `chore(release):` o como parte
  del PR que cierra el item
- **Items nuevos**: agregar a la fase apropiada con criterio de éxito
  claro

Si tienes una idea pero no estás seguro de la fase, abre una
[discussion](https://github.com/InRabeGH/Izeva/discussions) — más
fácil de descartar/madurar antes de meterla al roadmap formal.
