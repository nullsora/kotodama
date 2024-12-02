<script setup lang="ts">
import { FileInfo, MessageTypes } from '@renderer/functions/message/message_types'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { computed, ref } from 'vue'

const { msg } = defineProps<{
  msg: MessageTypes['File']
}>()

const info = ref<FileInfo>()

const flieColorMap = [
  {
    selector: ['doc', 'docx'],
    bg: 'var(--p-blue-500)',
    color: 'white'
  },
  {
    selector: ['xls', 'xlsx'],
    bg: 'var(--p-green-500)',
    color: 'white'
  },
  {
    selector: ['ppt', 'pptx'],
    bg: 'var(--p-red-500)',
    color: 'white'
  },
  {
    selector: ['pdf'],
    bg: 'var(--p-red-500)',
    color: 'white'
  }
]

const fileType = computed(() => {
  const file = msg.data.file
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
  const size = parseInt(msg.data.file_size)
  if (size < 1024) return `${size}B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)}KB`
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)}MB`
  return `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`
})

const bgColor = computed(() => {
  const ext = msg.data.file.split('.').pop()?.toLowerCase()
  if (!ext) return 'var(--p-gray-300)'
  const color = flieColorMap.find((item) => item.selector.includes(ext))
  return color ? color.bg : 'var(--p-gray-300)'
})

const iconColor = computed(() => {
  const ext = msg.data.file.split('.').pop()?.toLowerCase()
  if (!ext) return 'var(--p-gray-800)'
  const color = flieColorMap.find((item) => item.selector.includes(ext))
  return color ? color.color : 'var(--p-gray-800)'
})

const avatarStyle = computed(() => {
  return {
    'background-color': bgColor.value,
    color: iconColor.value
  }
})

const downloadFile = async () => {
  info.value = (await packagedGetter.getMsg.downloadFile(msg.data.file_id)).data
}

const openFile = async () => {
  if (msg.data.path === '') await downloadFile()
  else await window.kotodama.window.openExternal(msg.data.path)
  if (info.value?.file) {
    // @ts-ignore - window is defined in preload
    await window.kotodama.window.openExternal(info.value.file)
  }
}
</script>

<template>
  <div
    v-tooltip.top="msg.data.file"
    class="file-message flex items-center gap-sm cursor-pointer"
    @click="openFile"
  >
    <Avatar size="large" :icon="fileType" :style="avatarStyle" />
    <div class="flex flex-col">
      <span class="truncate text-sm w-40">{{ msg.data.file }}</span>
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
