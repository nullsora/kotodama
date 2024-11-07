<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { AnyMessage, GroupMessage, PrivateMessage } from '@renderer/functions/message/message_types'
import { msgListToShortMsg } from '@renderer/functions/message/parse_msg'
import { DataManager } from '@renderer/functions/data_manager'

const runtimeData = inject('runtimeData') as DataManager

const props = defineProps<{ msg?: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage> }>()

const getName = computed(() => {
  if (props.msg?.message_type === 'private') {
    return props.msg.sender.nickname
  } else if (props.msg?.message_type === 'group') {
    return props.msg.sender.card === '' ? props.msg.sender.nickname : props.msg.sender.card
  } else return ''
})

const shortMsg = ref('')

const getMsgContent = async () => {
  const sender = getName.value

  if (props.msg?.message.length === 0)
    return `${
      props.msg.sender.user_id === runtimeData.userInfo.value.main.user_id ? '你' : sender + ' '
    }撤回了一条消息`

  let showMsg = ''
  if (props.msg?.message) showMsg = await msgListToShortMsg(props.msg)

  return `${sender}: ${showMsg}`
}

shortMsg.value = await getMsgContent()

onMounted(async () => {
  shortMsg.value = await getMsgContent()
})
watch(props, async () => {
  shortMsg.value = await getMsgContent()
})
</script>

<template>
  <span>{{ shortMsg }}</span>
</template>
