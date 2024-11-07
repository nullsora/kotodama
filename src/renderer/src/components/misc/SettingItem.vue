<script setup lang="ts">
defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <div class="flex flex-row flex-item-center flex-justify-between w-full p-sm primary-border">
    <div class="">
      <div class="flex flex-col flex-item-start flex-justify-start">
        <div class="font-size-4 font-bold">{{ title ?? '' }}</div>
        <div v-if="description" class="text-gray-500 font-size-3">{{ description }}</div>
      </div>
    </div>
    <div>
      <slot name="default" />
    </div>
  </div>
</template>
