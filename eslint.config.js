import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'

export default defineConfig([
  { ignores: ['dist/**', 'coverage/**', '.*/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,vue}'],
    extends: [tseslint.configs.recommended],
  },
  vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },
])
