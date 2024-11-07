import { defineConfig, presetAttributify, presetUno, presetIcons } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons({}), presetScrollbar()],
  rules: [
    [
      'primary-border',
      {
        border: '1px solid #e2e8f0',
        'border-radius': '0.5rem'
      }
    ]
  ]
})
