<script setup lang="ts">
import { FileInfo, MessageTypes } from '@renderer/functions/message/message_types'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'

const { msg } = defineProps<{
  msg: MessageTypes['Record']
}>()

const icon = ref('i-fluent-play-circle-24-regular')
const blobUrl = ref('')
const info = ref<FileInfo>()
const audio = ref<HTMLAudioElement | null>(null)
const recordTime = ref(0)

const getRecord = async () => {
  info.value = (await packagedGetter.getMsg.parseRecord(msg.data.file)).data
  const blob = await packagedGetter.cachedFile.recordBlob.get(info.value.file)
  blobUrl.value = URL.createObjectURL(blob)

  if (!audio.value) {
    audio.value = new Audio(blobUrl.value)
    audio.value.onended = () => {
      icon.value = 'i-fluent-play-circle-24-regular'
    }
    if (audio.value.duration) {
      recordTime.value = audio.value.duration
    } else {
      // TODO: get duration
    }
  }
}

const togglePlay = () => {
  if (!audio.value) {
    audio.value = new Audio(blobUrl.value)
    audio.value.onended = () => {
      icon.value = 'i-fluent-play-circle-24-regular'
    }
  }

  if (audio.value.paused) {
    audio.value.play()
    icon.value = 'i-fluent-pause-circle-24-regular'
  } else {
    audio.value.pause()
    icon.value = 'i-fluent-play-circle-24-regular'
  }
}

onMounted(() => {
  getRecord()
})

watchEffect(() => {
  if (msg.data.url) {
    getRecord()
  }
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
  URL.revokeObjectURL(blobUrl.value)
})
</script>

<template>
  <div class="w-20 flex justify-start gap-2 items-start record-msg" @click="togglePlay">
    <i class="w-5 h-5 align-mid pi" :class="icon" />
  </div>
</template>

<style scoped>
.record-msg {
  cursor: pointer;
}
</style>
