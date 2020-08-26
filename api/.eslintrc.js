module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'no-underscore-dangle': 0,
    'func-names': 'off'
  },
  env: {
    es6: true,
    browser: true,
    jest: true
  }
}
