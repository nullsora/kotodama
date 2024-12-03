<script setup lang="ts">
import { computed, inject, Ref, ref, useTemplateRef } from 'vue'

const sendText = inject('sendText') as Ref<string>

const menu = useTemplateRef('menu')

const {
  id,
  type,
  showMenu = true
} = defineProps<{
  id: number
  type?: 'friend' | 'group'
  position?: 'left' | 'right'
  showMenu?: boolean
}>()

const url = computed(() => {
  return `https://q1.qlogo.cn/g?b=qq&s=0&nk=${id}`
})

const handleRightClick = (e: MouseEvent) => {
  if (type === 'group' && showMenu) menu.value!.show(e)
}

const menuItems = ref([
  {
    label: '@ TA',
    icon: 'i-fluent-person-24-regular w-4 h-4',
    command: () => {
      sendText.value += `[/@${id}] `
    }
  }
])
</script>

<template>
  <div class="avatar">
    <div
      v-bind="$attrs"
      :class="position === 'right' ? 'ml-2' : 'mr-2'"
      @contextmenu="handleRightClick"
    >
      <img :src="url" class="w-8.5 h-8.5 rd-full" crossorigin="anonymous" />
    </div>
    <ContextMenu ref="menu" :model="menuItems" />
  </div>
</template>

<style scoped>
.avatar {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
}
</style>
