<script setup lang="ts">
import { computed } from 'vue'

const { time } = defineProps<{ time: number }>()

const parsedTime = computed(() => {
  const date = new Date(time * 1000)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
})
</script>

<template>
  <Tag class="send-time select-none" severity="secondary" :value="parsedTime" rounded />
</template>

<style scoped>
.send-time {
  background-color: var(--p-primary-100);
  opacity: 0.7;
  color: var(--p-gray-900);
  font-weight: 500;
  font-size: 0.65rem;
}
</style>
