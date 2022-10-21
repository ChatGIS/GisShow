export default {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:vue/vue3-essential',
        'plugin:@typescript-eslint/recommended'
    ],
    'overrides': [{
        files: ['*.js', '*.jsx'],
        parser: '@babel/eslint-parser'
    }, {
        files: ['*.ts'],
        parser: '@typescript-eslint/parser',
    }, {
        files: ['*.vue'],
        parser: 'vue-eslint-parser',
    }
    ],
    // 'parser': 'vue-eslint-parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        'vue',
        '@typescript-eslint'
    ],
    'rules': {
        // 'indent': [
        //     'error',
        //     4
        // ],
        // 'linebreak-style': [
        //     'error',
        //     'windows'
        // ],
        // 'quotes': [
        //     'error',
        //     'single'
        // ],
        'semi': [
            'error', 'never'
        ]
    }
}
