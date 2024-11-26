<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { ref } from 'vue'

const { msg } = defineProps<{
  msg: MessageTypes['Record']
}>()

const icon = ref('i-fluent-play-circle-24-regular')
const blobUrl = ref('')

const playRecord = async () => {
  if (icon.value === 'i-fluent-play-circle-24-regular') {
    icon.value = 'i-fluent-pause-circle-24-regular'
    let url = msg.data.url

    if (url.startsWith('file') && msg.data.path) {
      url = msg.data.path
    }

    const buffer = await packagedGetter.cachedFile.recordBuffer.get(url)

    blobUrl.value = URL.createObjectURL(new Blob([buffer], { type: 'audio/amr' }))
    const audio = new Audio(blobUrl.value)
    audio.play()

    icon.value = 'i-fluent-play-circle-24-regular'
  }
}
</script>

<template>
  <div class="flex flex-row justify-start gap-2 items-start record-msg">
    <i class="w-5 h-5 align-mid pi" :class="icon" />
    <span class="gray-text font-italic">暂不支持语音</span>
  </div>
</template>

<style scoped>
.record-msg {
  cursor: pointer;
}
</style>
