import { defineStore } from 'pinia'
import { ref } from 'vue'
import localforage from 'localforage'

import { LogLevel } from '@renderer/functions/logger'
import { PrimaryColor, UserSetting } from '@renderer/functions/types'
import { updatePreset } from '@primevue/themes'

export const useConfigStore = defineStore('config', () => {
  const windowTitle = ref('Kotodama')
  const darkMode = ref(false)
  const logLevel = ref(LogLevel.DEBUG)
  const accounts = ref<{ url: string; token: string }[]>([])
  const primaryColor = ref<{ name: string; code: PrimaryColor }>({
    name: 'Blue',
    code: PrimaryColor.Blue
  })
  const themeSettings = ref<{
    backgroundImage: {
      light: string
      dark: string
    }
  }>({
    backgroundImage: {
      light: '',
      dark: ''
    }
  })

  const userSettings = ref<UserSetting[]>([])

  const loadFromStorage = async () => {
    const config: string | null = await localforage.getItem('config')
    if (config) {
      const parsedConfig = JSON.parse(config)
      windowTitle.value = parsedConfig.windowTitle ?? windowTitle.value
      darkMode.value = parsedConfig.darkMode ?? darkMode.value
      logLevel.value = parsedConfig.logLevel ?? logLevel.value
      accounts.value = parsedConfig.accounts ?? accounts.value
      primaryColor.value = parsedConfig.primaryColor ?? primaryColor.value
      themeSettings.value = parsedConfig.themeSettings ?? themeSettings.value

      userSettings.value = parsedConfig.userSettings ?? userSettings.value
    }
    updatePrimaryColor()
    updateTheme()
  }

  const updatePrimaryColor = () => {
    updatePreset({
      semantic: {
        primary: {
          50: `{${primaryColor.value.code}.50}`,
          100: `{${primaryColor.value.code}.100}`,
          200: `{${primaryColor.value.code}.200}`,
          300: `{${primaryColor.value.code}.300}`,
          400: `{${primaryColor.value.code}.400}`,
          500: `{${primaryColor.value.code}.500}`,
          600: `{${primaryColor.value.code}.600}`,
          700: `{${primaryColor.value.code}.700}`,
          800: `{${primaryColor.value.code}.800}`,
          900: `{${primaryColor.value.code}.900}`,
          950: `{${primaryColor.value.code}.950}`
        }
      }
    })
  }

  const updateTheme = () => {
    if (themeSettings.value.backgroundImage.light !== '') {
      document.documentElement.style.setProperty(
        '--k-light-theme-bg',
        themeSettings.value.backgroundImage.light
      )
    } else {
      document.documentElement.style.setProperty(
        '--k-light-theme-bg',
        'var(--k-light-theme-bg-default)'
      )
    }
    if (themeSettings.value.backgroundImage.dark !== '') {
      document.documentElement.style.setProperty(
        '--k-dark-theme-bg',
        themeSettings.value.backgroundImage.dark
      )
    } else {
      document.documentElement.style.setProperty(
        '--k-dark-theme-bg',
        'var(--k-dark-theme-bg-default)'
      )
    }
  }

  const clearUserSettings = () => {
    userSettings.value = []
  }

  const $reset = () => {
    windowTitle.value = 'Kotodama'
    darkMode.value = false
    logLevel.value = LogLevel.DEBUG
    accounts.value = []
    primaryColor.value = {
      name: 'Blue',
      code: PrimaryColor.Blue
    }
    themeSettings.value = {
      backgroundImage: {
        light: '',
        dark: ''
      }
    }
  }

  return {
    windowTitle,
    darkMode,
    logLevel,
    accounts,
    primaryColor,
    themeSettings,

    userSettings,

    loadFromStorage,
    clearUserSettings,
    updatePrimaryColor,
    updateTheme,
    $reset
  }
})
