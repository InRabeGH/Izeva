import { sql } from 'drizzle-orm';
import {
    boolean,
    index,
    integer,
    numeric,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['user', 'admin']);

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    role: userRole('role').default('user').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const session = pgTable(
    'session',
    {
        id: text('id').primaryKey(),
        expiresAt: timestamp('expires_at').notNull(),
        token: text('token').notNull().unique(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text('ip_address'),
        userAgent: text('user_agent'),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
    },
    (table) => [index('session_user_id_idx').on(table.userId)],
);

export const account = pgTable(
    'account',
    {
        id: text('id').primaryKey(),
        accountId: text('account_id').notNull(),
        providerId: text('provider_id').notNull(),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        accessToken: text('access_token'),
        refreshToken: text('refresh_token'),
        idToken: text('id_token'),
        accessTokenExpiresAt: timestamp('access_token_expires_at'),
        refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
        scope: text('scope'),
        password: text('password'),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index('account_user_id_idx').on(table.userId)],
);

export const verification = pgTable(
    'verification',
    {
        id: text('id').primaryKey(),
        identifier: text('identifier').notNull(),
        value: text('value').notNull(),
        expiresAt: timestamp('expires_at').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export const category = pgTable(
    'category',
    {
        id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
        slug: text('slug').notNull(),
        name: text('name').notNull(),
        description: text('description'),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [uniqueIndex('category_slug_idx').on(table.slug)],
);

export const product = pgTable(
    'product',
    {
        id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
        slug: text('slug').notNull(),
        name: text('name').notNull(),
        description: text('description'),
        priceCents: integer('price_cents').notNull(),
        currency: text('currency').default('MXN').notNull(),
        stock: integer('stock').default(0).notNull(),
        weightGrams: numeric('weight_grams', { precision: 10, scale: 2 }),
        published: boolean('published').default(false).notNull(),
        featured: boolean('featured').default(false).notNull(),
        categoryId: uuid('category_id').references(() => category.id, { onDelete: 'set null' }),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        uniqueIndex('product_slug_idx').on(table.slug),
        index('product_category_id_idx').on(table.categoryId),
        index('product_published_idx').on(table.published),
        index('product_featured_idx').on(table.featured),
    ],
);

export const productImage = pgTable(
    'product_image',
    {
        id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
        productId: uuid('product_id')
            .notNull()
            .references(() => product.id, { onDelete: 'cascade' }),
        url: text('url').notNull(),
        key: text('key').notNull(),
        alt: text('alt'),
        position: integer('position').default(0).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => [index('product_image_product_id_idx').on(table.productId)],
);
