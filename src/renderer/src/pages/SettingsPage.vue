<script setup lang="ts">
import { computed, ref } from 'vue'

import DebugWS from '@renderer/components/misc/DebugWS.vue'
import GeneralSettings from '@renderer/components/settings/General/GeneralSettings.vue'
import MessageSettings from '@renderer/components/settings/Message/MessageSettings.vue'
import About from '@renderer/components/settings/About.vue'
import { LogLevel } from '@renderer/functions/logger'
import { useConfigStore } from '@renderer/stores/config_store'

const config = useConfigStore()

const currentSettingItem = ref('General')
const menuItems = computed(() => {
  const items = [
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
    }
  ]
  if (config.logLevel === LogLevel.DEBUG) {
    items.push({
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
    })
  }
  return items
})
</script>

<template>
  <div class="flex h-full p-2">
    <div class="flex-1 w-full mr-2">
      <Menu class="h-full flex flex-col justify-between" :model="menuItems">
        <template #end>
          <div class="pl-sm pr-sm"><div class="divider" /></div>
          <div
            v-ripple
            class="flex justify-start items-center gap-2.5 m-sm select-none rd-2 p-2"
            @click="currentSettingItem = 'About'"
          >
            <i class="gray-text i-fluent-info-24-regular w-5 h-5 align-mid" />
            <span class="dark-gray-text">关于</span>
          </div>
        </template>
      </Menu>
    </div>
    <div class="flex-3 w-full">
      <GeneralSettings v-if="currentSettingItem === 'General'" />
      <MessageSettings v-else-if="currentSettingItem === 'Message'" />
      <DebugWS v-else-if="currentSettingItem === 'WS'" />
      <About v-else-if="currentSettingItem === 'About'" />
    </div>
    <Toast position="bottom-right" group="br" />
    <ConfirmPopup />
  </div>
</template>
