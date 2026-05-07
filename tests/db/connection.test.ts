import { describe, expect, test } from 'bun:test';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';

describe('database connection', () => {
    test('responde a un SELECT 1', async () => {
        const result = await db.execute<{ ok: number }>(sql`SELECT 1 as ok`);
        expect(result.rows[0]).toEqual({ ok: 1 });
    });

    test('reporta la versión de Postgres', async () => {
        const result = await db.execute<{ version: string }>(sql`SELECT version() as version`);
        expect(result.rows[0]?.version).toBeString();
        expect(result.rows[0]?.version).toContain('PostgreSQL');
    });

    test('reporta la base de datos y usuario actuales', async () => {
        const result = await db.execute<{ db: string; usr: string }>(
            sql`SELECT current_database() as db, current_user as usr`,
        );
        expect(result.rows[0]?.db).toBeString();
        expect(result.rows[0]?.usr).toBeString();
    });
});
