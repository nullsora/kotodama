<script setup lang="ts">
import { computed } from 'vue'
import { Chat } from '@renderer/functions/types'

const props = defineProps<{
  contact: Chat
  selected: boolean
}>()

const avatarUrl = computed(() => {
  if (props.contact.type === 'friend') {
    return `https://q1.qlogo.cn/g?b=qq&s=0&nk=${props.contact.data.user_id}`
  } else {
    return `https://p.qlogo.cn/gh/${props.contact.data.group_id}/${props.contact.data.group_id}/640`
  }
})
const name = computed(() => {
  if (props.contact.type === 'friend') {
    const nick = props.contact.data.nickname
    const remark = props.contact.data.remark
    return remark !== '' ? `${remark} (${nick})` : nick
  } else {
    return props.contact.data.group_name
  }
})
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
    <img :src="avatarUrl" class="w-10 h-10 rounded-full" crossorigin="anonymous" />
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
