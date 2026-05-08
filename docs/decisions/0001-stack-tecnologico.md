# 0001. Adoptar Next.js 16 + Tailwind v4 + shadcn/ui + Drizzle

- **Fecha:** 2026-05-07
- **Estado:** aceptado

## Contexto

Izeva arranca como un proyecto greenfield: catálogo online de carteras,
bolsas, joyería, cosméticos y maquillaje. Audiencia inicial pequeña pero
con expectativa de crecimiento. Maintainer único (al inicio).

Restricciones / objetivos:

- **Time-to-first-feature** debe ser corto. Sin presupuesto para reinventar
  cosas (auth, ORM, file upload).
- Queremos **iterar rápido sin acumular deuda** — preferimos type-safety
  estática sobre tests defensivos en runtime.
- El maintainer quiere **aprender el stack más vanguardista** disponible
  (RSC, PPR, Server Actions). Esto es a la vez un objetivo y una
  restricción: vamos a evitar piezas legacy aunque sean más maduras.
- Despliegue en Vercel (donde el maintainer ya tiene cuenta).

## Decisión

Adoptar el siguiente stack:

| Capa | Elección |
| --- | --- |
| Framework | **Next.js 16** (App Router, Cache Components, React Compiler) |
| Estilos | **Tailwind CSS v4** (variables CSS nativas, configuración inline) |
| Componentes | **shadcn/ui** (estilo new-york, base color neutral) |
| ORM | **Drizzle** (type-safe, sin runtime overhead, sin Rust binary) |
| Validación | **Zod 4** + **next-safe-action** para Server Actions |
| Lenguaje | **TypeScript estricto** |

## Alternativas consideradas

### Frontend framework

- **Remix / React Router v7** — más simple en algunos aspectos, pero la
  comunidad y el ecosistema se concentraron en Next.js + Vercel
- **Astro** — excelente para sitios mayormente estáticos, pero el catálogo
  va a tener panel admin con interactividad real
- **SvelteKit** — performance excelente, pero el maintainer tiene más
  experiencia con React y queremos minimizar fricción

### Estilos

- **Vanilla CSS / CSS Modules** — más simple, pero perdemos la productividad
  de Tailwind y el ecosistema de shadcn
- **Tailwind v3** — más maduro, pero v4 ya está estable y trae mejoras
  importantes (configuración inline, CSS variables)

### ORM

- **Prisma** — más conocido, pero arrastra Rust binary y migraciones más
  rígidas
- **Kysely** — type-safe puro, pero menos batteries-included que Drizzle
  (no hay schema introspection, etc.)
- **Raw SQL** — viable, pero perdemos type-safety en queries dinámicas

### Validación

- **Yup / class-validator** — Zod tiene mejor integración con TypeScript
  y con el ecosistema (next-safe-action, drizzle-zod, etc.)

## Consecuencias

### Más fácil

- Type-safety end-to-end: schema → query → componente → cliente
- Performance por defecto (RSC + Cache Components evitan JS innecesario)
- Reuso del ecosistema React (shadcn, lucide, radix-ui)
- Onboarding rápido si llegan colaboradores con experiencia en Next.js

### Más difícil

- **Curva de aprendizaje de RSC.** El modelo mental Server vs Client
  requiere disciplina. Errores comunes: importar código server en cliente,
  usar hooks en componentes server.
- **Edge runtime** tiene sus particularidades (no `fs`, no librerías
  Node-only). Cuidado al elegir librerías.
- **Cache Components** (ex-PPR) está estable en Next 16 pero su modelo
  mental sigue evolucionando. Es probable que tengamos que ajustar
  patrones en la primera o segunda iteración.
- **Vendor lock-in moderado con Vercel.** Aunque Next.js es portable,
  algunas features (ISR, Image optimization) funcionan mejor en Vercel.
  Mitigación: si llega el día, migrar a [OpenNext](https://open-next.js.org).

### Riesgos asumidos

- Si Next.js cambia mucho de API en versiones futuras (como pasó del 14
  al 15 al 16), vamos a tener que migrar. Los ADRs futuros documentarán
  esos cambios.
- El maintainer único es un single point of failure. CONTRIBUTING.md
  intenta mitigar esto bajando la barrera para colaboradores.
