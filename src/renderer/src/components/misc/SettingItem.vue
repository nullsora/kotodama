<script setup lang="ts">
defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <div class="setting-item glassmorphism">
    <div>
      <div class="flex flex-col flex-item-start justify-start">
        <div class="font-size-4 font-bold">{{ title ?? '' }}</div>
        <div v-if="description" class="description font-size-3">{{ description }}</div>
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
  color: white;
}

.description {
  color: var(--p-gray-500);
}

.dark-mode .description {
  color: var(--p-gray-300);
}
</style>
