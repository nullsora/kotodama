<script setup lang="ts">
import { LocationMsg } from '@renderer/functions/message/message_types'

const { msg } = defineProps<{
  msg: LocationMsg
}>()

const searchInAMap = () => {
  const url = `https://amap.com/search?query=${msg.address}`
  window.open(url, '_blank')
}
</script>

<template>
  <div class="w-80 share-msg-card glassmorphism p-sm" @click="searchInAMap">
    <div class="flex flex-row justify-start items-center gap-2">
      <div class="h-15 h-15 flex justify-center items-center">
        <i class="pi i-fluent-emoji-round-pushpin w-10 h-10" />
      </div>
      <div class="flex flex-col justify-start items-start gap-1">
        <span class="font-bold text-sm dark-gray-text">{{ msg.name }}</span>
        <span class="text-xs truncate gray-text">{{ msg.address }}</span>
      </div>
    </div>
    <div class="divider" />
    <div class="flex flex-row justify-start items-center gap-1">
      <span class="text-xs dark-gray-text">位置分享</span>
    </div>
  </div>
</template>

<style scoped>
.divider {
  height: 1px;
  background-color: var(--p-gray-300);
  margin: 0.5rem 0;
}
</style>
