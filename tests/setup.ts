import { beforeAll, mock } from 'bun:test';

mock.module('server-only', () => ({}));
mock.module('client-only', () => ({}));

beforeAll(() => {
    const required = ['DATABASE_URL'];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(
            `Faltan variables de entorno requeridas para los tests: ${missing.join(', ')}.\n` +
                'Crea un archivo .env (o .env.test) con esas variables antes de correr "bun test".',
        );
    }
});
