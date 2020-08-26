module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        assert: 'either'
      }
    ],
    'no-unexpected-multiline': 'error'
  },
  env: {
    es6: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  }
}
