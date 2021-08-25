module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prefer-destructuring': ['error', {
      array: false,
      object: false,
    }, { enforceForRenamedProperties: false }],
    'object-curly-newline': ['error', { multiline: true }],
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'max-len': ['error', { code: 200 }],
    'no-bitwise': ['error', { int32Hint: true }],
    'no-param-reassign': ['error', { props: false }],
    'arrow-body-style': ['error', 'as-needed'],
  },
};
