<script setup lang="ts">
import { computed, inject, nextTick, onMounted, useTemplateRef, watch } from 'vue'

import { DataManager } from '@renderer/functions/data_manager'
import { AnyMessage, GroupMessage, PrivateMessage } from '@renderer/functions/message/message_types'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { GroupMsgChainNode, PrivateMsgChainNode } from '@renderer/functions/types'

import MsgCard from '../message/MsgCard.vue'
import UserAvatar from '../message/basic/UserAvatar.vue'

const runtimeData = inject('runtimeData') as DataManager

const props = defineProps<{
  chatInfo: {
    type: 'friend' | 'group'
    id: number
  } | null
}>()
const msgHistoryList = runtimeData.renderingMsgs
const msgPanel = useTemplateRef('msgPanel')

// 将历史消息转为消息链
const parsedMsgChain = computed(() => {
  if (props.chatInfo?.type === 'friend') {
    const msgChain: PrivateMsgChainNode[] = []
    let curIndex = -1
    for (const msg of msgHistoryList.value) {
      if (msgChain[curIndex] && checkSameDay(msgChain[curIndex].time, msg.time)) {
        const lastMsgIndex = msgChain[curIndex].messages.length - 1
        if (
          lastMsgIndex !== -1 &&
          msgChain[curIndex].messages[lastMsgIndex].sender.user_id === msg.sender.user_id
        ) {
          msgChain[curIndex].messages[lastMsgIndex].data.push(msg as PrivateMessage<AnyMessage>)
        } else {
          msgChain[curIndex].messages.push({
            sender: msg.sender,
            data: [msg as PrivateMessage<AnyMessage>]
          })
        }
      } else {
        curIndex++
        msgChain[curIndex] = {
          type: 'private',
          // 本地时间当天00:00
          time: new Date(msg.time * 1000).setHours(0, 0, 0, 0) / 1000,
          messages: [
            {
              sender: msg.sender,
              data: [msg as PrivateMessage<AnyMessage>]
            }
          ]
        }
      }
    }
    return msgChain
  } else if (props.chatInfo?.type === 'group') {
    const msgChain: GroupMsgChainNode[] = []
    let curIndex = -1
    for (const msg of msgHistoryList.value) {
      if (msgChain[curIndex] && checkSameDay(msgChain[curIndex].time, msg.time)) {
        const lastMsgIndex = msgChain[curIndex].messages.length - 1
        if (
          lastMsgIndex !== -1 &&
          msgChain[curIndex].messages[lastMsgIndex].sender.user_id === msg.sender.user_id
        ) {
          msgChain[curIndex].messages[lastMsgIndex].data.push(msg as GroupMessage<AnyMessage>)
        } else {
          msgChain[curIndex].messages.push({
            sender: (msg as GroupMessage<AnyMessage>).sender,
            data: [msg as GroupMessage<AnyMessage>]
          })
        }
      } else {
        curIndex++
        msgChain[curIndex] = {
          type: 'group',
          // 本地时间当天00:00
          time: new Date(msg.time * 1000).setHours(0, 0, 0, 0) / 1000,
          messages: [
            {
              sender: (msg as GroupMessage<AnyMessage>).sender,
              data: [msg as GroupMessage<AnyMessage>]
            }
          ]
        }
      }
    }
    return msgChain
  } else return []
})

const checkSenderSelf = (node) => {
  const senderId = node.sender.user_id
  return senderId === runtimeData.userInfo.value.main.user_id
}

const checkSameDay = (time1: number, time2: number) => {
  const date1 = new Date(time1 * 1000)
  const date2 = new Date(time2 * 1000)
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const formateDay = (time: number) => {
  const date = new Date(time * 1000)
  // 在本年内显示月日，否则显示年月日
  if (date.getFullYear() === new Date().getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  } else {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }
}

const getSenderName = (node: PrivateMsgChainNode | GroupMsgChainNode, index: number) => {
  if (node.type === 'private') {
    return ''
  } else if (node.type === 'group') {
    return !node.messages[index].sender?.card || node.messages[index].sender.card === ''
      ? node.messages[index].sender.nickname
      : node.messages[index].sender.card
  } else return ''
}

const getPosition = (
  node: PrivateMessage<AnyMessage>[] | GroupMessage<AnyMessage>[],
  index: number
) => {
  if (node.length === 1) {
    return 'single'
  } else if (index === 0) {
    return 'start'
  } else if (index === node.length - 1) {
    return 'end'
  } else {
    return 'mid'
  }
}

const updateMsgHistory = async (append: boolean = false, count: number = 30) => {
  const _count = !append ? count : msgHistoryList.value.length + count
  if (props.chatInfo?.type === 'friend') {
    msgHistoryList.value = (
      await packagedGetter.getMsg.friend(props.chatInfo.id, _count)
    ).data.messages
  } else if (props.chatInfo?.type === 'group') {
    msgHistoryList.value = (
      await packagedGetter.getMsg.group(props.chatInfo.id, _count)
    ).data.messages
  }
}

// 在滚动到顶部时，加载更多消息
const handleScroll = async (e: Event) => {
  const element = e.target as HTMLElement
  if (element.scrollTop < 100) {
    const heightBefore = element.scrollHeight
    await updateMsgHistory(true)
    await nextTick(() => {
      element.scrollTop = element.scrollHeight - heightBefore
    })
  }
}

const updateComponent = async () => {
  if (props.chatInfo) {
    await updateMsgHistory()
    await nextTick(() => {
      if (msgPanel.value) {
        msgPanel.value.scrollTop = msgPanel.value.scrollHeight
      }
    })
  }
}

onMounted(updateComponent)
watch(props, updateComponent)

// 高度更新时，若原本在底部，则滚动到底部
watch(
  () => msgPanel.value?.scrollHeight,
  () => {
    if (msgPanel.value) {
      msgPanel.value.scrollTop = msgPanel.value.scrollHeight
    }
  }
)
</script>

<template>
  <div
    ref="msgPanel"
    class="msg-panel scrollbar scrollbar-w-1 scrollbar-rounded pl-sm pr-sm"
    @scroll="handleScroll"
  >
    <div v-if="msgHistoryList.length > 0">
      <div v-for="(msgChainDate, indexDate) in parsedMsgChain" :key="indexDate" class="w-full">
        <div class="w-full flex flex-row justify-center items-center">
          <Tag class="format-day" rounded :value="formateDay(msgChainDate.time)" />
        </div>
        <div v-for="(msgChainNode, index) in msgChainDate.messages" :key="index">
          <div
            class="flex flex-row items-end mb-sm"
            :class="checkSenderSelf(msgChainNode) ? 'justify-end' : 'justify-start'"
          >
            <UserAvatar v-if="!checkSenderSelf(msgChainNode)" :id="msgChainNode.sender.user_id" />
            <div
              class="flex flex-col justify-end gap-1"
              :class="checkSenderSelf(msgChainNode) ? 'items-end' : 'items-start'"
            >
              <div class="text-gray-500 text-xs">{{ getSenderName(msgChainDate, index) }}</div>
              <div v-for="(msg, msgIndex) in msgChainNode.data" :key="msgIndex">
                <MsgCard
                  :reverse="checkSenderSelf(msgChainNode)"
                  :position="getPosition(msgChainNode.data, msgIndex)"
                  :message="msg"
                />
              </div>
            </div>
            <UserAvatar
              v-if="checkSenderSelf(msgChainNode)"
              :id="msgChainNode.sender.user_id"
              position="right"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.msg-panel {
  width: 100%;
  height: calc(100vh - 10.35rem);

  background-color: rgba(243, 244, 246, 0.55);
}

.dark-mode .msg-panel {
  background-color: rgba(32, 41, 55, 0.65);
}

.format-day {
  background-color: var(--p-slate-400);
  opacity: 0.6;
  color: var(--p-gray-900);
  font-weight: 600;
  font-size: 0.9rem;
}
</style>
