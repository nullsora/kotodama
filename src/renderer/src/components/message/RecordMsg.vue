<script setup lang="ts">
import { FileInfo, MessageTypes } from '@renderer/functions/message/message_types'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { computed, onMounted, ref, useTemplateRef, watchEffect } from 'vue'

const audio = useTemplateRef('audio')

const { msg } = defineProps<{
  msg: MessageTypes['Record']
}>()

const icon = ref('i-fluent-play-circle-24-regular')
const recordUrl = ref('')
const info = ref<FileInfo>()
const duration = ref(0)

const durationToWidth = computed(() => {
  const w = (audio.value?.duration ?? 10) * 10
  return { width: (w > 80 ? 80 : w) + 'px' }
})

const getRecord = async () => {
  info.value = (await packagedGetter.getMsg.parseRecord(msg.data.file)).data
  recordUrl.value = `k-file://static?path=${info.value.file}`
}

const getDuration = () => {
  if (!audio.value) return
  duration.value = audio.value.duration
}

const togglePlay = () => {
  if (!audio.value) return
  if (audio.value.paused) {
    audio.value.play()
    icon.value = 'i-fluent-pause-circle-24-regular'
  } else {
    audio.value.pause()
    icon.value = 'i-fluent-play-circle-24-regular'
  }
}

onMounted(() => getRecord)

watchEffect(() => {
  if (msg.data.url) {
    getRecord()
  }
})
</script>

<template>
  <audio
    ref="audio"
    preload="metadata"
    :src="recordUrl"
    @canplay="getDuration"
    @ended="icon = 'i-fluent-play-circle-24-regular'"
  />
  <div class="flex justify-between items-center gap-2 cursor-pointer" @click="togglePlay">
    <i class="w-5 h-5 align-mid pi" :class="icon" />
    <div :style="durationToWidth" class="divider" />
    <div class="gray-text text-xs">{{ duration.toFixed(1) ?? 0 }}″</div>
  </div>
</template>
