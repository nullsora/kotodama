<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import Connector from '@renderer/functions/connector'

const runtimeData = inject('runtimeData') as DataManager

const menu = useTemplateRef('menu')

const avatarUrl = computed(() => {
  return `k-avatar://q1.qlogo.cn/g?b=qq&s=0&nk=${runtimeData.userInfo.value.main.user_id ?? 10000}`
})

const genderSymbol = computed(() => {
  if (runtimeData.userInfo.value.more?.sex === 'male') {
    return 'i-fluent-emoji-male-sign'
  } else if (runtimeData.userInfo.value.more?.sex === 'female') {
    return 'i-fluent-emoji-female-sign'
  } else return 'i-fluent-emoji-white-question-mark'
})

const togglePopup = (event: Event) => {
  menu.value!.toggle(event)
}

const sendMsgToSelf = () => {
  runtimeData.showingChat.value = {
    type: 'friend',
    id: runtimeData.userInfo.value.main.user_id
  }
  menu.value!.hide()
}

const logout = () => {
  menu.value!.hide()
  Connector.close()
}
</script>

<template>
  <Menu ref="menu" :popup="true" class="p-sm">
    <template #start>
      <div class="flex flex-rol justify-between items-center">
        <img
          :src="avatarUrl"
          loading="lazy"
          class="w-12 h-12 rd-full drag-none"
          crossorigin="anonymous"
        />
        <div class="text-right">
          <div class="font-bold text-lg dark-gray-text">
            <i
              v-if="runtimeData.userInfo.value.more?.sex"
              class="pi mr-2 font-size-5"
              :class="genderSymbol"
            />
            {{ runtimeData.userInfo.value.main.nickname }}
          </div>
          <div class="gray-text text-sm">QQ {{ runtimeData.userInfo.value.main.user_id }}</div>
        </div>
      </div>
      <Divider />
      <div class="flex flex-col gap-2">
        <div
          v-if="runtimeData.userInfo.value.more?.qid"
          class="flex flex-rol justify-between items-center min-w-60"
        >
          <div class="primary-text text-sm mr-4">QID</div>
          <div class="primary-text text-right text-sm">
            {{ runtimeData.userInfo.value.more?.qid }}
          </div>
        </div>
        <div
          v-if="runtimeData.userInfo.value.more?.longNick"
          class="flex flex-rol justify-between items-center min-w-60"
        >
          <div class="gray-text text-sm mr-4">签名</div>
          <div class="dark-gray-text text-right text-sm">
            {{ runtimeData.userInfo.value.more?.longNick }}
          </div>
        </div>
      </div>
    </template>
    <template #end>
      <Divider />
      <div class="flex justify-between items-center gap-sm w-full">
        <Button class="w-full" size="small" severity="secondary" label="设置资料" />
        <Button class="w-full" size="small" severity="danger" label="退出登录" @click="logout" />
      </div>
      <Button
        class="w-full mt-sm"
        size="small"
        severity="primary"
        label="发消息"
        @click="sendMsgToSelf"
      />
    </template>
  </Menu>
  <OverlayBadge :severity="runtimeData.connected.value ? 'success' : 'warn'">
    <Button
      class="w-10 h-10"
      size="large"
      text
      rounded
      aria-haspopup="true"
      aria-controls="user_info_panel"
      @click="togglePopup"
    >
      <img
        :src="avatarUrl"
        loading="lazy"
        class="w-10 h-10 rd-10 drag-none"
        crossorigin="anonymous"
      />
    </Button>
  </OverlayBadge>
</template>
