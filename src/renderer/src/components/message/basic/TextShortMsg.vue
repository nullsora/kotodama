<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import { AnyMessage, GroupMessage, PrivateMessage } from '@renderer/functions/message/message_types'
import { getSenderName, msgListToShortMsg } from '@renderer/functions/message/parse_msg'

const runtimeData = inject('runtimeData') as DataManager

const { msg } = defineProps<{ msg?: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage> }>()

const name = computed(() => (msg ? getSenderName(msg) : ''))

const shortMsg = ref('')

const getMsgContent = async () => {
  const sender = name.value
  const prefix = sender === '' ? '' : sender + ': '

  if (msg?.message.length === 0)
    return `${
      msg.sender.user_id === runtimeData.userInfo.value.main.user_id ? '你' : sender + ' '
    }撤回了一条消息`

  let showMsg = ''
  if (msg?.message) showMsg = (await msgListToShortMsg(msg)) ?? ''

  return `${prefix}${showMsg}`
}

const updateShortMsg = async () => {
  shortMsg.value = await getMsgContent()
}

await updateShortMsg()

onMounted(updateShortMsg)
watch(() => msg, updateShortMsg)
</script>

<template>
  <span>{{ shortMsg }}</span>
</template>
