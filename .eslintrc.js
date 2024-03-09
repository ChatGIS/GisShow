/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-05-15 11:39:38
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-05-29 17:27:04
 * @FilePath: \GisShow\.eslintrc.js
 * @Description: 
 */
// eslint-disable-next-line no-undef

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

    'vue/multi-word-component-names': ['error',{

      'ignores': ['index']  //需要忽略的组件名

    }],

    'indent': [

      'error',

      2

    ],

    'linebreak-style': [

      'error',

      'unix'

    ],

    'quotes': [

      'error',

      'single'

    ],

    'semi': [

      'error',

      'never'

    ],

    'no-debugger': 'warn'  // 禁用 debugger

  }

}

