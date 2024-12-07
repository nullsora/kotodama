<script setup lang="ts">
import {
  AnyMessage,
  GroupMessage,
  MessageTypes,
  PrivateMessage
} from '@renderer/functions/message/message_types'
import { getSenderName, msgListToShortMsg } from '@renderer/functions/message/parse_msg'
import { computed, onMounted, ref, watch } from 'vue'
import MsgCard from '../MsgCard.vue'
import UserAvatar from './UserAvatar.vue'

const { msg } = defineProps<{
  msg: MessageTypes['Forward']
}>()

const showContent = ref(false)
const renderShortMsg = ref<string[]>([])

const parsedMsgChain = computed(() => {
  if (!msg.data.content) return []

  const msgChain: {
    sender: {
      user_id: number
      nickname: string
    }
    messages: (PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>)[]
  }[] = []

  let curIndex = -1
  for (const item of msg.data.content) {
    if (msgChain[curIndex] && msgChain[curIndex].sender.nickname === item.sender.nickname) {
      msgChain[curIndex].messages.push(item)
    } else {
      curIndex++
      const name = getSenderName(item)

      msgChain[curIndex] = {
        sender: {
          user_id: item.sender.user_id,
          nickname: name
        },
        messages: [item]
      }
    }
  }

  return msgChain
})

const updateContent = async () => {
  renderShortMsg.value = []
  for (const item of msg.data.content!.slice(0, 3)) {
    const name = getSenderName(item)
    renderShortMsg.value.push(name + ': ' + ((await msgListToShortMsg(item)) ?? ''))
  }
}

const getPosition = (index: number, length: number) => {
  if (length === 1) return 'single'
  if (index === 0) return 'start'
  if (index === length - 1) return 'end'
  return 'mid'
}

onMounted(updateContent)
watch(() => msg, updateContent)
</script>

<template>
  <div class="w-80 share-msg-card glassmorphism p-sm" @click="showContent = true">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-bold dark-gray-text">聊天记录</div>
      <div class="text-xs gray-text">
        <div v-for="(item, index) in renderShortMsg" :key="index" class="mt-1 short-msg">
          {{ item }}
        </div>
      </div>
    </div>
    <Dialog id="dialog" v-model:visible="showContent" modal class="w-3/5">
      <template #header>
        <div class="font-bold dark-gray-text">聊天记录</div>
      </template>
      <div class="scrollbar scrollbar-w-1 scrollbar-rounded content">
        <div v-for="(item, index) in parsedMsgChain" :key="index" class="mb-sm">
          <div class="flex items-end">
            <UserAvatar :id="item.sender.user_id" />
            <div class="flex flex-col justify-end gap-1">
              <div class="text-gray-500 text-xs">{{ item.sender.nickname }}</div>
              <div v-for="(messageData, i) in item.messages" :key="i">
                <MsgCard
                  :full-msg="messageData"
                  :show-menu="false"
                  :position="getPosition(i, item.messages.length)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.content {
  padding: 0.5rem;
  background-color: var(--p-gray-100);
  border-radius: 0.5rem;
  max-height: 60vh;
}

.dark-mode .content {
  background-color: var(--p-gray-900);
}

.short-msg {
  max-height: 2rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
