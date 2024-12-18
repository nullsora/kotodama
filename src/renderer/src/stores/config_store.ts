import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  const defaultCustomSettings = {
    backgroundImage: {
      light: '',
      dark: ''
    },
    message: {
      alwaysShowTimestamp: true,
      localFacePath: '',
      useImageGallery: true,
      useLxgw: false
    }
  }

  const customSettings = ref(defaultCustomSettings)

  const userSettings = ref<UserSetting[]>([])

  const loadFromStorage = async () => {
    // @ts-ignore - window is defined in preload
    const config: string = await window.kotodama.file.getConfig()
    if (config) {
      const parsedConfig = JSON.parse(config)
      windowTitle.value = parsedConfig.windowTitle ?? windowTitle.value
      darkMode.value = parsedConfig.darkMode ?? darkMode.value
      logLevel.value = parsedConfig.logLevel ?? logLevel.value
      accounts.value = parsedConfig.accounts ?? accounts.value
      primaryColor.value = parsedConfig.primaryColor ?? primaryColor.value
      customSettings.value = {
        ...defaultCustomSettings,
        ...parsedConfig.customSettings
      }

      userSettings.value = parsedConfig.userSettings ?? userSettings.value
    }
    updatePrimaryColor()
    updateTheme()
  }

  const saveToStorage = async () => {
    const str = JSON.stringify(
      {
        windowTitle: windowTitle.value,
        darkMode: darkMode.value,
        logLevel: logLevel.value,
        accounts: accounts.value,
        primaryColor: primaryColor.value,
        customSettings: customSettings.value,
        userSettings: userSettings.value
      },
      null,
      2
    )
    // @ts-ignore - window is defined in preload
    await window.kotodama.file.saveConfig(str)
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
    customSettings.value = defaultCustomSettings
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
    saveToStorage,

    updatePrimaryColor,
    updateTheme,

    clearUserSettings,
    $reset
  }
})
