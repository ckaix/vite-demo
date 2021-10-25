module.exports = {
  root: true,
  plugins: ['stylelint-scss'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-recess-order'
  ],
  rules: {
    // recommended rules
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    // any other rules you'd want to change e.g.
    'scss/dollar-variable-pattern': '^foo',
    'scss/selector-no-redundant-nesting-selector': true,
    // 为了使用:deep()/::v-deep(),:slotted()/::v-slotted()添加
    'selector-pseudo-element-no-unknown': null,
    'selector-pseudo-class-no-unknown': null
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts']
}
