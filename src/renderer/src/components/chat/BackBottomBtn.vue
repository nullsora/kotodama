<script setup lang="ts">
import FadeTransition from '../misc/FadeTransition.vue'

const { showHeight, curHeight } = defineProps<{
  showHeight: number
  curHeight: number
}>()
</script>

<template>
  <FadeTransition>
    <div v-if="curHeight < showHeight" class="affix">
      <Button v-bind="$attrs" icon="i-fluent-chevron-down-24-regular font-bold w-6 h-6" rounded />
    </div>
  </FadeTransition>
</template>

<style scoped>
.affix {
  position: fixed;
  bottom: 3.5rem;
  right: 1rem;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
