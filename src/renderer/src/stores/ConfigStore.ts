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
  const customSettings = ref<{
    backgroundImage: {
      light: string
      dark: string
    }
    message: {
      useImageGallery: boolean
    }
  }>({
    backgroundImage: {
      light: '',
      dark: ''
    },
    message: {
      useImageGallery: true
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
      customSettings.value = parsedConfig.customSettings ?? customSettings.value

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
    if (customSettings.value.backgroundImage.light !== '') {
      document.documentElement.style.setProperty(
        '--k-light-theme-bg',
        customSettings.value.backgroundImage.light
      )
    } else {
      document.documentElement.style.setProperty(
        '--k-light-theme-bg',
        'var(--k-light-theme-bg-default)'
      )
    }
    if (customSettings.value.backgroundImage.dark !== '') {
      document.documentElement.style.setProperty(
        '--k-dark-theme-bg',
        customSettings.value.backgroundImage.dark
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
    customSettings.value = {
      backgroundImage: {
        light: '',
        dark: ''
      },
      message: {
        useImageGallery: true
      }
    }
  }

  return {
    windowTitle,
    darkMode,
    logLevel,
    accounts,
    primaryColor,
    customSettings,

    userSettings,

    loadFromStorage,
    clearUserSettings,
    updatePrimaryColor,
    updateTheme,
    $reset
  }
})
