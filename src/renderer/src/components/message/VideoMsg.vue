<script setup lang="ts">
import { FileInfo, MessageTypes } from '@renderer/functions/message/message_types'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { computed, ref } from 'vue'

const { msg } = defineProps<{
  msg: MessageTypes['Video']
}>()

const info = ref<FileInfo>()

const fileSize = computed(() => {
  return ` (${(parseInt(msg.data.file_size) / 1024 / 1024).toFixed(2)}MB)`
})

const downloadFile = async () => {
  info.value = (await packagedGetter.getMsg.downloadFile(msg.data.file)).data
}

const openVideo = async () => {
  if (msg.data.path) {
    try {
      // @ts-ignore allow window
      await window.kotodama.window.openExternal(msg.data.path)
    } catch (e) {
      await downloadFile()
      // @ts-ignore allow window
      await window.kotodama.window.openExternal(msg.data.path)
    }
  }
}
</script>

<template>
  <div class="share-msg-card p-sm" @click="openVideo">
    <div class="flex flex-row items-center">
      <Avatar size="large" icon="i-fluent-video-24-regular" />
      <div class="flex flex-col gap-2 ml-sm">
        <span class="font-bold text-sm dark-gray-text">查看视频{{ fileSize }}</span>
        <span class="max-w-40 text-xs gray-text truncate">
          {{ msg.data.file }}
        </span>
      </div>
    </div>
  </div>
</template>
