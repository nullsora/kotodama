<script setup lang="ts">
import { computed, inject } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import { Chat, Friend, Group } from '@renderer/functions/types'
import ChatCard from './ChatCard.vue'

const props = defineProps<{ filters?: Chat[] }>()

const runtimeData = inject('runtimeData') as DataManager

const selectedChat = defineModel<{
  type: 'friend' | 'group'
  id: number
} | null>('selectedChat')

const renderChats = computed(() => {
  if (!props.filters) return runtimeData.curContacts.showing

  const renderer: Chat[] = []
  for (const chat of runtimeData.curContacts.showing) {
    if (
      props.filters.find((c) => {
        if (c.type === 'friend' && chat.type === 'friend')
          return c.data.user_id === chat.data.user_id
        else if (c.type === 'group' && chat.type === 'group')
          return c.data.group_id === chat.data.group_id
        else return false
      })
    ) {
      renderer.push(chat)
    }
  }
  return renderer
})

const getSelected = (chat: Chat) => {
  if (selectedChat.value?.type === 'friend') {
    return selectedChat.value.id === (chat.data as Friend).user_id
  } else if (selectedChat.value?.type === 'group') {
    return selectedChat.value.id === (chat.data as Group).group_id
  } else return false
}

const changeSelectedChat = (chat: Chat) => {
  if (chat.type === 'friend') {
    selectedChat.value = {
      type: 'friend',
      id: chat.data.user_id
    }
  } else if (chat.type === 'group') {
    selectedChat.value = {
      type: 'group',
      id: chat.data.group_id
    }
  }
}
</script>

<template>
  <div class="calc-height scrollbar scrollbar-w-1 scrollbar-rounded glassmorphism">
    <div class="p-2 pb-0">
      <ChatCard
        v-for="(contact, index) in renderChats"
        :key="index"
        :chat="contact"
        :selected="getSelected(contact)"
        class="mb-2"
        @click="changeSelectedChat(contact)"
      />
    </div>
  </div>
</template>

<style scoped>
.calc-height {
  height: calc(100vh - 4.35rem);
}
</style>
