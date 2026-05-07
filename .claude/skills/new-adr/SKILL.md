---
name: new-adr
description: Scaffolds a new Architecture Decision Record in docs/decisions/ with auto-incremented number and the project's MADR template. Use when the user wants to document a non-trivial technical decision (library choice, architectural pattern, "we won't do X" decisions).
allowed-tools: Read, Glob, Write, Bash(date *)
arguments: [title]
---

You are creating a new ADR for Izeva.

The user provided the title: **$1**

If `$1` is empty, ask the user for the title before proceeding.

# Steps

## 1. Find the next number

Use `Glob` to list `docs/decisions/[0-9]*.md`. Sort. Take the highest
number, add 1, zero-pad to 4 digits.

## 2. Generate the slug

From the title, generate a kebab-case slug:

- Lowercase
- Spaces → hyphens
- Remove non-alphanumeric (except hyphens)
- Strip leading/trailing hyphens

Example: `"Adoptar Stripe sobre PayPal"` → `adoptar-stripe-sobre-paypal`

## 3. Get today's date

```bash
date +%Y-%m-%d
```

## 4. Write the ADR

Path: `docs/decisions/<NNNN>-<slug>.md`

Body (Spanish, MADR format — same as the existing ADRs in `docs/decisions/`):

```markdown
# <NNNN>. <Title>

- **Fecha:** <YYYY-MM-DD>
- **Estado:** propuesto

## Contexto

<Describir el problema/restricción que motiva la decisión.>

## Decisión

<Qué se decidió. Voz activa: "Vamos a usar X.">

## Alternativas consideradas

### <Alternativa 1>

**Pros:**

-

**Contras:**

-

### <Alternativa 2>

**Pros:**

-

**Contras:**

-

## Consecuencias

### Más fácil

-

### Más difícil

-

### Riesgos asumidos

-
```

## 5. Update the index

Open `docs/decisions/README.md`. Append an entry to the "Índice"
section linking to the new ADR.

## 6. Tell the user

Report:

- Path created
- Reminder: estado es `propuesto`. Cambiar a `aceptado` cuando se
  decida formalmente, o `descartado` con razón si se rechaza.
- Sugerencia: abrir un PR con prefijo `docs:` para discutir el ADR

# Reglas

- Numeración consecutiva, sin saltos. Si te equivocas con el número,
  borra el archivo y empieza de nuevo.
- Mantén el ADR breve. Si necesitas más de 1 página, probablemente
  estás escribiendo documentación, no una decisión.
- No escribas el ADR completo por el usuario. Llena la estructura
  pero deja los `<placeholders>` para que el usuario los complete con
  contexto que solo él conoce.
