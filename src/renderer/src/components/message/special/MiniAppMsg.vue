<script setup lang="ts">
import { MiniAppMsg } from '@renderer/functions/message/message_types'
import MsgImage from '../basic/MsgImage.vue'
import { computed } from 'vue'

const { msg } = defineProps<{
  msg: MiniAppMsg
}>()

const previewUrl = computed(() => {
  if (msg.preview.startsWith('http') || msg.preview.startsWith('https')) return msg.preview
  else return `https://${msg.preview}`
})

const openInBrowser = () => {
  if (msg.qqdocurl.startsWith('http') || msg.qqdocurl.startsWith('https')) {
    window.open(msg.qqdocurl, '_blank')
  } else {
    window.open(`https://${msg.qqdocurl}`, '_blank')
  }
}
</script>

<template>
  <div class="w-80 share-msg-card p-sm" @click="openInBrowser">
    <div>
      <div class="font-bold dark-gray-text truncate">
        {{ msg.desc }}
      </div>
      <MsgImage :src="previewUrl" :show-menu="false" class="mt-2 w-full" />
    </div>
    <div class="divider" />
    <div class="flex justify-start items-center gap-1">
      <img class="w-4 h-4 rd-0.5" :src="msg.icon" crossorigin="anonymous" />
      <span class="text-xs dark-gray-text">{{ msg.title }}</span>
    </div>
  </div>
</template>
