module.exports = {
  root: true,
  extends: [
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-recommended-vue',
    'stylelint-config-property-sort-order-smacss',
    //关闭所有不必要的或可能与Prettier冲突的规则
    'stylelint-config-prettier-scss'
  ],
  rules: {
    // recommended rules
    // 'at-rule-no-unknown': null,
    // 'scss/at-rule-no-unknown': true,
    // // any other rules you'd want to change e.g.
    // 'scss/dollar-variable-pattern': '^foo',
    // 'scss/selector-no-redundant-nesting-selector': true,
    // // 为了使用:deep()/::v-deep(),:slotted()/::v-slotted()添加
    // 'selector-pseudo-element-no-unknown': null,
    // 'selector-pseudo-class-no-unknown': null,
    // 'function-calc-no-invalid': null
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts']
}
