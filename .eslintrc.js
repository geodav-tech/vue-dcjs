module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "bundle/"
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': ['error', 'never'],
    'no-unused-vars': ['error', { 
        'varsIgnorePattern': '^_', 
        'argsIgnorePattern': '^_', 
        'ignoreRestSiblings': true 
    }]
  }
}
