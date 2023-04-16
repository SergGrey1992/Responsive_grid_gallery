module.exports = {
    env: {
        browser: true,
        node: true,
        amd: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'prettier',
        'prettier/prettier',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
        'unused-imports',
        'simple-import-sort',
    ],
    rules: {
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-empty-pattern': 'off',
        'no-debugger': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports-ts': 'error',
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    // Packages `react` related packages come first.
                    ['^react', '^@?\\w'],
                    // Internal packages.
                    ['^(@|components)(/.*|$)'],
                    // Side effect imports.
                    ['^\\u0000'],
                    // Parent imports. Put `..` last.
                    ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                    // Other relative imports. Put same-folder imports and `.` last.
                    ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                    // Style imports.
                    ['^.+\\.?(css)$'],
                ],
            },
        ],
        'simple-import-sort/exports': 'error',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
}
