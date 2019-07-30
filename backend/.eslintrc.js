module.exports = {
  'env': {
    'browser': true,
    'commonjs': false,
    'es6': true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    "sourceType": "module",
  },
  'rules': {
    'max-len': ["error", { "code": 120 }]
  },
};
