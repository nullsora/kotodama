<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import { storeToRefs } from 'pinia'
import localforage from 'localforage'

import { useConfigStore } from './stores/ConfigStore'

import TopBar from './components/main/TopBar.vue'
import MainLayout from './components/layout/MainLayout.vue'

import ChatPage from './pages/ChatPage.vue'
import LoginPage from './pages/LoginPage.vue'
import SettingsPage from './pages/SettingsPage.vue'

import Connector from './functions/connector'
import { Logger } from './functions/logger'
import { Pages } from './functions/types'
import { DataManager } from './functions/data_manager'
import ContactPage from './pages/ContactPage.vue'
import FadeTransition from './components/misc/FadeTransition.vue'

const config = useConfigStore()

const currentPage = ref(Pages.Chat)
const darkModeClass = computed(() => (config.darkMode ? 'dark-mode' : ''))

const runtimeData = new DataManager(storeToRefs(config).userSettings)

onMounted(() => {
  config.loadFromStorage()
  runtimeData.watchConnect()

  config.$subscribe(
    async (_mutation, state) => {
      await localforage.setItem('config', JSON.stringify(state))
    },
    { detached: true }
  )

  Connector.listenMessage()

  Logger.getInstance().debug('watching connection')
})
provide('runtimeData', runtimeData)
</script>

<template>
  <div :class="darkModeClass" class="overflow-hidden">
    <MainLayout>
      <template #header>
        <TopBar
          v-model:dark-mode="config.darkMode"
          v-model:current-page="currentPage"
          :title="config.windowTitle"
          :show-menu="runtimeData.connected.value"
        />
      </template>
      <template #main>
        <div class="h-full">
          <FadeTransition>
            <ChatPage v-if="runtimeData.connected.value && currentPage === Pages.Chat" />
            <ContactPage
              v-else-if="runtimeData.connected.value && currentPage === Pages.Contacts"
            />
            <SettingsPage
              v-else-if="runtimeData.connected.value && currentPage === Pages.Settings"
            />
            <LoginPage v-else />
          </FadeTransition>
        </div>
      </template>
    </MainLayout>
    <Toast position="bottom-right" group="br" />
  </div>
</template>

<style>
::selection {
  background-color: var(--p-gray-300);
  opacity: 0.7;
}
</style>
