<script setup lang="ts">
import AtMsg from '@renderer/components/message/AtMsg.vue'
import FaceMsg from '@renderer/components/message/FaceMsg.vue'
import ReplyMsg from '@renderer/components/message/ReplyMsg.vue'
import { SendingMessage } from '@renderer/functions/message/message_types'
import { computed, h, VNode } from 'vue'

const { msg } = defineProps<{
  msg?: SendingMessage
}>()

const renderer = computed(() => {
  if (!msg) return h('span', '')
  const res: VNode[] = []
  for (const message of msg.messages) {
    switch (message.type) {
      case 'text':
        res.push(
          h(
            'span',
            { class: 'text-sm whitespace-pre-wrap max-w-100 break-words' },
            message.data.text
          )
        )
        break
      case 'at':
        res.push(
          h(AtMsg, {
            msg: message,
            sendGroupId: msg.type === 'group' ? msg.id : undefined
          })
        )
        break
      case 'reply':
        res.push(h(ReplyMsg, { msg: message }))
        break
      case 'face':
        res.push(h(FaceMsg, { msg: message }))
        break
      case 'image':
        res.push(
          h(
            'span',
            {
              class: 'text-sm primary-text'
            },
            '[图片]'
          )
        )
        break
      case 'file':
        res.push(
          h(
            'span',
            {
              class: 'text-sm primary-text'
            },
            '[文件]'
          )
        )
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
</script>

<template>
  <renderer />
</template>
