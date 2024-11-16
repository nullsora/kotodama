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
  if (!props.filters) return runtimeData.user.value.contacts.showing

  const renderer: Chat[] = []
  for (const chat of runtimeData.user.value.contacts.showing) {
    if (
      props.filters.find((c) => {
        if (c.type !== chat.type) return false

        if (c.type === 'private')
          return (c.data as Friend).user_id === (chat.data as Friend).user_id
        else if (c.type === 'group')
          return (c.data as Group).group_id === (chat.data as Group).group_id

        return false
      })
    ) {
      renderer.push(chat)
    }
  }
  console.log(renderer)
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
  if (chat.type === 'private') {
    selectedChat.value = {
      type: 'friend',
      id: (chat.data as Friend).user_id
    }
  } else if (chat.type === 'group') {
    selectedChat.value = {
      type: 'group',
      id: (chat.data as Group).group_id
    }
  }
}
</script>

<template>
  <div class="calc-height scrollbar scrollbar-w-1 scrollbar-rounded glassmorphism">
    <div class="p-2 p-b-0">
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
