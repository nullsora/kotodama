<script setup lang="ts">
import ChatInfo from './ChatInfo.vue'
import MsgPanel from './MsgPanel.vue'
import MsgSender from './MsgSender.vue'

const props = defineProps<{
  chatInfo: {
    type: 'friend' | 'group'
    id: number
  } | null
}>()
</script>

<template>
  <div class="w-full h-full chat-panel primary-border">
    <div v-if="props.chatInfo" class="w-full flex flex-col justify-start items-center">
      <ChatInfo class="w-full" :chat-info="props.chatInfo" />
      <MsgPanel :chat-info="props.chatInfo" />
      <MsgSender :chat-info="props.chatInfo" />
    </div>
    <div v-else class="chat-panel-skeleton w-full h-full rd-2" />
  </div>
</template>

<style scoped>
.chat-panel {
  height: calc(100vh - 4.35rem);
}

.chat-panel-skeleton {
  background-color: var(--p-gray-50);
}

.dark-mode .chat-panel-skeleton {
  background-color: var(--p-gray-800);
}
</style>
