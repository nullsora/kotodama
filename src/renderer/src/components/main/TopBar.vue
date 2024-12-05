<script setup lang="ts">
import { Pages } from '@renderer/functions/types'
import { computed, ref } from 'vue'

// @ts-ignore - window is defined in preload
const kotodama = window.kotodama

defineProps<{ title?: string; showMenu: boolean }>()
const darkMode = defineModel<boolean>('darkMode')
const currentPage = defineModel<string>('currentPage')

const isMaximized = ref(false)
const maximizedIconStyle = computed(() => {
  return isMaximized.value ? 'i-fluent-resize-24-regular' : 'i-fluent-maximize-24-regular'
})

const getMenuButtonStyle = (page: Pages) => {
  switch (page) {
    case Pages.Chat:
      return currentPage.value === Pages.Chat ? 'primary' : 'secondary'
    case Pages.Contacts:
      return currentPage.value === Pages.Contacts ? 'primary' : 'secondary'
    case Pages.Settings:
      return currentPage.value === Pages.Settings ? 'primary' : 'secondary'
    case Pages.Login:
      return currentPage.value === Pages.Login ? 'primary' : 'secondary'
  }
}

async function minimize() {
  await kotodama.window.minimize()
}
async function toggleMaximize() {
  await kotodama.window.toggleMaximize()
}
async function close() {
  await kotodama.window.close()
}

function switchDarkMode() {
  darkMode.value = !darkMode.value
}

kotodama.window.watchMaximize((_event, windowIsMaximized) => {
  isMaximized.value = windowIsMaximized
})
</script>

<template>
  <div class="draggable topbar glassmorphism">
    <Tag rounded severity="primary" :value="title ?? 'Kotodama'" />
    <div class="non-drag topbar-menu">
      <Button
        v-if="showMenu"
        class="menu-btn"
        size="small"
        rounded
        :severity="getMenuButtonStyle(Pages.Chat)"
        @click="currentPage = Pages.Chat"
      >
        <i class="i-fluent-color-chat-multiple-24 font-size-4" />
        {{ currentPage === Pages.Chat ? '聊天' : '' }}
      </Button>
      <Button
        v-if="showMenu"
        class="menu-btn"
        size="small"
        rounded
        :severity="getMenuButtonStyle(Pages.Contacts)"
        @click="currentPage = Pages.Contacts"
      >
        <i class="i-fluent-color-people-24 font-size-4" />
        {{ currentPage === Pages.Contacts ? '联系人' : '' }}
      </Button>
      <Button
        v-if="!showMenu"
        class="menu-btn"
        size="small"
        rounded
        :severity="getMenuButtonStyle(Pages.Login)"
        @click="currentPage = Pages.Login"
      >
        <i class="i-fluent-color-globe-shield-24 font-size-4" />
        {{ currentPage === Pages.Login ? '登录' : '' }}
      </Button>
      <Button
        class="menu-btn"
        size="small"
        rounded
        :severity="getMenuButtonStyle(Pages.Settings)"
        @click="currentPage = Pages.Settings"
      >
        <i class="i-fluent-color-wrench-24 font-size-4" />
        {{ currentPage === Pages.Settings ? '设置' : '' }}
      </Button>
    </div>
    <div>
      <Button
        class="non-drag"
        size="small"
        rounded
        severity="secondary"
        text
        @click="switchDarkMode"
      >
        <i v-if="darkMode" class="i-fluent-weather-moon-24-regular font-size-4" />
        <i v-else class="i-fluent-weather-sunny-24-regular font-size-4" />
      </Button>
      <ButtonGroup class="non-drag">
        <Button size="small" rounded severity="secondary" text @click="minimize">
          <i class="i-fluent-minimize-24-regular font-size-4" />
        </Button>
        <Button size="small" rounded severity="secondary" text @click="toggleMaximize">
          <i :class="maximizedIconStyle" class="font-size-4" />
        </Button>
        <Button size="small" rounded severity="danger" text @click="close">
          <i class="i-fluent-dismiss-24-regular font-size-4" />
        </Button>
      </ButtonGroup>
    </div>
  </div>
</template>

<style scoped>
.draggable {
  -webkit-app-region: drag;
}

.non-drag {
  -webkit-app-region: no-drag;
}

.topbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0.4rem;
  border-radius: 3rem;
}

.topbar-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.menu-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  font-size: 0.85rem;
}
</style>
