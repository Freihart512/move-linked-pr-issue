module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ['standard', 'plugin:jsdoc/recommended'],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    },
    {
      files: ['**/*.test.js'],
      env: { jest: true }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['jsdoc'],
  rules: {
    semi: [2, 'always']
  }
};
