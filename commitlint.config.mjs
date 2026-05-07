const config = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-enum': [
            2,
            'always',
            [
                'admin',
                'auth',
                'catalog',
                'db',
                'ui',
                'uploadthing',
                'config',
                'deps',
                'docs',
                'claude',
                'tests',
                'release',
            ],
        ],
        'subject-case': [0],
        'subject-max-length': [2, 'always', 100],
        'body-max-line-length': [1, 'always', 120],
    },
};

export default config;
