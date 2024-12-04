<script setup lang="ts">
import { AnyMessage, GroupMessage, PrivateMessage } from '@renderer/functions/message/message_types'
import { msgListToShortMsg } from '@renderer/functions/message/parse_msg'
import { useConfigStore } from '@renderer/stores/config_store'

import { computed, inject, Ref, ref, useTemplateRef } from 'vue'

import AtMsg from './AtMsg.vue'
import DiceMsg from './DiceMsg.vue'
import FaceMsg from './FaceMsg.vue'
import FileMsg from './FileMsg.vue'
import ForwardMsg from './ForwardMsg.vue'
import ImageMsg from './ImageMsg.vue'
import JsonMsg from './JsonMsg.vue'
import RecordMsg from './RecordMsg.vue'
import ReplyMsg from './ReplyMsg.vue'
import RpsMsg from './RpsMsg.vue'
import TextMsg from './TextMsg.vue'
import UnsupportedMsg from './UnsupportedMsg.vue'
import VideoMsg from './VideoMsg.vue'
import XMLMsg from './XMLMsg.vue'

import SendTime from './basic/SendTime.vue'
import ImageGallery from './special/ImageGallery.vue'
import MarkdownMsg from './MarkdownMsg.vue'

type ImageGalleryMsg = {
  type: 'gallery'
  images: string[]
}

const config = useConfigStore()
const sendText = inject('sendText') as Ref<string>

const menu = useTemplateRef('menu')

const {
  baseMsg,
  extra: extInfo,
  fullMsg,
  reverse = false,
  position = 'mid',
  showMenu = true
} = defineProps<
  | {
      baseMsg: AnyMessage[]
      extra: {
        message_type: 'friend' | 'group'
        time: number
        message_id?: number
        group_id?: number
      }
      fullMsg?: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>
      reverse?: boolean
      position?: 'start' | 'end' | 'mid' | 'single'
      showMenu?: boolean
    }
  | {
      baseMsg?: AnyMessage[]
      extra?: {
        message_type: 'friend' | 'group'
        time: number
        message_id?: number
        group_id?: number
      }
      fullMsg: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>
      reverse?: boolean
      position?: 'start' | 'end' | 'mid' | 'single'
      showMenu?: boolean
    }
>()

const hover = ref(false)
const menuItems = ref([
  {
    label: '复制',
    icon: 'i-fluent-copy-24-regular w-4 h-4',
    command: async () => {
      if (fullMsg) {
        const text = await msgListToShortMsg(fullMsg)
        if (text) navigator.clipboard.writeText(text)
      }
    }
  },
  {
    label: '引用',
    icon: 'i-fluent-comment-quote-24-regular w-4 h-4',
    command: () => {
      sendText.value = `[/R: ${extra.value.message_id}]${sendText.value}`
    }
  }
])

const msgComponents = {
  gallery: ImageGallery,
  text: TextMsg,
  image: ImageMsg,
  mface: ImageMsg,
  record: RecordMsg,
  video: VideoMsg,
  at: AtMsg,
  rps: RpsMsg,
  dice: DiceMsg,
  reply: ReplyMsg,
  forward: ForwardMsg,
  face: FaceMsg,
  xml: XMLMsg,
  json: JsonMsg,
  file: FileMsg,
  markdown: MarkdownMsg
}

const renderOnlyList = ['image', 'mface', 'rps', 'dice', 'json', 'video', 'forward']

const message = computed(() => {
  return baseMsg ?? fullMsg!.message
})

const extra = computed(() => {
  return extInfo ?? fullMsg!
})

const showSendTime = computed(() => {
  if (config.customSettings.message.alwaysShowTimestamp) return true
  return hover.value
})

const messageList = computed(() => {
  if (!config.customSettings.message.useImageGallery) return message.value

  const result: (AnyMessage | ImageGalleryMsg)[] = []
  let imgGallery: ImageGalleryMsg = { type: 'gallery', images: [] }
  let tempImgMsg: AnyMessage | null = null
  for (const msg of message.value) {
    if (msg.type === 'image') {
      imgGallery.images.push(msg.data.url)
      tempImgMsg = msg
    } else {
      if (imgGallery.images.length > 1) {
        result.push(imgGallery)
        imgGallery = { type: 'gallery', images: [] }
      } else if (tempImgMsg) {
        result.push(tempImgMsg)
        tempImgMsg = null
      }
      result.push(msg)
    }
  }
  if (imgGallery.images.length > 1) {
    result.push(imgGallery)
  } else if (tempImgMsg) {
    result.push(tempImgMsg)
  }

  if (result.length > 0 && result[0].type === 'markdown') {
    return [result[0]]
  }

  return result
})

const radius = computed(() => {
  if (!reverse) {
    if (position === 'start') {
      return 'rd-md rd-tl-4 rd-tr-4 rd-br-4'
    } else if (position === 'end') {
      return 'rd-md rd-bl-0 rd-tr-4 rd-br-4'
    } else if (position === 'single') {
      return 'rd-tl-4 rd-tr-4 rd-br-4'
    } else {
      return 'rd-md rd-tr-4 rd-br-4'
    }
  } else {
    if (position === 'start') {
      return 'rd-md rd-tl-4 rd-tr-4 rd-bl-4'
    } else if (position === 'end') {
      return 'rd-md rd-tl-4 rd-br-0 rd-bl-4'
    } else if (position === 'single') {
      return 'rd-tl-4 rd-tr-4 rd-bl-4'
    } else {
      return 'rd-md rd-tl-4 rd-bl-4'
    }
  }
})

const checkOnly = computed(() => {
  return message.value.length === 1 && renderOnlyList.includes(message.value[0].type)
})
</script>

<template>
  <div
    class="flex justify-start items-end gap-1"
    :class="{ lxgw: config.customSettings.message.useLxgw }"
    @contextmenu="
      (event) => {
        if (showMenu) menu?.toggle(event)
      }
    "
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <SendTime v-if="reverse && showSendTime" :time="extra.time" />
    <div v-if="checkOnly">
      <component :is="msgComponents[messageList[0].type]" :msg="messageList[0]" />
    </div>
    <div
      v-else
      :class="radius"
      :position="position + (reverse ? '-reverse' : '')"
      :reverse="reverse"
      class="msg-card msg-shadow max-w-100 p-2 pl-3 pr-3"
    >
      <span v-if="messageList.length === 0" class="select-none">
        <span class="text-sm text-red-400">[已撤回]</span>
      </span>
      <span v-for="(msg, index) in messageList" :key="index">
        <AtMsg
          v-if="msg.type === 'at'"
          :msg="msg"
          :send-group-id="extra.message_type === 'group' ? extra.group_id : undefined"
        />
        <component :is="msgComponents[msg.type] ?? UnsupportedMsg" v-else :msg="msg" />
      </span>
    </div>
    <SendTime v-if="!reverse && showSendTime" :time="extra.time" />
    <ContextMenu ref="menu" :model="menuItems" />
  </div>
</template>

<style scoped>
.msg-card {
  background-color: white;
  position: relative;
}

.msg-card[reverse='true'] {
  background-color: var(--p-primary-200);
}

.dark-mode .msg-card {
  background-color: var(--p-gray-700);
  color: var(--p-gray-100);
}

.dark-mode .msg-card[reverse='true'] {
  background-color: var(--p-primary-800);
  color: var(--p-gray-100);
}

.msg-shadow {
  box-shadow: rgba(180, 180, 180, 0.1) 0 0.1rem 0.1rem 0;
}

.dark-mode .msg-shadow {
  box-shadow: rgba(51, 51, 51, 0.1) 0 0.1rem 0.1rem 0;
}

.msg-card[position='end']::before,
.msg-card[position='single']::before {
  content: '';
  position: absolute;
  width: 0.7rem;
  height: 0.7rem;
  right: 100%;
  bottom: 0;
  background-color: white;
  mask: radial-gradient(circle at 0 0, transparent 70%, white 30%);
}

.dark-mode .msg-card[position='end']::before,
.dark-mode .msg-card[position='single']::before {
  background-color: var(--p-gray-700);
}

.msg-card[position='end-reverse']::before,
.msg-card[position='single-reverse']::before {
  content: '';
  position: absolute;
  width: 0.7rem;
  height: 0.7rem;
  left: 100%;
  bottom: 0;
  background-color: var(--p-primary-200);
  mask: radial-gradient(circle at 100% 0, transparent 70%, white 30%);
}

.dark-mode .msg-card[position='end-reverse']::before,
.dark-mode .msg-card[position='single-reverse']::before {
  background-color: var(--p-primary-800);
}

.send-arrow {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid white;
}
</style>
