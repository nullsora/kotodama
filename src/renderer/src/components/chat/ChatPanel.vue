<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/config_store'
import ChatInfo from './ChatInfo.vue'
import MsgPanel from './MsgPanel.vue'
import MsgSender from './MsgSender.vue'

const config = useConfigStore()

const { chatInfo } = defineProps<{
  chatInfo: {
    type: 'friend' | 'group'
    id: number
  } | null
}>()
</script>

<template>
  <div
    class="w-full h-full chat-panel glassmorphism"
    :class="{ lxgw: config.customSettings.message.useLxgw }"
  >
    <div v-if="chatInfo" class="w-full flex flex-col justify-start items-center">
      <ChatInfo class="w-full" :chat-info="chatInfo" />
      <MsgPanel :chat-info="chatInfo" />
      <MsgSender :chat-info="chatInfo" />
    </div>
    <div v-else class="w-full h-full rd-2" />
  </div>
</template>

<style scoped>
.chat-panel {
  height: calc(100vh - 4.35rem);
}

.dark-mode .chat-panel-skeleton {
  background-color: var(--p-gray-800);
}
</style>
