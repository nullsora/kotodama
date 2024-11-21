<script setup lang="ts">
import { GroupAnnounceMsg } from '@renderer/functions/message/message_types'
import { computed } from 'vue'
import MsgImage from '../basic/MsgImage.vue'

const { msg } = defineProps<{
  msg: GroupAnnounceMsg
}>()

const title = computed(() => {
  const u8arr = Uint8Array.from(atob(msg.title), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(u8arr)
})
const content = computed(() => {
  const u8arr = Uint8Array.from(atob(msg.text), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(u8arr)
})

const parseUrl = (path: string) => {
  return `https://gdynamic.qpic.cn/gdynamic/${path}/628`
}
</script>

<template>
  <div class="glassmorphism p-sm msg-shadow">
    <div class="flex flex-col items-start gap-sm">
      <div class="dark-gray-text font-bold">
        <i class="w-5 h-5 align-mid primary-text pi i-fluent-megaphone-circle-24-regular" />
        {{ title }}
      </div>
      <div class="gray-text text-sm">{{ content }}</div>
      <div v-if="msg.pic.length > 0">
        <MsgImage :src="parseUrl(msg.pic[0].url)" class="max-w-60 max-h-60" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.msg-shadow {
  box-shadow: rgba(180, 180, 180, 0.1) 0 0.1rem 0.1rem 0;
}

.dark-mode .msg-shadow {
  box-shadow: rgba(51, 51, 51, 0.1) 0 0.1rem 0.1rem 0;
}
</style>
