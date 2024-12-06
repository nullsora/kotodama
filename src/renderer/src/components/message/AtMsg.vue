<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import AtTag from './basic/AtTag.vue'
import UserInfoMenu from './basic/UserInfoMenu.vue'
import { computed, useTemplateRef } from 'vue'

const menu = useTemplateRef('menu')

const { msg, sendGroupId } = defineProps<{
  msg: MessageTypes['At']
  sendGroupId?: number
}>()

const isUser = computed(() => msg.data.qq !== 'all')

const toggleMenu = (event: MouseEvent) => {
  if (!isUser.value) return
  menu.value?.menu?.toggle(event)
}
</script>

<template>
  <span class="m-1 line-height-relaxed cursor-pointer" @click="toggleMenu">
    <Suspense v-if="!msg.data.name">
      <AtTag :msg="msg" :send-group-id="sendGroupId" />
      <template #fallback>
        <Tag rounded>
          <span class="text-xs">@</span>
        </Tag>
      </template>
    </Suspense>
    <Tag v-else rounded>
      <span class="text-xs">@ {{ msg.data.name }}</span>
    </Tag>
    <UserInfoMenu
      v-if="isUser"
      ref="menu"
      :user-id="parseInt(msg.data.qq)"
      :group-id="sendGroupId ?? 0"
    />
  </span>
</template>
