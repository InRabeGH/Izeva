---
name: shadcn-add
description: Installs shadcn/ui components into the project using bunx. Validates the component names exist before installing, places them under components/ui/, and reports what was added. Use whenever the user wants to add UI primitives (button, input, dialog, dropdown-menu, etc.) to the project.
allowed-tools: Bash(bunx shadcn *), Read, Glob
arguments: [components]
---

You are installing shadcn/ui components into Izeva.

The user requested: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask which components to add and stop.

# Steps

## 1. Verify the project is set up

Confirm that [`components.json`](../../components.json) exists. If not,
the user needs to run `bunx shadcn@latest init` first — tell them and
stop.

## 2. Validate component names

Common shadcn components include: `button`, `input`, `card`, `dialog`,
`dropdown-menu`, `select`, `form`, `label`, `textarea`, `checkbox`,
`radio-group`, `switch`, `tabs`, `toast`, `toaster`, `sheet`,
`popover`, `tooltip`, `avatar`, `badge`, `separator`, `accordion`,
`alert`, `alert-dialog`, `progress`, `skeleton`, `slider`, `table`.

If a name in `$ARGUMENTS` is unusual (typo or non-existent), warn the
user and let them confirm before installing.

## 3. Install

```bash
bunx shadcn@latest add <componentes>
```

The CLI may ask interactive questions if dependencies are missing —
proceed with sensible defaults (use the existing tailwind config, the
existing utils path).

## 4. Report

After install, list which files were created under `components/ui/`.
Use `Glob` to confirm. Mention any peer dependencies that were added
to `package.json` (typically `@radix-ui/*`).

If the component has a usage pattern that's non-obvious (e.g. `Form`
needs `react-hook-form` integration, `Toaster` needs to be mounted in
the root layout), point that out with a one-line tip.

# Reglas

- **No edites manualmente** los archivos generados en `components/ui/`.
  Si necesitas customizar, crea un wrapper (p. ej.
  `components/IzevaButton.tsx`) que envuelva el primitivo.
- Estilo del proyecto es **`new-york`** y base color **`neutral`**
  (ver [`components.json`](../../components.json)). No cambies esto sin
  abrir un ADR.
- Si el usuario pide algo que no es un componente shadcn (ej. "datepicker"),
  redirígelo a la combinación correcta (Calendar + Popover en este caso).
