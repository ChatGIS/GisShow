module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:vue/vue3-essential',
        'plugin:@typescript-eslint/recommended'
    ],
    'overrides': [
    ],
    'parser': 'vue-eslint-parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
        'parser': '@typescript-eslint/parser',
    },
    'plugins': [
        'vue',
        '@typescript-eslint'
    ],
    'rules': {
        // 'indent': [
        //     'error',
        //     3
        // ],
        // 'linebreak-style': [
        //     'error',
        //     'windows'
        // ],
        // 'quotes': [
        //     'error',
        //     'single'
        // ],
        // 'semi': [
        //     'error',
        //     'never'
        // ]
    }
}
