<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import {
  AnyMessage,
  GroupMessage,
  MessageTypes,
  PrivateMessage
} from '@renderer/functions/message/message_types'
import { msgListToShortMsg } from '@renderer/functions/message/parse_msg'
import { packagedGetter } from '@renderer/functions/packaged_api'
import MsgImage from './basic/MsgImage.vue'

const { msg } = defineProps<{
  msg: MessageTypes['Reply']
}>()

const originalMsg = ref<PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>>()
const renderShortMsg = ref('')

const getOringinalMsg = async () => {
  const oriId = msg.data.id
  const oriMsg = await packagedGetter.getMsg.single(oriId)
  originalMsg.value = oriMsg.data
  renderShortMsg.value = (await msgListToShortMsg(oriMsg.data)) ?? '[引用消息不存在]'
}

const onlyImage = computed(() => {
  return originalMsg.value?.message.length === 1 && originalMsg.value?.message[0].type === 'image'
})

const getName = computed(() => {
  if (originalMsg.value?.message_type === 'private') {
    return originalMsg.value.sender.nickname
  } else if (originalMsg.value?.message_type === 'group') {
    return originalMsg.value.sender.card === ''
      ? originalMsg.value.sender.nickname
      : originalMsg.value.sender.card
  } else return '[解析错误]'
})

onMounted(getOringinalMsg)
watch(() => msg, getOringinalMsg)
</script>

<template>
  <div class="flex flex-col justify-start gap-2 items-start reply-msg">
    <div class="reply-msg-sender text-xs font-bold">{{ getName }}</div>
    <div v-if="onlyImage" class="flex flex-row justify-start gap-2 items-center">
      <Suspense>
        <MsgImage
          class="max-w-50 max-h-50"
          :src="(originalMsg?.message[0] as MessageTypes['Image']).data.url"
          :show-menu="false"
          :skeleton-size="50"
        />
      </Suspense>
    </div>
    <div v-else class="text-xs msg-content max-w-90">
      {{ renderShortMsg }}
    </div>
  </div>
</template>

<style scoped>
.reply-msg {
  border-left: 0.2rem solid var(--p-primary-500);
  border-radius: 0.5rem;
  background-color: var(--p-primary-100);
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.dark-mode .reply-msg {
  background-color: var(--p-primary-900);
  border-left-color: var(--p-primary-500);
}

.reply-msg-sender {
  color: var(--p-primary-500);
}

.msg-content {
  color: var(--p-gray-500);

  max-height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark-mode .msg-content {
  color: var(--p-gray-100);
}
</style>
