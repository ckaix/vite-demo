module.exports = {
  root: true,
  plugins: ['stylelint-scss'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-recess-order'
  ],
  rules: {},
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts']
}
