<script setup lang="ts">
import { computed } from 'vue'

const { role, title } = defineProps<{
  role: 'owner' | 'admin' | 'member'
  title?: string
}>()

const show = computed(() => {
  return role !== 'member' || title
})

const style = computed(() => {
  return role === 'owner' ? 'orange' : 'violet'
})

const text = computed(() => {
  switch (role) {
    case 'owner':
      return title || '群主'
    case 'admin':
      return title || '管理员'
    default:
      return title || '成员'
  }
})
</script>

<template>
  <div v-if="show" class="title select-none flex items-center" :class="style">
    {{ text }}
  </div>
</template>

<style scoped>
.title {
  padding: 0.1rem 0.3rem;
  border-radius: 0.5rem;
  font-size: 0.6rem;
  font-weight: 700;
}

.orange {
  background-color: var(--p-orange-200);
  color: var(--p-orange-500);
}

.dark-mode .orange {
  background-color: var(--p-orange-700);
  color: var(--p-orange-200);
}

.violet {
  background-color: var(--p-violet-200);
  color: var(--p-violet-500);
}

.dark-mode .violet {
  background-color: var(--p-violet-700);
  color: var(--p-violet-200);
}
</style>
