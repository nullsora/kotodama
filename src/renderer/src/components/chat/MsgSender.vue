<script setup lang="ts">
import debounce from 'lodash.debounce'
import { computed, inject, Ref, VNode, h, ref, watch } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import { faceMap, findFromFaceMap } from '@renderer/functions/face_map'
import {
  AnyMessage,
  GroupMessage,
  MessageTypes,
  PrivateMessage,
  SendingMessage
} from '@renderer/functions/message/message_types'
import { packagedGetter, packagedSender } from '@renderer/functions/packaged_api'
import FaceSelect from './FaceSelect.vue'
import AtMsg from '../message/AtMsg.vue'
import FaceMsg from '../message/FaceMsg.vue'
import ReplyMsg from '../message/ReplyMsg.vue'

const runtimeData = inject('runtimeData') as DataManager
const sendText = inject('sendText') as Ref<string>

const { chatInfo } = defineProps<{
  chatInfo: {
    type: 'friend' | 'group'
    id: number
  } | null
}>()

const handler = {
  parse: {
    reply: (id: number): MessageTypes['Reply'] => {
      return {
        type: 'reply',
        data: { id }
      }
    },
    at: (id: string): MessageTypes['At'] => {
      return {
        type: 'at',
        data: { qq: id }
      }
    },
    face: (face: string): MessageTypes['QQFace'] => {
      return {
        type: 'face',
        data: { id: parseInt(face) }
      }
    },
    rps: (): MessageTypes['Rps'] => {
      return {
        type: 'rps',
        data: {}
      }
    },
    dice: (): MessageTypes['Dice'] => {
      return {
        type: 'dice',
        data: {}
      }
    },
    text: (text: string): MessageTypes['Text'] => {
      return {
        type: 'text',
        data: { text }
      }
    }
  }
}

const renderMsgs = ref<SendingMessage>()

const renderer = computed(() => {
  if (!renderMsgs.value) return h('span', '')
  const res: VNode[] = []
  for (const msg of renderMsgs.value.messages) {
    switch (msg.type) {
      case 'text':
        res.push(
          h('span', { class: 'text-sm whitespace-pre-wrap max-w-100 break-words' }, msg.data.text)
        )
        break
      case 'at':
        res.push(
          h(AtMsg, {
            msg,
            sendGroupId: chatInfo?.type === 'group' ? chatInfo.id : undefined
          })
        )
        break
      case 'reply':
        res.push(h(ReplyMsg, { msg }))
        break
      case 'face':
        res.push(h(FaceMsg, { msg }))
        break
      case 'rps':
        res.push(
          h('i', {
            class: 'pi i-fluent-emoji-raised-fist-light w-5 h-5 align-mid'
          })
        )
        break
      case 'dice':
        res.push(
          h('i', {
            class: 'pi i-fluent-emoji-game-die w-5 h-5 align-mid'
          })
        )
        break
    }
  }
  return () => res
})

const invalid = computed(() => sendText.value.length === 0)

const watchKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && e.ctrlKey) sendMsg()
}

const selectFace = (id: number | string) => {
  if (faceMap[id]) {
    sendText.value += `[/${faceMap[id]}]`
  } else {
    sendText.value += `[/${id}]`
  }
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
          parser.push(handler.parse.text(sendText.value.slice(start, i)))
          start = i
          continue
        }
      }
      if (i >= sendText.value.length) {
        parser.push(handler.parse.text(sendText.value.slice(start)))
        break
      }

      const matchVal = sendText.value.slice(start + 2, i)

      const magicFace = ['rps', 'dice']

      const face = findFromFaceMap(matchVal)
      if (matchVal.startsWith('R:')) {
        msg = handler.parse.reply(parseInt(matchVal.slice(2)))
      } else if (matchVal.startsWith('@')) {
        msg = handler.parse.at(matchVal.slice(1))
      } else if (face) {
        msg = handler.parse.face(face)
      } else if (magicFace.includes(matchVal)) {
        msg = handler.parse[matchVal as 'rps' | 'dice']()
      } else {
        msg = handler.parse.text(sendText.value.slice(start, i + 1))
      }

      parser.push(msg)
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

  return {
    type: chatInfo.type === 'friend' ? 'private' : 'group',
    id: chatInfo.id,
    messages: parser
  } as SendingMessage
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
  <div class="w-full h-12 p-1 flex flex-row justify-between items-end gap-1">
    <Button icon="i-fluent-add-circle-24-regular w-5 h-5" severity="secondary" text />
    <InputText
      v-model="sendText"
      class="w-4/5 h-10 scrollbar scrollbar-w-1 scrollbar-rounded"
      @keydown="watchKeydown"
    />
    <FaceSelect @select="selectFace" />
    <Button
      icon="i-fluent-send-24-regular w-5 h-5"
      text
      :severity="invalid ? 'danger' : 'primary'"
      :disabled="invalid"
      @click="sendMsg"
    />
    <div v-if="sendText !== ''" class="msg-preview flex flex-col items-end gap-1">
      <div class="gray-text text-xs">消息预览</div>
      <div class="max-w-100">
        <renderer />
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
