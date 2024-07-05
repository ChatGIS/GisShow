/*
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2024-05-15 22:39:38
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-18 10:55:35
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

