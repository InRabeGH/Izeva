import { describe, expect, test } from 'bun:test';
import { cn } from '@/lib/utils';

describe('cn()', () => {
    test('combina clases simples', () => {
        expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold');
    });

    test('elimina clases duplicadas resolviendo conflictos de Tailwind', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    test('respeta valores condicionales falsy', () => {
        expect(cn('a', false && 'b', null, undefined, 'c')).toBe('a c');
    });
});
