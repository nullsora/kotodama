<script setup lang="ts">
import { DataManager } from '@renderer/functions/data_manager'
import { getAvatarUrlFromId } from '@renderer/functions/get_avatar_url'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { Friend, GroupMember, Stranger } from '@renderer/functions/types'
import { computed, inject, onMounted, Ref, ref, useTemplateRef } from 'vue'

const runtimeData = inject('runtimeData') as DataManager
const sendText = inject('sendText') as Ref<string>

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

const userInfo = ref<Partial<GroupMember> & Partial<Friend> & Stranger>()

const menuItems = ref([
  {
    label: '@ TA',
    icon: 'i-fluent-person-24-regular w-4 h-4',
    command: () => {
      sendText.value += `[/@${id}] `
    }
  }
])

const url = computed(() => getAvatarUrlFromId(id, 'friend'))

const genderSymbol = computed(() => {
  if (!userInfo.value?.sex) return ''
  return userInfo.value.sex === 'male'
    ? 'i-fluent-emoji-male-sign'
    : userInfo.value.sex === 'female'
      ? 'i-fluent-emoji-female-sign'
      : 'i-fluent-emoji-white-question-mark'
})

const getUserInfo = async () => {
  const stranger = (await packagedGetter.getInfo.stranger(id)).data
  userInfo.value = stranger
  const friend = runtimeData.find.friend(id)
  if (friend) {
    userInfo.value.remark = friend.remark
    userInfo.value.longNick = friend.longNick
  }
  if (groupId) {
    const groupMember = (await packagedGetter.getInfo.groupMember(groupId, id)).data
    if (groupMember) {
      userInfo.value.card = groupMember.card
      userInfo.value.role = groupMember.role
      userInfo.value.title = groupMember.title
    }
  }
}

const handleRightClick = (e: MouseEvent) => {
  if (type === 'group' && showMenu) contextMenu.value!.show(e)
}

onMounted(getUserInfo)
</script>

<template>
  <div class="avatar">
    <div
      v-bind="$attrs"
      :class="position === 'right' ? 'ml-2' : 'mr-2'"
      @click="menu?.toggle"
      @contextmenu="handleRightClick"
    >
      <img :src="url" class="w-8.5 h-8.5 rd-full" />
    </div>
    <ContextMenu ref="contextMenu" :model="menuItems" />
    <Menu ref="menu" :popup="true" class="p-sm">
      <template #start>
        <div class="flex flex-row justify-between items-center gap-sm">
          <img :src="url" class="w-12 h-12 rd-full" />
          <div class="text-right">
            <div class="font-bold text-lg dark-gray-text">
              <i v-if="genderSymbol" class="pi mr-1 w-4.5 h-4.5 align-mid" :class="genderSymbol" />
              {{ userInfo?.nickname }}
            </div>
            <div class="gray-text text-sm">QQ {{ id }}</div>
          </div>
        </div>
        <Divider />
        <div class="flex flex-col gap-2">
          <div
            v-if="userInfo?.longNick"
            class="flex flex-row justify-between items-center min-w-60"
          >
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
  </div>
</template>

<style scoped>
.avatar {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
}
</style>
