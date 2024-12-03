<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import { Chat } from '@renderer/functions/types'
import TextShortMsg from '../message/basic/TextShortMsg.vue'

const menu = useTemplateRef('menu')

const { chat } = defineProps<{ chat: Chat; selected: boolean }>()
const emit = defineEmits<{
  pinChat: []
}>()

const menuItems = computed(() => [
  {
    label: chat.pinned ? '取消置顶' : '置顶聊天',
    icon: chat.pinned ? 'i-fluent-pin-off-24-regular' : 'i-fluent-pin-24-regular',
    command: () => {
      emit('pinChat')
    }
  }
])

const getAvatarUrl = computed(() => {
  if (chat.type === 'friend') {
    return `https://q1.qlogo.cn/g?b=qq&s=0&nk=${chat.data.user_id}`
  } else {
    return `https://p.qlogo.cn/gh/${chat.data.group_id}/${chat.data.group_id}/640`
  }
})

const getName = computed(() => {
  if (chat.type === 'friend') {
    return chat.data.remark === '' ? chat.data.nickname : chat.data.remark
  } else {
    return chat.data.group_name
  }
})

const parseTime = (time: number | undefined) => {
  if (!time) return chat?.latestMsg
  const date = new Date(time * 1000)
  const currentTime = new Date()

  // 如果时间在当天内，则显示时分
  if (
    date.getFullYear() === currentTime.getFullYear() &&
    date.getMonth() === currentTime.getMonth() &&
    date.getDate() === currentTime.getDate()
  ) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  // 如果时间在昨天内，则显示昨天和时分
  if (
    date.getFullYear() === currentTime.getFullYear() &&
    date.getMonth() === currentTime.getMonth() &&
    date.getDate() === currentTime.getDate() - 1
  ) {
    return `昨天`
  }

  // 若在本周内，则显示周几
  if (
    date.getFullYear() === currentTime.getFullYear() &&
    date.getMonth() === currentTime.getMonth() &&
    date.getDate() >= currentTime.getDate() - 7
  ) {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return weekDays[date.getDay()]
  }

  // 否则显示 YY/MM/DD 年月日皆为两位且需补零
  const year = date.getFullYear().toString().slice(2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}/${month}/${day}`
}
</script>

<template>
  <div
    v-ripple
    :class="{ selected: selected, pinned: chat.pinned }"
    class="glassmorphism p-2 chat-card"
    @contextmenu="(event) => menu?.toggle(event)"
  >
    <div class="w-full flex justify-start items-center gap-2">
      <img :src="getAvatarUrl" class="h-10 w-10 rounded-full" crossorigin="anonymous" />
      <div class="w-full flex flex-col justify-center items-start gap-0.3">
        <div class="w-45.5 flex justify-between items-center gap-2">
          <div class="chat-name text-sm truncate">
            <i
              class="chat-name w-4.2 h-4.2 align-mid pi"
              :class="
                chat.type === 'friend'
                  ? 'i-fluent-chat-24-regular'
                  : 'i-fluent-chat-multiple-24-regular'
              "
            />
            {{ getName }}
          </div>
          <div :class="{ 'text-gray-500': !selected }" class="text-xs whitespace-nowrap">
            {{ parseTime(chat?.latestMsg?.time) }}
          </div>
        </div>
        <div class="w-45.5 flex justify-between items-center gap-2">
          <div :class="{ 'short-msg': !selected }" class="text-sm truncate">
            <Suspense>
              <TextShortMsg :msg="chat.latestMsg" />
            </Suspense>
          </div>
          <div class="w-5 dark-gray-text">
            <i v-if="chat.pinned" class="w-4 h-4 align-mid pi i-fluent-pin-24-regular" />
          </div>
        </div>
      </div>
    </div>
    <ContextMenu ref="menu" :model="menuItems" />
  </div>
</template>

<style scoped>
.chat-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  user-select: none;
  -webkit-user-select: none;
}

.chat-card:hover {
  background-color: var(--p-gray-100);
}

.dark-mode .chat-card:hover {
  background-color: var(--p-gray-700);
}

.chat-card.pinned {
  backdrop-filter: brightness(0.7);
}

.chat-card.selected {
  background-color: var(--p-primary-500);
  border-color: var(--p-primary-500);
  color: white;
}

.chat-card.selected:hover {
  background-color: var(--p-primary-400);
  border-color: var(--p-primary-400);
  color: white;
}

.dark-mode .chat-name {
  color: white;
}

.short-msg {
  color: var(--p-gray-500);
}

.dark-mode .short-msg {
  color: var(--p-gray-400);
}
</style>
