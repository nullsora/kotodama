<script setup lang="ts">
import { AnyMessage, GroupMessage, PrivateMessage } from '@renderer/functions/message/message_types'
import { computed } from 'vue'
import SendTime from './basic/SendTime.vue'
import ImageMsg from './ImageMsg.vue'
import AtMsg from './AtMsg.vue'
import ReplyMsg from './ReplyMsg.vue'
import TextMsg from './TextMsg.vue'
import FaceMsg from './FaceMsg.vue'
import FileMsg from './FileMsg.vue'
import XMLMsg from './XMLMsg.vue'
import JsonMsg from './JsonMsg.vue'

const {
  message,
  reverse = false,
  position = 'mid'
} = defineProps<{
  message: GroupMessage<AnyMessage> | PrivateMessage<AnyMessage>
  reverse?: boolean
  position?: 'start' | 'end' | 'mid' | 'single'
}>()

const msgComponents = {
  text: TextMsg,
  image: ImageMsg,
  mface: ImageMsg,
  at: AtMsg,
  reply: ReplyMsg,
  face: FaceMsg,
  file: FileMsg,
  xml: XMLMsg,
  json: JsonMsg
}

const renderOnlyList = ['image', 'mface', 'json']

const messageList = computed(() => {
  return message.message
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
  return message.message.length === 1 && renderOnlyList.includes(message.message[0].type)
})
</script>

<template>
  <div class="flex flex-row justify-start items-end gap-1">
    <SendTime v-if="reverse" :time="message.time" />
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
        <component
          :is="msgComponents[msg.type] ?? 'span'"
          :send-group-id="
            message.message_type === 'group' && msg.type === 'at' ? message.group_id : undefined
          "
          :msg="msg"
        />
      </span>
    </div>
    <SendTime v-if="!reverse" :time="message.time" />
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
  background-color: var(--p-primary-600);
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
  background-color: var(--p-primary-600);
}

.send-arrow {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid white;
}
</style>
