import js from '@eslint/js'
import vue from 'eslint-plugin-vue'

export default [
  { ignores: ['dist/**', 'coverage/**', '.*/**'] },
  js.configs.recommended,
  ...vue.configs['flat/essential'],
]
