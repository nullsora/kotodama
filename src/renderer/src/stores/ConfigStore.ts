import { defineStore } from 'pinia'
import { ref } from 'vue'
import localforage from 'localforage'

import { LogLevel } from '@renderer/functions/logger'
import { UserSetting } from '@renderer/functions/types'

export const useConfigStore = defineStore('config', () => {
  const windowTitle = ref('Kotodama')
  const darkMode = ref(false)
  const logLevel = ref(LogLevel.DEBUG)
  const accounts = ref<{ url: string; token: string }[]>([])

  const userSettings = ref<UserSetting[]>([])

  const loadFromStorage = async () => {
    const config: string | null = await localforage.getItem('config')
    if (config) {
      const parsedConfig = JSON.parse(config)
      windowTitle.value = parsedConfig.windowTitle ?? windowTitle.value
      darkMode.value = parsedConfig.darkMode ?? darkMode.value
      logLevel.value = parsedConfig.logLevel ?? logLevel.value
      accounts.value = parsedConfig.accounts ?? accounts.value

      userSettings.value = parsedConfig.userSettings ?? userSettings.value
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
  }

  return {
    windowTitle,
    darkMode,
    logLevel,
    accounts,

    userSettings,

    loadFromStorage,
    clearUserSettings,
    $reset
  }
})
