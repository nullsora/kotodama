<script setup lang="ts">
import { computed, inject } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'

const runtimeData = inject('runtimeData') as DataManager

const props = defineProps<{
  chatInfo: {
    type: 'friend' | 'group'
    id: number
  } | null
}>()

const chatName = computed(() => {
  if (props.chatInfo?.type === 'friend') {
    const friend = runtimeData.user.value.contacts.friends.find(
      (friend) => friend.user_id === props.chatInfo?.id
    )
    if (friend) return friend.remark === '' ? friend.nickname : friend.remark
  } else if (props.chatInfo?.type === 'group') {
    const group = runtimeData.user.value.contacts.groups.find(
      (group) => group.group_id === props.chatInfo?.id
    )
    if (group) return `${group.group_name} (${group.member_count})`
  }
  return ''
})
</script>

<template>
  <div class="chat-info">
    <div>{{ chatName }}</div>
  </div>
</template>

<style scoped>
.chat-info {
  display: flex;
  width: 100%;
  height: 3rem;
  justify-content: space-between;
  align-items: center;

  padding: 0.8rem;
  background-color: white;
  color: black;

  border-bottom: 1px solid #e2e8f0;
  border-radius: 0.5rem 0.5rem 0 0;
}

.chat-info:has(.dark-mode) {
  background-color: black;
  color: white;
}
</style>
