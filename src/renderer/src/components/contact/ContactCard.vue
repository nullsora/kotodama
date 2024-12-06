<script setup lang="ts">
import { computed } from 'vue'
import { getAvatarUrl } from '@renderer/functions/get_avatar_url'
import { Chat } from '@renderer/functions/types'

const { contact } = defineProps<{
  contact: Chat
  selected: boolean
}>()

const avatarUrl = computed(() => getAvatarUrl(contact))
const hasRemark = computed(() => contact.type === 'friend' && contact.data.remark !== '')
</script>

<template>
  <div
    v-ripple
    :class="{
      selected: selected,
      'primary-border': contact.type === 'friend',
      glassmorphism: contact.type === 'group'
    }"
    class="w-full contact-card p-2"
  >
    <img :src="avatarUrl" class="w-10 h-10 rounded-full drag-none" />
    <div
      v-if="contact.type === 'friend'"
      class="flex flex-col justify-center items-start gap-1 ml-sm"
    >
      <div class="text-sm">{{ hasRemark ? contact.data.remark : contact.data.nickname }}</div>
      <div v-if="hasRemark" class="text-xs gray-text">{{ contact.data.nickname }}</div>
    </div>
    <div v-else class="flex flex-col justify-center items-start gap-1 ml-sm">
      <div class="text-sm max-w-50 truncate">{{ contact.data.group_name }}</div>
      <div class="text-xs gray-text">{{ contact.data.member_count }}人</div>
    </div>
  </div>
</template>

<style scoped>
.contact-card {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;

  user-select: none;
  -webkit-user-select: none;
}

.contact-card:hover {
  background-color: var(--p-gray-50);
}

.dark-mode .contact-card {
  color: white;
}

.dark-mode .contact-card:hover {
  background-color: var(--p-gray-700);
}

.contact-card.selected {
  background-color: var(--p-primary-500);
  color: white;
}

.contact-card.selected .gray-text {
  color: white;
}
</style>
