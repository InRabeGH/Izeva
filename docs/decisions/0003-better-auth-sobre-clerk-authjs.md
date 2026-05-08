# 0003. Usar Better Auth en lugar de Clerk o Auth.js (NextAuth)

- **Fecha:** 2026-05-07
- **Estado:** aceptado

## Contexto

Izeva necesita autenticación con estas características:

- Email + password básico
- Posibilidad de agregar OAuth (Google, al menos) sin reescribir
- Roles (`user` / `admin`) para distinguir clientes de gestores del catálogo
- Type-safe end-to-end (queremos saber qué hay en la sesión sin _casts_)
- Open source y self-hostable (control total del flujo y de los datos)
- Compatible con Drizzle directamente (sin un ORM intermedio propio)

## Decisión

Usar **Better Auth** (versión 1.3+).

## Alternativas consideradas

### Clerk

**Pros:**

- Setup en minutos
- UI prefabricada (sign-in, sign-up, account management)
- Soporte de organizaciones, MFA, passkeys out of the box
- Muy buen DX

**Contras:**

- **Vendor lock-in fuerte.** Los usuarios viven en Clerk, no en nuestra DB.
  Migrar fuera implica exportar y reescribir.
- **Servicio de pago.** Tier gratis hasta 10k MAU, después paga por usuario.
  Para un catálogo en crecimiento puede crecer rápido.
- Tracking analytics que Clerk añade a la app por default (deshabilitable
  pero hay que recordar hacerlo).

### Auth.js (NextAuth v5)

**Pros:**

- De facto estándar en Next.js durante años
- Free, open source
- Muchos providers OAuth out of the box

**Contras:**

- API verbose. Muchos boilerplate para cosas simples (custom session,
  custom JWT claims).
- Type-safety menos estricta. Tipos genéricos que requieren casting.
- Adapter de Drizzle existe pero está mantenido por la comunidad y va
  un step atrás de los cambios de NextAuth.
- v5 sigue marcado beta en algunas integraciones; muchos ejemplos en
  internet siguen siendo v4 → confusión.

### Lucia Auth

**Pros:**

- Open source, sin vendor lock-in
- Bien tipado

**Contras:**

- En 2024 anunció que iba a deprecarse / re-orientarse hacia ser una
  "guía" en lugar de una librería. Estado actual incierto.
- Si fuera estable sería un competidor directo de Better Auth.

### Implementarlo nosotros

**Pros:**

- Control total

**Contras:**

- Auth es notoriamente difícil de hacer bien. Sesiones, password reset,
  email verification, rate limiting, CSRF en OAuth callbacks — son
  trampas que ya alguien resolvió. Reinventarlas es deuda voluntaria.

## Consecuencias

### Más fácil

- **Schema vive en nuestra DB.** Las tablas `user`, `session`, `account`,
  `verification` están en `lib/db/schema.ts` con todo lo demás. Backup,
  query, JOIN con tablas de dominio: trivial.
- **Custom fields** se agregan en la config (`additionalFields`) y
  Better Auth los persiste y los devuelve tipados. Por eso `user.role`
  funciona sin hacks.
- **Plugin ecosystem** — admin, organization, magic link, passkey, 2FA,
  todo en plugins oficiales. Activar uno es agregar una línea.
- **DX moderna**: `auth.api.getSession({ headers: await headers() })`
  desde Server Actions funciona sin cookie parsing manual.
- **Cliente tipado**: `useSession()` en componentes con `'use client'`
  devuelve `Session | null` con autocompletado real.

### Más difícil

- **Más joven que Auth.js o Clerk.** API estable pero el ritmo de
  cambios es alto. Hay que estar atento a breaking changes en upgrades.
- **Comunidad más pequeña.** Stack Overflow no tiene tantas respuestas;
  hay que ir a sus docs o GitHub issues.
- **Email transaccional no incluido.** Si activamos email verification
  o password reset por email tenemos que conectar un SMTP/Resend nosotros.
- **Sin UI prefabricada.** Construimos `/sign-in` y `/sign-up` con
  shadcn — es trabajo extra pero también es flexibilidad.

### Riesgos asumidos

- Si Better Auth cambia de licencia o pierde mantenimiento, el costo
  de migrar a Auth.js no es trivial pero es viable (el schema es
  compatible en su mayor parte).
- Bugs de seguridad descubiertos en Better Auth nos afectan. Mitigación:
  GitHub watch al repo + Dependabot para updates rápidos.
