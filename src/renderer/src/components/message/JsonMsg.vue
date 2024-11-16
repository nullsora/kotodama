<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'

const { msg } = defineProps<{
  msg: MessageTypes['JSON']
}>()

const parsedMsg = computed(() => JSON.parse(msg.data.data))

const openInBrowser = (meta) => {
  if (meta.jumpUrl) window.open(meta.jumpUrl, '_blank')
  else if (meta.qqdocurl) {
    if (meta.qqdocurl.startsWith('http') || meta.qqdocurl.startsWith('https'))
      window.open(meta.qqdocurl, '_blank')
    else window.open(`https://${meta.qqdocurl}`, '_blank')
  }
}

const getIconUrl = (meta) => {
  if (meta.source_icon) return meta.source_icon
  else if (meta.icon) return meta.icon
  else return ''
}

const getPreviewUrl = (meta) => {
  if (meta.preview)
    if (meta.preview.startsWith('http') || meta.preview.startsWith('https')) return meta.preview
    else return `https://${meta.preview}`
  else return ''
}
</script>

<template>
  <div
    v-for="(value, key) in parsedMsg.meta"
    :key="key"
    class="w-80 p-sm share-card glassmorphism"
    @click="openInBrowser(value)"
  >
    <div class="flex flex-row justify-start items-center gap-2">
      <img class="w-15 h-15 rd-2" :src="getPreviewUrl(value)" crossorigin="anonymous" />
      <div class="flex flex-col justify-start items-start gap-1">
        <span class="font-bold text-sm dark-gray-text">{{ value.title }}</span>
        <span class="text-xs gray-text">{{ value.desc }}</span>
      </div>
    </div>
    <div class="divider" />
    <div class="flex flex-row justify-between items-start gap-2">
      <img class="w-4 h-4 rd-0.5" :src="getIconUrl(value)" crossorigin="anonymous" />
      <span class="text-xs gray-text">{{ value.tag ?? value.title }}</span>
    </div>
  </div>
</template>

<style scoped>
.share-card {
  cursor: pointer;
  border: 1px solid var(--p-gray-300);
}

.share-card:hover {
  box-shadow: rgba(142, 142, 142, 0.15) 0 0.7rem 0.7rem 0;
}

.dark-mode .share-card {
  border: 1px solid var(--p-gray-700);
}

.dark-mode .share-card:hover {
  box-shadow: rgba(90, 90, 90, 0.15) 0 0.7rem 0.7rem 0;
}

.divider {
  height: 1px;
  background-color: var(--p-gray-300);
  margin: 0.5rem 0;
}
</style>
