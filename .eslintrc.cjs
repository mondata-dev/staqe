process.env.ESLINT_TSCONFIG = 'tsconfig.json';
module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: ['tsconfig.json'],
    extraFileExtensions: ['.vue'],
  },
  extends: [
    '@antfu',
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-unsafe-call': 'off', // Nimiq Imports
    '@typescript-eslint/no-unsafe-member-access': 'off', // Nimiq Imports
    'vue/no-empty-component-block': 'error',
    'vue/no-multiple-template-root': 'off', // does not apply to vue3

    // the following rules conflict with prettier and are therefore disabled
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/html-indent': 'off',
    'operator-linebreak': 'off',
    'arrow-parens': 'off',
    '@stylistic/js/brace-style': 'off',
    '@stylistic/js/operator-linebreak': 'off',
    '@stylistic/ts/brace-style': 'off',
    '@stylistic/ts/indent': 'off',
    '@stylistic/ts/member-delimiter-style': 'off',
    'antfu/if-newline': 'off',
    'import/order': 'off',

    // the following rules make sense but are not fully followed in this project
    // => for now we only warn but no error
    camelcase: 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    'n/prefer-global/process': 'warn',
    'require-await': 'warn',
    'no-new-wrappers': 'warn',
  },
};
