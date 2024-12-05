<script setup lang="ts">
import { computed, inject, nextTick, onMounted, useTemplateRef, watch } from 'vue'

import { DataManager } from '@renderer/functions/data_manager'
import { AnyMessage, GroupMessage, PrivateMessage } from '@renderer/functions/message/message_types'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { getSenderName as _getName } from '@renderer/functions/message/parse_msg'
import { GroupMsgChainNode, PrivateMsgChainNode } from '@renderer/functions/types'

import MsgCard from '../message/MsgCard.vue'
import UserAvatar from '../message/basic/UserAvatar.vue'
import SpecialTitle from '../message/basic/SpecialTitle.vue'

const runtimeData = inject('runtimeData') as DataManager

const { chatInfo } = defineProps<{
  chatInfo: {
    type: 'friend' | 'group'
    id: number
  } | null
}>()
const msgHistoryList = runtimeData.renderingMsgs
const msgPanel = useTemplateRef('msgPanel')

// 将历史消息转为消息链
const parsedMsgChain = computed(() => {
  if (chatInfo?.type === 'friend') {
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
  } else if (chatInfo?.type === 'group') {
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

const checkSenderSelf = (node: { sender: { user_id: unknown } }) => {
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
    return _getName({ message_type: 'group', sender: node.messages[index].sender })
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
  const countBefore = msgHistoryList.value.length
  const _count = !append ? count : countBefore + count
  if (chatInfo?.type === 'friend') {
    msgHistoryList.value = (await packagedGetter.getMsg.friend(chatInfo.id, _count)).data.messages
  } else if (chatInfo?.type === 'group') {
    msgHistoryList.value = (await packagedGetter.getMsg.group(chatInfo.id, _count)).data.messages
  }
  return msgHistoryList.value.length - countBefore
}

// 在滚动到顶部时，加载更多消息
const handleScroll = async (e: Event) => {
  const element = e.target as HTMLElement
  if (element.scrollTop < 100) {
    const heightBefore = element.scrollHeight
    const c = await updateMsgHistory(true)
    if (c === 30)
      await nextTick(() => {
        element.scrollTop = element.scrollHeight - heightBefore
      })
  }
}

const updateComponent = async () => {
  if (chatInfo) {
    await updateMsgHistory()
    await nextTick(() => {
      if (msgPanel.value) {
        msgPanel.value.scrollTop = msgPanel.value.scrollHeight
      }
    })
  }
}

onMounted(updateComponent)
watch(() => chatInfo, updateComponent)
</script>

<template>
  <div
    ref="msgPanel"
    class="msg-panel scrollbar scrollbar-w-1 scrollbar-rounded pl-sm pr-sm"
    @scroll="handleScroll"
  >
    <div v-if="msgHistoryList.length > 0">
      <div v-for="(msgChainNode, indexDate) in parsedMsgChain" :key="indexDate" class="w-full">
        <div class="w-full flex justify-center items-center">
          <Tag class="format-day m-sm select-none" rounded :value="formateDay(msgChainNode.time)" />
        </div>
        <div v-for="(msgSingleNode, index) in msgChainNode.messages" :key="index">
          <div
            class="flex items-end mb-sm"
            :class="checkSenderSelf(msgSingleNode) ? 'justify-end' : 'justify-start'"
          >
            <UserAvatar
              v-if="!checkSenderSelf(msgSingleNode)"
              :id="msgSingleNode.sender.user_id"
              :type="chatInfo?.type"
            />
            <div
              class="flex flex-col justify-end gap-1"
              :class="checkSenderSelf(msgSingleNode) ? 'items-end' : 'items-start'"
            >
              <div class="flex items-center gap-1">
                <div class="text-gray-500 text-xs">{{ getSenderName(msgChainNode, index) }}</div>
                <SpecialTitle
                  v-if="msgChainNode.type === 'group'"
                  :role="msgChainNode.messages[index].sender.role"
                  :title="msgChainNode.messages[index].sender.title"
                />
              </div>
              <div v-for="(msg, msgIndex) in msgSingleNode.data" :key="msgIndex">
                <MsgCard
                  :reverse="checkSenderSelf(msgSingleNode)"
                  :position="getPosition(msgSingleNode.data, msgIndex)"
                  :full-msg="msg"
                />
              </div>
            </div>
            <UserAvatar
              v-if="checkSenderSelf(msgSingleNode)"
              :id="msgSingleNode.sender.user_id"
              :type="chatInfo?.type"
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
