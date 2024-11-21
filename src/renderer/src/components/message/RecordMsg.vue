<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import { packagedGetter } from '@renderer/functions/packaged_api'
import BenzAMRRecorder from 'benz-amr-recorder'
import { onBeforeUnmount, ref } from 'vue'

const { msg } = defineProps<{
  msg: MessageTypes['Record']
}>()

const amr = ref<BenzAMRRecorder | null>(null)
const icon = ref('i-fluent-play-circle-24-regular')

const playRecord = async () => {
  if (!amr.value) {
    amr.value = new BenzAMRRecorder()

    let url = msg.data.url
    if (url.startsWith('file://') && msg.data.path) {
      url = msg.data.path
    }

    const buffer = await packagedGetter.getRecordBuffer(msg.data.url)
    await amr.value.initWithBlob(new Blob([buffer]))

    amr.value.play()
    icon.value = 'i-fluent-pause-circle-24-regular'
  } else stopRecord()
}

const stopRecord = () => {
  if (amr.value) {
    amr.value.stop()
    icon.value = 'i-fluent-play-circle-24-regular'
  }
}

onBeforeUnmount(() => {
  stopRecord()
})
</script>

<template>
  <div class="flex flex-row justify-start gap-2 items-start w-20 record-msg" @click="playRecord">
    <i class="w-5 h-5 align-mid pi" :class="icon" />
  </div>
</template>

<style scoped>
.record-msg {
  cursor: pointer;
}
</style>
