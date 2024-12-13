<script setup lang="ts">
import { getAvatarUrlFromId } from '@renderer/functions/get_avatar_url'
import { useStatusStore } from '@renderer/stores/status_store'
import { computed, ref, useTemplateRef } from 'vue'
import UserInfoMenu from './UserInfoMenu.vue'

const status = useStatusStore()

const contextMenu = useTemplateRef('contextMenu')
const menu = useTemplateRef('menu')

const {
  id,
  type,
  groupId = 0,
  showMenu = true
} = defineProps<{
  id: number
  type?: 'friend' | 'group'
  position?: 'left' | 'right'
  groupId?: number
  showMenu?: boolean
}>()

const menuItems = ref([
  {
    label: '@ TA',
    icon: 'i-fluent-person-24-regular w-4 h-4',
    command: () => {
      status.sendingText += `[/@${id}] `
    }
  }
])

const url = computed(() => getAvatarUrlFromId(id, 'friend'))

const handleRightClick = (e: MouseEvent) => {
  if (type === 'group' && showMenu) contextMenu.value!.show(e)
}
</script>

<template>
  <div class="avatar">
    <div
      v-bind="$attrs"
      :class="position === 'right' ? 'ml-2' : 'mr-2'"
      @click="menu?.menu?.toggle"
      @contextmenu="handleRightClick"
    >
      <img :src="url" class="w-8.5 h-8.5 rd-full select-none drag-none" />
    </div>
    <ContextMenu ref="contextMenu" :model="menuItems" />
    <UserInfoMenu ref="menu" :user-id="id" :group-id="groupId" />
  </div>
</template>

<style scoped>
.avatar {
  position: sticky;
  bottom: 0;
  cursor: pointer;
}
</style>
