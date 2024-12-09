import { defineConfig, presetAttributify, presetUno, presetIcons } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

import kotodamaPreset from './src/renderer/src/style/uno-preset-style'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons(), presetScrollbar(), kotodamaPreset]
})
