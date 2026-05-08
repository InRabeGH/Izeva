# Sistema de diseño

Fuente de verdad del lenguaje visual de Izeva. Si Claude (o cualquier
colaborador) va a trabajar en UI, debe leer este documento primero.

> **Estado:** propuesta inicial v0.1 — basada en defaults de shadcn con
> ajustes hacia "editorial moderno". Iteramos cuando exista brand book
> formal. Las decisiones marcadas **TBD** dependen de validación de marca.

## Visión

**Editorial moderno con calidez sutil.** Limpio, minimalista, ligeramente
cálido (off-white en lugar de blanco puro, warm dark en lugar de negro
neutro). Acento de _blush_ apenas perceptible para CTAs y momentos de
marca. Sin estereotipos: ni pink-by-default ni corporativo frío.

**Inspiración:** Glossier, Aesop, &Other Stories, MAC Cosmetics. Productos
de lujo accesible.

## Tokens

### Colores

Todos los valores en [oklch](https://oklch.com) (rango perceptualmente
uniforme). Definidos como CSS vars en
[`app/globals.css`](../app/globals.css) y mapeados a Tailwind v4 vía
`@theme inline`.

| Token | Valor | Uso |
| --- | --- | --- |
| `--background` | `oklch(0.99 0.003 80)` | Fondo de página (warm white) |
| `--foreground` | `oklch(0.21 0.005 50)` | Texto principal (warm near-black) |
| `--card` | `oklch(0.99 0.003 80)` | Fondo de tarjetas (igual al body) |
| `--card-foreground` | `oklch(0.21 0.005 50)` | Texto en tarjetas |
| `--popover` | `oklch(0.99 0.003 80)` | Fondo de popovers/menús |
| `--popover-foreground` | `oklch(0.21 0.005 50)` | Texto en popovers |
| `--primary` | `oklch(0.21 0.005 50)` | Color primario (mismo que foreground — alto contraste) |
| `--primary-foreground` | `oklch(0.98 0.003 80)` | Texto sobre primary |
| `--secondary` | `oklch(0.96 0.006 70)` | Botón/chip secundario, soft warm gray |
| `--secondary-foreground` | `oklch(0.21 0.005 50)` | Texto sobre secondary |
| `--muted` | `oklch(0.96 0.006 70)` | Backgrounds suaves (form fields, code) |
| `--muted-foreground` | `oklch(0.5 0.01 50)` | Texto secundario, helper text |
| `--accent` | `oklch(0.94 0.02 25)` | Hover states, badges sutiles (blush apenas perceptible) |
| `--accent-foreground` | `oklch(0.21 0.005 50)` | Texto sobre accent |
| `--destructive` | `oklch(0.55 0.18 20)` | Errores, eliminar (muted brick red, no rojo brillante) |
| `--border` | `oklch(0.92 0.005 70)` | Bordes de inputs, separadores |
| `--input` | `oklch(0.92 0.005 70)` | Bordes de input fields |
| `--ring` | `oklch(0.7 0.02 60)` | Focus ring |

**Brand color (TBD):** dejar abierto un `--brand` para CTAs especiales y
momentos de marca cuando se defina la identidad. Sugerencia inicial:
`oklch(0.45 0.12 15)` (refined burgundy / dusty rose oscuro).

**Reglas:**

- **Contraste mínimo WCAG AA**. `foreground` sobre `background` da
  ~16:1; `muted-foreground` sobre `background` da ~7:1. Validado.
- Para crear variantes nuevas, **mantener la lightness scale**:
  fondos ≥0.95, bordes 0.9–0.95, muted ~0.5, foreground ≤0.25.
- **Croma alta solo para destructive y brand**. El resto se mantiene
  ≤0.02 para preservar el look "editorial".

### Tipografía

Cargada via `next/font` en [`app/layout.tsx`](../app/layout.tsx).

| Familia | Variable | Uso |
| --- | --- | --- |
| Geist Sans | `--font-geist-sans` | UI, body, headings |
| Geist Mono | `--font-geist-mono` | Precios tabulares, códigos, IDs |

**Display serif (TBD):** cuando madure la marca, considerar agregar una
serif para headers grandes (Fraunces, Cormorant, Playfair). Costo:
+~30 KB de fuente. No agregar antes de validar que aporta valor de
marca real.

#### Escala tipográfica

Usar las clases de Tailwind directamente:

| Tamaño | Clase Tailwind | Uso |
| --- | --- | --- |
| Hero | `text-5xl` (3rem) — `text-7xl` (4.5rem) | Solo en hero principal |
| H1 | `text-4xl` (2.25rem) | Título de página |
| H2 | `text-3xl` (1.875rem) | Sección dentro de página |
| H3 | `text-2xl` (1.5rem) | Subsección |
| H4 | `text-xl` (1.25rem) | Card title, modal title |
| Body L | `text-lg` (1.125rem) | Lead paragraph |
| Body | `text-base` (1rem) | Default |
| Body S | `text-sm` (0.875rem) | Helper text, footer, captions |
| Caption | `text-xs` (0.75rem) | Metadata, labels muy chicos |

**Pesos:**

- `font-bold` (700) — solo para headings principales
- `font-semibold` (600) — H3+, énfasis
- `font-medium` (500) — labels, botones
- `font-normal` (400) — body por default

**Tracking (letter-spacing):** `tracking-tight` (-0.025em) para headings
≥H2; default para body. Nunca tracking expandido salvo en `text-xs`
mayúsculas (categorías).

### Espaciado

Escala de Tailwind por default (0.25rem step). No inventar valores
custom.

**Convenciones:**

- Entre secciones de una página: `py-16 md:py-24`
- Entre subsecciones: `py-8 md:py-12`
- Entre elementos relacionados: `gap-4` o `gap-6`
- Padding interno de cards: `p-6` (sm) o `p-8` (md+)
- Padding horizontal del container: `px-4 sm:px-6 lg:px-8`

### Border radius

Definido como `--radius: 0.625rem` (10px). Tailwind v4 lo expone como:

| Token | Valor | Uso |
| --- | --- | --- |
| `rounded-sm` | `calc(var(--radius) - 4px)` = 6px | Inputs pequeños, badges |
| `rounded-md` | `calc(var(--radius) - 2px)` = 8px | Inputs, botones secundarios |
| `rounded-lg` | `var(--radius)` = 10px | Botones primarios, cards |
| `rounded-xl` | `calc(var(--radius) + 4px)` = 14px | Modal, drawer |
| `rounded-full` | — | Avatares, chips redondos |

### Sombras

Por ahora usar las defaults de Tailwind (`shadow-sm`, `shadow-md`,
`shadow-lg`). Si más adelante necesitamos una elevación más suave
(estilo "editorial"), definir custom en `globals.css`:

```css
--shadow-soft: 0 1px 2px oklch(0.21 0.005 50 / 0.04), 0 4px 12px oklch(0.21 0.005 50 / 0.06);
```

### Layout

| Breakpoint | Min width | Container max-w |
| --- | --- | --- |
| `sm` | 640px | `max-w-screen-sm` |
| `md` | 768px | `max-w-screen-md` |
| `lg` | 1024px | `max-w-screen-lg` |
| `xl` | 1280px | `max-w-screen-xl` |
| `2xl` | 1536px | `max-w-screen-2xl` |

**Contenedores típicos:**

- Página de catálogo: `max-w-7xl` (1280px) centered
- Página de detalle de producto: `max-w-5xl`
- Forms (sign-in, admin): `max-w-md` (384px)

## Componentes

### Cuándo usar Button vs Link

- **Button** (`<Button>`) — acciones que cambian estado (Server Action,
  toggle, submit). Variantes: `default`, `secondary`, `ghost`,
  `destructive`, `outline`.
- **Link** (`<Link href>`) — navegación a otra ruta. Si lo necesitas
  estilizado como botón, usa `<Link>` con clases del Button:
  ```tsx
  <Link href="/products" className={buttonVariants({ variant: 'default' })}>
      Ver catálogo
  </Link>
  ```

### Estados de componentes interactivos

Todo botón/input debe definir explícitamente:

- `default` — estado base
- `:hover` — sutil cambio de color o opacidad (10% más oscuro)
- `:active` — feedback de click (escala 98% o color más profundo)
- `:disabled` — opacidad 50% + cursor not-allowed
- `:focus-visible` — ring de 2px con `--ring`, sin outline browser
- `loading` — spinner inline + texto "Cargando…" o disabled

### Forms

**Layout estándar:**

```
Label (text-sm font-medium)
Input
Helper text (text-xs muted-foreground) | Error (text-xs destructive)
```

- Labels arriba del input (no a la izquierda salvo formularios densos)
- Helper text **siempre presente** desde el inicio (no solo cuando hay
  error) — reduce CLS
- Errores con ícono + mensaje específico ("El email no es válido", no
  "Error de validación")
- Submit button al final, con espacio vertical claro
- Validación en `onBlur`, no en `onChange`

### Empty states

Cuando una lista está vacía:

```
[Ícono lucide grande, muted-foreground]
Título corto ("Aún no tienes productos")
Subtítulo explicando qué pasa
[CTA primario para resolver el vacío]
```

### Loading states

- **Skeletons** para listas y cards (preserva layout)
- **Spinner inline** para botones después de submit
- **Suspense boundaries** alrededor de Server Components que tardan

Evitar pantallas completas en blanco. Cada loading debe parecerse al
estado final.

### Error boundaries

Cada `app/**/error.tsx` debe:

- Decir qué falló en lenguaje humano
- Ofrecer reintentar (`reset()` de Next)
- Linkar a contacto si el error persiste
- **Nunca** mostrar el stack trace al usuario final

## Voz y tono

### Idioma

- **es-MX**, **tú** (no "usted" salvo en el aviso de privacidad)
- **Imperativo amable**: "Agrega tu producto", no "Sería deseable que
  agregaras tu producto"
- **Activo**: "Pagamos a tu cuenta", no "Tu cuenta será acreditada"

### Microcopy

- **Específico antes que genérico**: "Listo, agregaste 3 productos"
  vence a "Operación exitosa"
- **Errores accionables**: "El email no es válido — revisa que tenga
  formato `nombre@dominio.com`" vence a "Email inválido"
- **Sin signos de admiración** salvo en celebraciones reales (compra
  completada). En errores nunca.

### Sin emojis en UI funcional

- Microcopy administrativa (errores, confirmaciones, labels): **sin emojis**
- Marketing/landing: **uso moderado** está OK si encaja con la marca
- Excepción: íconos de estado (✓, ⚠, ✕) son tipográficos, no emojis

### Mayúsculas

- **Sentence case** en todo: títulos, botones, labels
- Evitar TITLE CASE estilo americano ("Add To Cart")
- Evitar TODO MAYÚSCULAS salvo categorías muy chicas (`text-xs tracking-wide`)

## Accesibilidad

Estándar mínimo: **WCAG 2.1 nivel AA**.

### Reglas no negociables

- **Contraste**: foreground sobre background ≥4.5:1 (texto normal),
  ≥3:1 (texto grande ≥18px). La paleta actual cumple.
- **Touch targets ≥44×44 px** en cualquier elemento interactivo
- **Focus visible siempre** — nunca `outline: none` sin un `:focus-visible`
  alternativo. shadcn ya lo hace.
- **No información solo por color**: errores con ícono + texto, no solo
  border rojo. Estados activos con ícono + estilo, no solo color.
- **Texto alternativo en imágenes**: `alt` describe el contenido. Para
  imágenes decorativas, `alt=""`.
- **Headings jerárquicos**: solo un `<h1>` por página, sin saltarse niveles.

### Patrones recomendados

- **Skip to content** link al inicio de cada layout
- **`prefers-reduced-motion`**: respetar con `motion-reduce:transition-none`
  o `useReducedMotion()` de framer-motion (cuando lo agreguemos)
- **`aria-label`** en botones-icono sin texto visible
- **Forms con `<label>` real** vinculado al input, no placeholder
  haciendo de label

## Naming

### Componentes

- `PascalCase`: `ProductCard`, `AddToCartButton`
- Nombre describe **qué es**, no cómo se ve: `Sidebar`, no `LeftPanel`
- Sufijo `Button` solo cuando hay ambigüedad: `LinkButton` (link
  estilizado como botón) vs `Link` (link normal)

### Variables CSS

- Custom properties con prefijo según categoría: `--color-*`, `--font-*`,
  `--radius-*`, `--shadow-*`
- Tokens semánticos antes que tokens raw: `--color-destructive` vence
  a `--color-red-500`

### Clases Tailwind en JSX

Orden recomendado en el `className`:

1. Layout: `flex`, `grid`, `block`, `relative`
2. Spacing: `p-*`, `m-*`, `gap-*`
3. Sizing: `w-*`, `h-*`, `min-*`, `max-*`
4. Typography: `text-*`, `font-*`, `leading-*`
5. Background: `bg-*`
6. Border: `border-*`, `rounded-*`
7. Effects: `shadow-*`, `opacity-*`
8. Transitions/animation: `transition-*`, `animate-*`
9. Responsive variants después de cada bloque (`md:*`, `lg:*`)
10. State variants al final (`hover:*`, `focus:*`)

Biome con plugin de Tailwind puede automatizarlo en el futuro
(ahora mismo está deshabilitado para evitar churn al iniciar).

## Cómo extender este sistema

### Agregar un componente

1. Si existe en shadcn → `bunx shadcn@latest add <nombre>` (skill
   `/shadcn-add` lo automatiza)
2. Si no existe → crear en `components/`, no en `components/ui/`
3. Documentar acá si introduce un patrón nuevo

### Agregar un token

1. Definir la CSS var en [`app/globals.css`](../app/globals.css)
2. Mapear en `@theme inline { ... }` para que Tailwind la exponga
3. Documentar en este archivo bajo "Tokens"
4. Si es decisión grande (paleta nueva, tipo display), abrir un ADR

### Romper un patrón documentado

Si necesitas algo que contradiga este doc, primero pregúntate si vale
la pena divergir. Si sí:

1. Discútelo en el PR
2. Si se aprueba, actualiza este doc en el mismo PR
3. Considera si justifica un ADR

Vale más mantener consistencia que tener cada vista perfecta. Un
sistema de diseño en deuda es peor que uno modesto pero respetado.
