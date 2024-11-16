<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: number
  position?: 'left' | 'right'
}>()

const url = computed(() => {
  return `https://q1.qlogo.cn/g?b=qq&s=0&nk=${props.id}`
})
</script>

<template>
  <div :class="`avatar ${position === 'right' ? 'm-l-2' : 'm-r-2'}`" class="avatar m-b-0.2">
    <img :src="url" class="w-8.5 h-8.5 rd-full" crossorigin="anonymous" />
  </div>
</template>

<style scoped>
.avatar {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
}
</style>
