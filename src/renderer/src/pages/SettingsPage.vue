<script setup lang="ts">
import { ref } from 'vue'

import DebugWS from '@renderer/components/misc/DebugWS.vue'
import GeneralSettings from '@renderer/components/settings/General/GeneralSettings.vue'
import MessageSettings from '@renderer/components/settings/Message/MessageSettings.vue'

const currentSettingItem = ref('General')

const menuItems = ref([
  {
    label: '设置',
    items: [
      {
        label: '通用设置',
        icon: 'i-fluent-settings-24-regular',
        command: () => {
          currentSettingItem.value = 'General'
        }
      },
      {
        label: '消息设置',
        icon: 'i-fluent-chat-24-regular',
        command: () => {
          currentSettingItem.value = 'Message'
        }
      }
    ]
  },
  {
    label: 'Debug',
    items: [
      {
        label: 'Websocket Debug',
        icon: 'i-fluent-globe-24-regular',
        command: () => {
          currentSettingItem.value = 'WS'
        }
      }
    ]
  }
])
</script>

<template>
  <div class="flex flex-row h-full p-2">
    <div class="flex-1 w-full mr-2">
      <Menu class="h-full" :model="menuItems" />
    </div>
    <div class="flex-3 w-full">
      <GeneralSettings v-if="currentSettingItem === 'General'" />
      <MessageSettings v-else-if="currentSettingItem === 'Message'" />
      <DebugWS v-else-if="currentSettingItem === 'WS'" />
    </div>
    <Toast position="bottom-right" group="br" />
    <ConfirmPopup />
  </div>
</template>
