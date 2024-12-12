<script setup lang="ts">
import { JSONContactShareMsg } from '@renderer/functions/message/message_types'

const { msg } = defineProps<{
  msg: JSONContactShareMsg
}>()

const parseUrl = (url: string) => {
  try {
    const { protocol } = new URL(url)
    return 'k-web-img:' + url.slice(protocol.length)
  } catch (error) {
    return url
  }
}

const openInBrowser = () => {
  window.open(msg.jumpUrl, '_blank')
}
</script>

<template>
  <div class="w-70 share-msg-card glassmorphism p-sm" @click="openInBrowser">
    <div class="flex justify-between items-center gap-2">
      <MsgImage class="w-12 h-12 object-cover drag-none rd-full" :src="parseUrl(msg.avatar)" />
      <div class="flex flex-col justify-start items-end gap-1 select-none">
        <span class="font-bold dark-gray-text">{{ msg.nickname }}</span>
        <span class="text-xs text-right gray-text">{{ msg.contact }}</span>
      </div>
    </div>
    <div class="divider" />
    <div class="flex justify-start items-center gap-1 gray-text">
      <img v-if="msg.tagIcon" class="w-4 h-4 rd-0.5 drag-none" :src="parseUrl(msg.tagIcon)" />
      <i v-else class="pi i-fluent-person-link-24-regular w-4 h-4 align-mid" />
      <span class="text-xs">{{ msg.tag }}</span>
    </div>
  </div>
</template>
