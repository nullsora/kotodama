<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import {
  AnyMessage,
  GroupMessage,
  PrivateMessage,
  SendingMessage
} from '@renderer/functions/message/message_types'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { Friend, Group } from '@renderer/functions/types'

const runtimeData = inject('runtimeData') as DataManager

const props = defineProps<{
  chatInfo: {
    type: 'friend' | 'group'
    id: number
  } | null
}>()

const sendText = ref('')

const invalid = computed(() => sendText.value.length === 0)

const watchKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && e.ctrlKey) sendMsg()
}

const sendMsg = async () => {
  if (!props.chatInfo) return
  if (sendText.value.length === 0) return

  const sender: SendingMessage = {
    type: props.chatInfo.type === 'friend' ? 'private' : 'group',
    id: props.chatInfo.id,
    messages: [
      {
        type: 'text',
        data: {
          text: sendText.value
        }
      }
    ]
  }
  const msgId = (await packagedGetter.sendMessage(sender)).data.message_id

  let msg: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>

  if (props.chatInfo.type === 'friend') {
    msg = (await packagedGetter.getMsg(msgId)).data as PrivateMessage<AnyMessage>
    ;(runtimeData.renderingMsgs.value as PrivateMessage<AnyMessage>[]).push(msg)
  } else {
    msg = (await packagedGetter.getMsg(msgId)).data as GroupMessage<AnyMessage>
    ;(runtimeData.renderingMsgs.value as GroupMessage<AnyMessage>[]).push(msg)
  }

  const chat = runtimeData.user.value.contacts.showing.find((c) => {
    if (c.type !== (props.chatInfo?.type === 'friend' ? 'private' : 'group')) return false
    if (c.type === 'private') return (c.data as Friend).user_id === props.chatInfo?.id
    else if (c.type === 'group') return (c.data as Group).group_id === props.chatInfo?.id
    return false
  })

  if (chat) chat.latestMsg = msg

  sendText.value = ''
}
</script>

<template>
  <div class="w-full h-12 p-1 flex flex-row justify-between items-end gap-1">
    <Button icon="i-fluent-add-circle-24-regular w-5 h-5" severity="secondary" text />
    <InputText
      v-model="sendText"
      class="w-4/5 h-10 scrollbar scrollbar-w-1 scrollbar-rounded"
      @keydown="watchKeydown"
    />
    <Button icon="i-fluent-emoji-24-regular w-5 h-5" severity="secondary" text />
    <Button
      icon="i-fluent-send-24-regular w-5 h-5"
      text
      :severity="invalid ? 'danger' : 'primary'"
      :disabled="invalid"
      @click="sendMsg"
    />
  </div>
</template>
