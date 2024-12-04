<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useConfigStore } from './stores/config_store'

import FadeTransition from './components/misc/FadeTransition.vue'
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

const config = useConfigStore()

const currentPage = ref(Pages.Login)

const runtimeData = new DataManager(storeToRefs(config).userSettings)

onMounted(() => {
  config.loadFromStorage()
  runtimeData.watchConnect(() => {
    currentPage.value = Pages.Chat
  })

  config.$subscribe(
    async (_mutation, state) => {
      if (state.darkMode) {
        document.body.classList.add('dark-mode')
      } else {
        document.body.classList.remove('dark-mode')
      }
      await config.saveToStorage()
    },
    { detached: true }
  )

  Connector.listenMessage()

  Logger.getInstance().debug('watching connection')
})

provide('runtimeData', runtimeData)
provide('currentPage', currentPage)
</script>

<template>
  <div class="overflow-hidden main-layout">
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
            <SettingsPage v-else-if="currentPage === Pages.Settings" />
          </FadeTransition>
          <LoginPage v-if="!runtimeData.connected.value && currentPage === Pages.Login" />
        </div>
      </template>
    </MainLayout>
    <Toast position="bottom-right" group="br" />
  </div>
</template>

<style scoped>
.main-layout {
  background: var(--k-light-theme-bg);
}

.dark-mode .main-layout {
  background: var(--k-dark-theme-bg);
}
</style>
