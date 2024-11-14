<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'

const props = defineProps<{
  msg: MessageTypes['File']
}>()

const fileType = computed(() => {
  const file = props.msg.data.file
  const ext = file.split('.').pop()?.toLowerCase()
  if (!ext) return 'i-fluent-document-24-regular'
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'i-fluent-image-24-regular'
  if (['mp4', 'webm', 'ogg', 'avi', 'mkv', 'flv', 'mov'].includes(ext))
    return 'i-fluent-video-clip-24-regular'
  if (['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'].includes(ext))
    return 'i-fluent-music-note-2-24-regular'
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext))
    return 'i-fluent-folder-zip-24-regular'
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt'].includes(ext))
    return 'i-fluent-document-bullet-list-24-regular'
  return 'i-fluent-document-24-regular'
})

const fileSize = computed(() => {
  const size = parseInt(props.msg.data.file_size)
  if (size < 1024) return `${size}B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)}KB`
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)}MB`
  return `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`
})

const downloadFile = async () => {
  // Create download link
  const link = document.createElement('a')
  link.href = props.msg.data.url
  link.download = props.msg.data.file
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div
    class="file-message flex flex-row items-center gap-sm cursor-pointer"
    @click="downloadFile"
  >
    <Avatar size="large" :icon="fileType" />
    <div class="flex flex-col">
      <span class="truncate text-sm max-w-60">{{ props.msg.data.file }}</span>
      <span class="text-xs text-gray-500">{{ fileSize }}</span>
    </div>
  </div>
</template>

<style scoped>
.file-message {
  padding: 0.4rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.file-message:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
