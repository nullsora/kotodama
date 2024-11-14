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

const props = defineProps<{
  message: GroupMessage<AnyMessage> | PrivateMessage<AnyMessage>
  reverse?: boolean
}>()

const messageList = computed(() => {
  return props.message.message
})

const onlyImage = computed(() => {
  return messageList.value.length === 1 && messageList.value[0].type === 'image'
})

const msgComponents = {
  text: TextMsg,
  image: ImageMsg,
  at: AtMsg,
  reply: ReplyMsg,
  face: FaceMsg,
  file: FileMsg
}
</script>

<template>
  <div class="flex flex-row justify-start items-end gap-1">
    <SendTime v-if="reverse" :time="message.time" />
    <div v-if="onlyImage">
      <component :is="msgComponents[messageList[0].type]" :msg="messageList[0]" />
    </div>
    <div v-else class="msg-card primary-border max-w-100 p-2 pl-3 pr-3">
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
}

.dark-mode .msg-card {
  background-color: var(--p-gray-700);
  color: var(--p-gray-100);
}
</style>
