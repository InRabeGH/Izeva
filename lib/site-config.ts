export const siteConfig = {
    name: 'Izeva',
    tagline: 'Lo que te gusta, en un solo lugar.',
    subtagline: 'Carteras, bolsas, joyería y cosméticos.',

    instagram: {
        url: 'https://instagram.com/izeva',
        handle: '@izeva',
    },
    whatsapp: {
        url: '',
        label: '',
    },
    email: '',

    categories: [
        { slug: 'carteras', label: 'Carteras' },
        { slug: 'bolsas', label: 'Bolsas' },
        { slug: 'joyeria', label: 'Joyería' },
        { slug: 'cosmeticos', label: 'Cosméticos y maquillaje' },
    ],

    story: {
        eyebrow: 'Sobre Izeva',
        title: 'Selección que se siente personal',
        body: 'Empezamos con una idea simple: comprar piezas que te gustan no debería ser un riesgo. Cada producto que llega a Izeva pasa primero por nuestras manos. Lo elegimos, lo fotografiamos y lo describimos con el detalle que querríamos tener antes de comprar.',
    },
} as const;

/** @public */
export type SiteConfig = typeof siteConfig;
