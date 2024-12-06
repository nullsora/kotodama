<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import { getAvatarUrlFromId } from '@renderer/functions/get_avatar_url'
import { ChatInfo, Friend, Group, Pages } from '@renderer/functions/types'

const runtimeData = inject('runtimeData') as DataManager
const currentPage = inject('currentPage') as Ref<Pages>

const { contact } = defineProps<{
  contact: ChatInfo | null
}>()

const contactObj = computed(() => {
  if (!contact) return null
  return runtimeData.find[contact.type](contact.id) ?? null
})

const contactName = computed(() => {
  if (contact?.type === 'friend') {
    return (contactObj.value as Friend)?.nickname
  } else if (contact?.type === 'group') {
    return (contactObj.value as Group)?.group_name
  }
  return ''
})

const avatarUrl = computed(() => {
  if (!contact) return ''
  return getAvatarUrlFromId(contact.id, contact.type)
})

const jumpToMsg = async () => {
  if (contact?.type === 'friend') {
    await runtimeData.addToList.private(contact.id)
    currentPage.value = Pages.Chat
    runtimeData.showingChat.value = { type: 'friend', id: contact.id }
  } else if (contact?.type === 'group') {
    await runtimeData.addToList.group(contact.id)
    currentPage.value = Pages.Chat
    runtimeData.showingChat.value = { type: 'group', id: contact.id }
  }
}
</script>

<template>
  <div class="calc-height w-full flex flex-col justify-center items-center">
    <Card class="w-4/5">
      <template #title>
        <div class="w-full flex justify-between items-center">
          <img :src="avatarUrl" class="w-15 h-15 rounded-full drag-none" crossorigin="anonymous" />
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
          <div v-if="(contactObj as Friend).qid" class="w-full flex justify-between items-center">
            <div class="font-bold">
              <i class="pi i-fluent-slide-text-person-24-regular h-4 w-4 align-mid" />
              QID
            </div>
            <div class="text-gray-500">{{ (contactObj as Friend).qid }}</div>
          </div>
          <div class="w-full flex justify-between items-center">
            <div class="font-bold">
              <i class="pi i-fluent-person-edit-24-regular h-4 w-4 align-mid" />
              备注
            </div>
            <div class="text-gray-500">{{ (contactObj as Friend).remark }}</div>
          </div>
          <div class="w-full flex justify-between items-center">
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
        <div class="w-full flex justify-end items-center gap-sm">
          <Button size="small" label="发送消息" @click="jumpToMsg" />
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
