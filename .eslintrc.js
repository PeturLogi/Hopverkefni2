module.exports = {
  extends: 'airbnb-base',
  env: {
    browser: true
  },
  rules: {
    "linebreak-style": ["error", "windows"],
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'class-methods-use-this': 0,
  },
  plugins: ['import'],
};
