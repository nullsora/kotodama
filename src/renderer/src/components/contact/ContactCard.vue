<script setup lang="ts">
import { computed } from 'vue'
import { Friend, Group } from '@renderer/functions/types'

const props = defineProps<{
  contact: {
    type: 'private' | 'group'
    data: Friend | Group
  }
  selected: boolean
}>()

const avatarUrl = computed(() => {
  if (props.contact.type === 'private') {
    return `/api/qq_avatar/g?b=qq&s=0&nk=${(props.contact.data as Friend).user_id}`
  } else {
    return `/api/qq_group_avatar/gh/${(props.contact.data as Group).group_id}/${(props.contact.data as Group).group_id}/640`
  }
})
const name = computed(() => {
  if (props.contact.type === 'private') {
    const nick = (props.contact.data as Friend).nickname
    const remark = (props.contact.data as Friend).remark
    return remark ? `${remark} (${nick})` : nick
  } else {
    return (props.contact.data as Group).group_name
  }
})
</script>

<template>
  <div v-ripple :class="{ selected: selected }" class="w-full primary-border contact-card p-2">
    <img :src="avatarUrl" class="w-10 h-10 rounded-full" />
    <div class="flex flex-col justify-center items-start ml-2">
      <span class="text-sm">{{ name }}</span>
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
</style>
