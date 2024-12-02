<script setup lang="ts">
import debounce from 'lodash.debounce'
import { computed, inject, Ref, ref, watch } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import { findFromFaceMap } from '@renderer/functions/face_map'
import {
  AnyMessage,
  GroupMessage,
  MessageTypes,
  PrivateMessage,
  SendingMessage
} from '@renderer/functions/message/message_types'
import { packagedGetter, packagedSender } from '@renderer/functions/packaged_api'
import FaceSelect from './sender/FaceSelect.vue'
import MsgPreview from './sender/MsgPreview.vue'
import Attachments from './sender/Attachments.vue'

const runtimeData = inject('runtimeData') as DataManager
const sendText = inject('sendText') as Ref<string>

const { chatInfo } = defineProps<{
  chatInfo: {
    type: 'friend' | 'group'
    id: number
  } | null
}>()

const handler = {
  image: {
    judge: (text: string) => text.startsWith('I:A:'),
    parse: (attachId: string): MessageTypes['SendingImage'] => {
      const url = attachments.value[parseInt(attachId.slice(4))]
      return {
        type: 'image',
        data: { file: url }
      }
    }
  },
  reply: {
    judge: (text: string) => text.startsWith('R:'),
    parse: (id: string): MessageTypes['Reply'] => {
      return {
        type: 'reply',
        data: { id: parseInt(id.slice(2)) }
      }
    }
  },
  at: {
    judge: (text: string) => text.startsWith('@'),
    parse: (id: string): MessageTypes['At'] => {
      return {
        type: 'at',
        data: { qq: id.slice(1) }
      }
    }
  },
  face: {
    judge: (text: string) => findFromFaceMap(text) !== undefined,
    parse: (face: string): MessageTypes['QQFace'] => {
      return {
        type: 'face',
        data: { id: parseInt(findFromFaceMap(face)!) }
      }
    }
  },
  rps: {
    judge: (text: string) => text === 'rps',
    parse: (): MessageTypes['Rps'] => {
      return {
        type: 'rps',
        data: {}
      }
    }
  },
  dice: {
    judge: (text: string) => text === 'dice',
    parse: (): MessageTypes['Dice'] => {
      return {
        type: 'dice',
        data: {}
      }
    }
  },
  text: {
    judge: (_text: string) => true,
    parse: (text: string): MessageTypes['Text'] => {
      return {
        type: 'text',
        data: { text }
      }
    }
  }
}

const renderMsgs = ref<SendingMessage>()
const attachments = ref<string[]>([])

const invalid = computed(() => sendText.value.length === 0)

const watchKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && e.ctrlKey) sendMsg()
}

const parseSender = () => {
  if (!chatInfo) return

  const parser: AnyMessage[] = []

  // Read until '[/'
  let i = 0
  let start = 0
  while (i < sendText.value.length) {
    if (sendText.value[i] === '[' && sendText.value[i + 1] === '/') {
      if (i !== start) {
        parser.push({
          type: 'text',
          data: { text: sendText.value.slice(start, i) }
        })
      }
      start = i
      // match '[/xxx]'
      let msg: AnyMessage

      while (i < sendText.value.length && sendText.value[i] !== ']') {
        i++
        // if meets another '[/'
        if (sendText.value[i] === '[' && sendText.value[i + 1] === '/') {
          parser.push(handler.text.parse(sendText.value.slice(start, i)))
          start = i
          continue
        }
      }
      if (i >= sendText.value.length) break

      const matchVal = sendText.value.slice(start + 2, i)

      for (const key in handler) {
        if (handler[key].judge(matchVal)) {
          msg = handler[key].parse(matchVal)
          break
        }
      }

      parser.push(msg!)
      start = i + 1
    }
    i++
  }

  if (start !== i) {
    parser.push({
      type: 'text',
      data: { text: sendText.value.slice(start, i) }
    })
  }

  const res = {
    type: chatInfo.type === 'friend' ? 'private' : 'group',
    id: chatInfo.id,
    messages: parser
  } as SendingMessage
  return res
}

const sendMsg = async () => {
  if (!chatInfo) return
  const sender = parseSender()
  if (!sender) return

  // Send
  const msgId = (await packagedSender.msg.send(sender)).data.message_id

  // Update rendering
  let msg: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>

  if (chatInfo.type === 'friend') {
    msg = (await packagedGetter.getMsg.single(msgId)).data as PrivateMessage<AnyMessage>
    ;(runtimeData.renderingMsgs.value as PrivateMessage<AnyMessage>[]).push(msg)
  } else {
    msg = (await packagedGetter.getMsg.single(msgId)).data as GroupMessage<AnyMessage>
    ;(runtimeData.renderingMsgs.value as GroupMessage<AnyMessage>[]).push(msg)
  }

  const chat = runtimeData.curContacts.showing.find((c) => {
    if (c.type !== chatInfo?.type) return false
    if (c.type === 'friend') return c.data.user_id === chatInfo?.id
    else if (c.type === 'group') return c.data.group_id === chatInfo?.id
    return false
  })

  if (chat) chat.latestMsg = msg

  sendText.value = ''
}

const update = debounce(() => {
  renderMsgs.value = parseSender()
}, 600)

watch(sendText, update)
</script>

<template>
  <div class="w-full h-12 p-1 flex justify-between items-end gap-1">
    <Attachments v-model="attachments" />
    <InputText
      v-model="sendText"
      class="flex-1 h-10 scrollbar scrollbar-w-1 scrollbar-rounded"
      @keydown="watchKeydown"
    />
    <FaceSelect />
    <Button
      icon="i-fluent-send-24-regular w-5 h-5"
      text
      rounded
      :severity="invalid ? 'danger' : 'primary'"
      :disabled="invalid"
      @click="sendMsg"
    />
    <div v-if="sendText !== ''" class="msg-preview flex flex-col items-end gap-1">
      <div class="gray-text text-xs">消息预览</div>
      <div class="max-w-100">
        <MsgPreview :msg="renderMsgs" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.msg-preview {
  position: fixed;
  right: 0.5rem;
  bottom: 3.5rem;
  z-index: 100;

  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  background-color: var(--p-primary-200);
}

.dark-mode .msg-preview {
  background-color: var(--p-primary-500);
  color: var(--p-gray-100);
}
</style>
