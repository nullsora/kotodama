<script setup lang="ts">
import AtMsg from '@renderer/components/message/AtMsg.vue'
import MsgImage from '@renderer/components/message/basic/MsgImage.vue'
import FaceMsg from '@renderer/components/message/FaceMsg.vue'
import ReplyMsg from '@renderer/components/message/ReplyMsg.vue'
import { checkImgFace } from '@renderer/functions/message/check_img_face'
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
        if (checkImgFace(message)) {
          res.push(
            h(MsgImage, { src: message.data.file, class: 'max-w-20 max-h-20', showMenu: false })
          )
        } else {
          res.push(
            h(MsgImage, { src: message.data.file, class: 'max-w-40 max-h-40', showMenu: false })
          )
        }
        break
      case 'video':
        res.push(
          h(
            'span',
            {
              class: 'text-sm primary-text'
            },
            '[视频]'
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
