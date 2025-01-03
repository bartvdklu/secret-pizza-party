module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'next/core-web-vitals',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    "space-before-blocks": "off",
    "quotes": "off",
    "no-extra-semi": "off",
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off",
    "eol-last": "off"
  }
}
