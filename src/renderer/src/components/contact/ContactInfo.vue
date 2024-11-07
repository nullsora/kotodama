<script setup lang="ts">
import { computed, inject } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import { Friend, Group } from '@renderer/functions/types'

const runtimeData = inject('runtimeData') as DataManager

const props = defineProps<{
  contact: {
    type: 'friend' | 'group'
    id: number
  } | null
}>()

const contactObj = computed(() => {
  if (props.contact?.type === 'friend') {
    return runtimeData.user.value.contacts.friends.find(
      (friend: Friend) => friend.user_id === props.contact?.id
    )
  } else if (props.contact?.type === 'group') {
    return runtimeData.user.value.contacts.groups.find(
      (group: Group) => group.group_id === props.contact?.id
    )
  }
  return null
})

const contactName = computed(() => {
  if (props.contact?.type === 'friend') {
    return (contactObj.value as Friend)?.nickname
  } else if (props.contact?.type === 'group') {
    return (contactObj.value as Group)?.group_name
  }
  return ''
})

const avatarUrl = computed(() => {
  if (props.contact?.type === 'friend') {
    return `/api/qq_avatar/g?b=qq&s=0&nk=${(contactObj.value as Friend).user_id}`
  } else if (props.contact?.type === 'group') {
    return `/api/qq_group_avatar/gh/${(contactObj.value as Group).group_id}/${(contactObj.value as Group).group_id}/640`
  } else return ''
})
</script>

<template>
  <div class="w-full calc-height flex flex-col flex-justify-center flex-items-center">
    <Card class="w-4/5">
      <template #title>
        <div class="w-full flex flex-row flex-justify-between flex-items-center">
          <img :src="avatarUrl" class="w-15 h-15 rounded-full" />
          <div class="w-full flex flex-col flex-justify-center flex-items-end gap-2">
            <div class="text-xl font-bold">{{ contactName }}</div>
            <div class="text-sm text-gray-500">ID: {{ contact?.id }}</div>
          </div>
        </div>
      </template>
      <template #content>
        <Divider />
        <div
          v-if="contact?.type === 'friend'"
          class="w-full flex flex-col flex-justify-start flex-items-center"
        >
          <div class="w-full flex flex-row flex-justify-between flex-items-center">
            <div class="font-bold">备注</div>
            <div class="text-gray-500">{{ (contactObj as Friend).remark }}</div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.calc-height {
  height: calc(100vh - 4.35rem);
}
</style>
