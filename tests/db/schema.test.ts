import { describe, expect, test } from 'bun:test';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';

const EXPECTED_TABLES = [
    'user',
    'session',
    'account',
    'verification',
    'category',
    'product',
    'product_image',
] as const;

describe('database schema', () => {
    test('todas las tablas esperadas existen', async () => {
        const result = await db.execute<{ table_name: string }>(sql`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
        `);

        const found = new Set(result.rows.map((r) => r.table_name));
        const missing = EXPECTED_TABLES.filter((t) => !found.has(t));

        expect(missing).toEqual([]);
    });
});
