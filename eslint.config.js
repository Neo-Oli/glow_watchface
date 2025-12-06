import pluginJs from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default {
    ...pluginJs.configs.recommended,
    ...eslintPluginPrettierRecommended,
    name: 'glow-default',
    files: ['glow_custom/**/*'],
    ignores: [],
    languageOptions: {
        globals: {
            console: 'readonly',
            setTimeout: 'readonly',
            clearTimeout: 'readonly',
            setInterval: 'readonly',
            clearInterval: 'readonly',
        },
    },
    rules: {
        eqeqeq: 'error',
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'multiline-comment-style': ['error', 'starred-block'],
        'no-var': 1,
        'prefer-template': 'error',
        'prettier/prettier': 'error',
    },
}

