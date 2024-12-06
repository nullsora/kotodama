<script setup lang="ts">
import { DataManager } from '@renderer/functions/data_manager'
import { getAvatarUrlFromId } from '@renderer/functions/get_avatar_url'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { GroupMember, Friend, Stranger } from '@renderer/functions/types'
import { computed, inject, onMounted, ref, useTemplateRef, watch } from 'vue'

const runtimeData = inject('runtimeData') as DataManager

const menu = useTemplateRef('menu')

const { userId, groupId } = defineProps<{
  userId: number
  groupId: number
}>()

const userInfo = ref<Partial<GroupMember> & Partial<Friend> & Stranger>()

const url = computed(() => getAvatarUrlFromId(userId, 'friend'))

const genderSymbol = computed(() => {
  if (!userInfo.value?.sex) return ''
  return userInfo.value.sex === 'male'
    ? 'i-fluent-emoji-male-sign'
    : userInfo.value.sex === 'female'
      ? 'i-fluent-emoji-female-sign'
      : 'i-fluent-emoji-white-question-mark'
})

const getUserInfo = async () => {
  const stranger = (await packagedGetter.getInfo.stranger(userId)).data
  userInfo.value = stranger
  const friend = runtimeData.find.friend(userId)
  if (friend) {
    userInfo.value = {
      ...userInfo.value,
      ...friend
    }
  }
  if (groupId) {
    const groupMember = (await packagedGetter.getInfo.groupMember(groupId, userId)).data
    if (groupMember) {
      userInfo.value = {
        ...userInfo.value,
        ...groupMember
      }
    }
  }
}

onMounted(getUserInfo)
watch(() => userId, getUserInfo)

defineExpose({
  menu
})
</script>

<template>
  <Menu ref="menu" :popup="true" class="p-sm">
    <template #start>
      <div class="flex flex-row justify-between items-center gap-sm">
        <img :src="url" class="w-12 h-12 rd-full select-none drag-none" />
        <div class="text-right">
          <div class="font-bold text-lg dark-gray-text">
            <i v-if="genderSymbol" class="pi mr-1 w-4.5 h-4.5 align-mid" :class="genderSymbol" />
            {{ userInfo?.nickname }}
          </div>
          <div class="gray-text text-sm">QQ {{ userId }}</div>
        </div>
      </div>
      <Divider />
      <div class="min-w-60" />
      <div class="flex flex-col gap-2">
        <div v-if="userInfo?.qid" class="flex flex-row justify-between items-center min-w-60">
          <div class="primary-text text-sm mr-4">QID</div>
          <div class="primary-text text-right text-sm">{{ userInfo?.qid }}</div>
        </div>
        <div v-if="userInfo?.longNick" class="flex flex-row justify-between items-center min-w-60">
          <div class="gray-text text-sm mr-4">签名</div>
          <div class="dark-gray-text text-right text-sm">{{ userInfo?.longNick }}</div>
        </div>
        <div v-if="userInfo?.remark" class="flex flex-row justify-between items-center min-w-60">
          <div class="gray-text text-sm mr-4">备注</div>
          <div class="dark-gray-text text-right text-sm">{{ userInfo?.remark }}</div>
        </div>
        <div v-if="userInfo?.card" class="flex flex-row justify-between items-center min-w-60">
          <div class="gray-text text-sm mr-4">群名称</div>
          <div class="dark-gray-text text-right text-sm">{{ userInfo?.card }}</div>
        </div>
      </div>
    </template>
  </Menu>
</template>
