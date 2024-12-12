<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import GroupAnnouceDialog from './GroupAnnouceDialog.vue'

const menu = useTemplateRef('menu')

const { groupId } = defineProps<{ groupId: number }>()

const showApps = ref({
  annouce: false
})

const menuItems = ref([
  {
    label: '群公告',
    icon: 'i-fluent-megaphone-circle-24-regular w-5 h-5',
    command: () => (showApps.value.annouce = true)
  }
])
</script>

<template>
  <div>
    <Button
      icon="i-fluent-apps-24-regular w-5 h-5"
      severity="secondary"
      text
      rounded
      @click="menu?.toggle"
    />
    <Menu ref="menu" :popup="true" :model="menuItems" class="p-1" />
    <GroupAnnouceDialog v-model="showApps.annouce" :group-id="groupId" />
  </div>
</template>
