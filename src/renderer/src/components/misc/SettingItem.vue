<script setup lang="ts">
defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <div class="setting-item primary-border">
    <div class="">
      <div class="flex flex-col flex-item-start justify-start">
        <div class="font-size-4 font-bold">{{ title ?? '' }}</div>
        <div v-if="description" class="text-gray-500 font-size-3">{{ description }}</div>
      </div>
    </div>
    <div>
      <slot name="default" />
    </div>
  </div>
</template>

<style scoped>
.setting-item {
  width: 100%;
  padding: 0.875rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.dark-mode .setting-item {
  background-color: var(--p-gray-800);
  color: white;
}
</style>
