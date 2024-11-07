<script setup lang="ts">
import { computed } from 'vue'

import { Chat, Friend, Group } from '@renderer/functions/types'
import TextShortMsg from '../message/basic/TextShortMsg.vue'

const props = defineProps<{ chat: Chat; selected: boolean }>()

const getAvatarUrl = computed(() => {
  if (props.chat.type === 'private') {
    return `/api/qq_avatar/g?b=qq&s=0&nk=${(props.chat.data as Friend).user_id}`
  } else {
    return `/api/qq_group_avatar/gh/${(props.chat.data as Group).group_id}/${(props.chat.data as Group).group_id}/640`
  }
})

const getName = computed(() => {
  if (props.chat.type === 'private') {
    return (props.chat.data as Friend).remark ?? (props.chat.data as Friend).nickname
  } else {
    return (props.chat.data as Group).group_name
  }
})

const parseTime = (time: number | undefined) => {
  if (!time) return props.chat?.latestMsg
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
  <div v-ripple :class="{ selected: selected }" class="primary-border p-2 chat-card">
    <div class="flex flex-row flex-justify-start flex-items-center gap-2">
      <img :src="getAvatarUrl" class="h-10 w-10 rounded-full" />
      <div class="flex flex-col flex-justify-center flex-items-start gap-0.3">
        <div class="text-sm text-bold overflow-text">
          <i
            class="pi"
            :class="
              props.chat.type === 'private'
                ? 'i-fluent-chat-24-regular'
                : 'i-fluent-chat-multiple-24-regular'
            "
          />
          {{ getName }}
        </div>
        <div class="text-sm text-gray-500 overflow-text">
          <Suspense>
            <TextShortMsg :msg="props.chat.latestMsg" />
          </Suspense>
        </div>
      </div>
    </div>
    <div class="flex flex-col flex-justify-between flex-items-center">
      <div class="text-xs text-gray-500 text-end">{{ parseTime(props.chat?.latestMsg?.time) }}</div>
    </div>
  </div>
</template>

<style scoped>
.overflow-text {
  max-width: 9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  user-select: none;
  -webkit-user-select: none;
}

.chat-card:hover {
  background-color: var(--p-gray-50);
}

.chat-card.selected {
  background-color: var(--p-primary-100);
}
.chat-card.selected:hover {
  background-color: var(--p-primary-200);
}
</style>
