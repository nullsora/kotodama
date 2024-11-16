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
    return `https://q1.qlogo.cn/g?b=qq&s=0&nk=${(contactObj.value as Friend).user_id}`
  } else if (props.contact?.type === 'group') {
    return `https://p.qlogo.cn/gh/${(contactObj.value as Group).group_id}/${(contactObj.value as Group).group_id}/640`
  } else return ''
})
</script>

<template>
  <div class="glassmorphism calc-height w-full flex flex-col justify-center items-center">
    <Card class="w-4/5">
      <template #title>
        <div class="w-full flex flex-row justify-between items-center">
          <img :src="avatarUrl" class="w-15 h-15 rounded-full" crossorigin="anonymous" />
          <div class="w-full flex flex-col justify-center items-end gap-2">
            <div class="text-xl font-bold">{{ contactName }}</div>
            <div class="text-sm text-gray-500">ID: {{ contact?.id }}</div>
          </div>
        </div>
      </template>
      <template #content>
        <Divider />
        <div
          v-if="contact?.type === 'friend'"
          class="w-full flex flex-col justify-start items-center gap-sm"
        >
          <div class="w-full flex flex-row justify-between items-center">
            <div class="font-bold">
              <i class="pi i-fluent-person-edit-24-regular h-4 w-4 align-mid" />
              备注
            </div>
            <div class="text-gray-500">{{ (contactObj as Friend).remark }}</div>
          </div>
          <div class="w-full flex flex-row justify-between items-center">
            <div class="font-bold">
              <i class="pi i-fluent-slide-text-edit-24-regular h-4 w-4 align-mid" />
              签名
            </div>
            <div class="text-gray-500">{{ (contactObj as Friend).longNick }}</div>
          </div>
        </div>
        <Divider />
      </template>
      <template #footer>
        <div class="w-full flex flex-row justify-end items-center gap-sm">
          <Button size="small" label="发送消息" />
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
