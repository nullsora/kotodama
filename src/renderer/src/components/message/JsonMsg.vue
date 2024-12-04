<script setup lang="ts">
import { JsonInnerMsg, MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'
import AnnounceMsg from './special/AnnounceMsg.vue'
import MsgImage from './basic/MsgImage.vue'
import MiniAppMsg from './special/MiniAppMsg.vue'
import LocationMsg from './special/LocationMsg.vue'

const { msg } = defineProps<{
  msg: MessageTypes['JSON']
}>()

const parsedMsg = computed(() => JSON.parse(msg.data.data) as JsonInnerMsg)

const openInBrowser = (meta: { jumpUrl: string | URL | undefined }) => {
  if (meta.jumpUrl) window.open(meta.jumpUrl, '_blank')
}

const getIconUrl = (meta: { source_icon: string; icon: string }) => {
  let icon = ''
  if (meta.source_icon) icon = meta.source_icon
  else if (meta.icon) icon = meta.icon
  const { protocol } = new URL(icon)
  return 'k-web-img:' + icon.slice(protocol.length)
}

const getPreviewUrl = (meta: { preview: string }) => {
  if (meta.preview)
    try {
      const { protocol } = new URL(meta.preview)
      return 'k-web-img:' + meta.preview.slice(protocol.length)
    } catch (error) {
      return `k-web-img://${meta.preview}`
    }
  else return ''
}

enum JsonMsgTypes {
  Annouce = 'mannounce',
  Miniapp = 'miniapp',
  Location = 'location'
}

const checkType = (msg: JsonInnerMsg, key: string | number) => {
  if (key === JsonMsgTypes.Annouce) return JsonMsgTypes.Annouce
  else if (msg.app.startsWith('com.tencent.miniapp') && key !== 'miniapp')
    return JsonMsgTypes.Miniapp
  else if (msg.view === 'LocationShare') return JsonMsgTypes.Location
  else return ''
}
</script>

<template>
  <div v-for="(value, key) in parsedMsg.meta" :key="key">
    <AnnounceMsg v-if="checkType(parsedMsg, key) === JsonMsgTypes.Annouce" :msg="value" />
    <MiniAppMsg v-else-if="checkType(parsedMsg, key) === JsonMsgTypes.Miniapp" :msg="value" />
    <LocationMsg v-else-if="checkType(parsedMsg, key) === JsonMsgTypes.Location" :msg="value" />
    <div v-else class="w-80 share-msg-card glassmorphism p-sm" @click="openInBrowser(value)">
      <div class="flex justify-start items-center gap-2">
        <MsgImage class="w-15 h-15 object-cover" :src="getPreviewUrl(value)" :skeleton-size="15" />
        <div class="flex flex-col justify-start items-start gap-1">
          <span class="font-bold text-sm dark-gray-text">{{ value.title }}</span>
          <span class="text-xs gray-text">{{ value.desc }}</span>
        </div>
      </div>
      <div class="divider" />
      <div class="flex justify-start items-center gap-1">
        <img
          v-if="value.icon || value.source_icon"
          class="w-4 h-4 rd-0.5"
          :src="getIconUrl(value)"
          crossorigin="anonymous"
        />
        <span class="text-xs gray-text">{{ value.tag ?? value.title }}</span>
      </div>
    </div>
  </div>
</template>
