<script setup lang="ts">
import {
  AnyMessage,
  ForwardMessageContent,
  MessageTypes
} from '@renderer/functions/message/message_types'
import { parseShortMsg } from '@renderer/functions/message/parse_msg'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { computed, onMounted, ref, watch } from 'vue'
import MsgCard from '../MsgCard.vue'
import UserAvatar from './UserAvatar.vue'

const { msg } = defineProps<{
  msg: MessageTypes['Forward']
}>()

const content = ref<ForwardMessageContent>()
const showContent = ref(false)
const renderShortMsg = ref<string[]>([])

const parsedMsgChain = computed(() => {
  if (!content.value) return []

  // 同一个人连续消息合并即可
  const msgChain: {
    sender: {
      user_id: number
      nickname: string
    }
    messages: {
      message: AnyMessage[]
      time: number
    }[]
  }[] = []

  let curIndex = -1
  for (const msg of content.value.messages) {
    if (msgChain[curIndex] && msgChain[curIndex].sender.user_id === msg.sender.user_id) {
      msgChain[curIndex].messages.push({
        message: msg.content,
        time: msg.time
      })
    } else {
      curIndex++
      msgChain[curIndex] = {
        sender: msg.sender,
        messages: [
          {
            message: msg.content,
            time: msg.time
          }
        ]
      }
    }
  }

  return msgChain
})

const parseMsg = async (msgList: AnyMessage[]) => {
  if (msgList.length === 0) return '[已撤回的消息]'
  let shortMsg = ''
  for (const msg of msgList) {
    shortMsg += await parseShortMsg(msg)
  }
  return shortMsg
}

const updateContent = async () => {
  content.value = (await packagedGetter.getMsg.forward(msg.data.id.toString())).data
  for (const item of content.value.messages.slice(0, 3)) {
    renderShortMsg.value.push(item.sender.nickname + ': ' + (await parseMsg(item.content)))
  }
}

const getPosition = (index: number, length: number) => {
  if (length === 1) return 'single'
  if (index === 0) return 'start'
  if (index === length - 1) return 'end'
  return 'mid'
}

onMounted(() => {
  updateContent()
})

watch(
  () => msg.data.id,
  () => {
    updateContent()
  }
)
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
                  :base-msg="messageData.message"
                  :extra="{
                    message_type:
                      content?.messages[0].message_type === 'group' ? 'group' : 'friend',
                    time: messageData.time
                  }"
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
