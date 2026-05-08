# Usuario objetivo

> **Estado:** hipótesis inicial v0.1 — sin investigación de usuarios todavía.
> Validar con entrevistas a 5-10 clientas reales antes de considerar
> definitiva. Cada decisión de producto que se justifique con este doc
> debería caer si la investigación contradice las hipótesis.

## Persona principal: "Sofía"

**Demografía**

- Mujer, 28-40 años
- Vive en zona metropolitana mexicana (CDMX, GDL, MTY, BJX) o ciudad
  media en crecimiento
- Clase media / media-alta — ingreso disponible para pequeños lujos
- Activa en redes sociales (Instagram principal, TikTok ocasional,
  WhatsApp constante)

**Comportamiento**

- Compra online con frecuencia (Amazon, Mercado Libre) pero **prefiere
  tiendas pequeñas para joyería y cosméticos** porque siente que la
  selección es más curada
- Sigue cuentas de Instagram de tiendas que le gustan; el feed le
  funciona como descubrimiento
- Usa WhatsApp como canal de contacto preferido cuando algo no es
  obvio en la tienda
- Compra para ella misma y para regalar (cumpleaños, día de las madres,
  navidades)

**Frustraciones con e-commerce de nicho**

1. **Fotos malas** — no logra ver el producto real, ilumninación pobre,
   ángulos que esconden detalles
2. **No sabe el tamaño real** — sin referencia de escala (mano, modelo,
   medida en cm) duda
3. **Miedo al fraude** — sitios sin reseñas, sin política clara de
   devolución, sin formas de contacto humano
4. **Tiempos de entrega vagos** — "entregamos pronto" no le sirve, quiere
   saber si llega antes del cumpleaños del sábado
5. **Stock fantasma** — se ilusiona con un producto, llega al checkout
   y "agotado"

**Lo que valora**

- Curaduría: que la tienda haya hecho la selección por ella, no
  catálogos infinitos
- Información clara: medidas, materiales, fotos múltiples, contexto de
  uso
- Comunicación humana: respuesta rápida en WhatsApp/Instagram
- Transparencia de tiempos: días hábiles concretos, costo de envío
  visible antes de comprar

## Jobs To Be Done

Framework: _"Cuando estoy [situación], quiero [acción], para [resultado]"_

### JTBD-1: Darse un gusto

> Cuando me siento bien o quiero animar mi semana, quiero comprar una
> pieza pequeña que me haga ilusión, para sentir que cuido de mí sin
> gastar mucho.

**Implicaciones para Izeva:**

- Productos sub-$500 MXN deben ser fácilmente filtrables / destacables
- Empaque que se sienta especial
- Microcopy del catálogo debe transmitir aspiración sin ser
  inalcanzable

### JTBD-2: Buscar un regalo específico

> Cuando se acerca un cumpleaños/aniversario, quiero encontrar un
> regalo que parezca pensado, para quedar bien sin tener que
> investigar mucho.

**Implicaciones para Izeva:**

- Sección "Para regalar" o filtros por ocasión
- Información de empaquetado (¿incluye envoltura?)
- Tiempos de entrega claramente visibles
- Política de cambio (por si no atinó la talla / color)

### JTBD-3: Renovar lo de siempre

> Cuando mi cosmético favorito se está acabando o mi cartera está
> desgastada, quiero recomprar o encontrar reemplazo, para no quedarme
> sin él pero sin gastar tiempo buscando.

**Implicaciones para Izeva:**

- Cuenta de usuaria con historial de compras (Fase 1 / Fase 2)
- Sección "Lo de siempre" o categorías claras de reemplazo
- Stock visible para que sepa si puede recomprar

### JTBD-4: Descubrir algo nuevo

> Cuando estoy aburrida en Instagram o esperando algo, quiero ver qué
> hay nuevo en mis tiendas favoritas, para entretenerme y por si algo
> me llama.

**Implicaciones para Izeva:**

- Sección "Lo nuevo" prominente en home
- Notificaciones por email/Instagram de novedades (Resend en Fase 1)
- Catálogo navegable sin compromiso de compra

## Cómo nos encuentra

| Canal | Frecuencia esperada | Acción típica |
| --- | --- | --- |
| Instagram (post / story / reel) | **Principal** | Click al link de bio → llega a la home |
| WhatsApp (compartido por amiga) | Frecuente | Llega a página de producto específica |
| Búsqueda en Google ("carteras CDMX", "joyería online MX") | Ocasional | Llega a home o a categoría |
| Recomendación boca a boca | Ocasional | Pregunta por WhatsApp directo |

**Implicación crítica:** la home **no** es la única entrada. Cada
página de producto y cada categoría debe poder funcionar sola
(metadata, OG image, contexto de marca visible).

## Lo que NO es

Para que la persona sea útil, también describimos quién **no** es
el usuario objetivo:

- **No es** mayorista ni revendedora — esa requiere otra arquitectura
  de precios y catálogo
- **No es** clienta de "fast fashion" buscando precio absoluto más
  bajo — para eso ya existe SHEIN/Temu
- **No es** clienta de lujo formal — Izeva no es Cartier ni Louis
  Vuitton; es selección curada accesible
- **No es** internacional (por ahora) — envíos solo a México, precios
  en MXN

## Validación pendiente

Antes de cerrar este documento como verdad operativa, necesitamos:

- [ ] Entrevistas con 5 clientas potenciales (primer ciclo)
- [ ] Análisis de cuentas de Instagram similares (referencia de tono y
      catálogo)
- [ ] Test de copy con 3 variantes de hero en redes
- [ ] Validar rangos de precio aceptables por categoría

Ver [`docs/ROADMAP.md`](ROADMAP.md) — investigación de usuarios va en
Fase 1 antes de cerrar definiciones de producto.
