<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'

import Sidebar from '@renderer/components/chat/Sidebar.vue'
import ChatSelectPanel from '@renderer/components/chat/ChatSelectPanel.vue'
import ChatPageLayout from '@renderer/components/layout/ChatPageLayout.vue'
import ChatPanel from '@renderer/components/chat/ChatPanel.vue'

import { DataManager } from '@renderer/functions/data_manager'
import { useStatusStore } from '@renderer/stores/status_store'

const runtimeData = inject('runtimeData') as DataManager

const selectedGroupId = ref(-1)

const status = useStatusStore()

const renderContacts = computed(() => {
  if (selectedGroupId.value === -1) {
    return undefined
  } else {
    return runtimeData.user.value.contactGroups[selectedGroupId.value].chats
  }
})

watch(
  () => runtimeData.showingChat.value,
  () => {
    status.sendingText = ''
  }
)
</script>

<template>
  <ChatPageLayout>
    <template #sidebar>
      <Sidebar v-model:selected-group-id="selectedGroupId" />
    </template>
    <template #contacts>
      <ChatSelectPanel
        v-model:selected-chat="runtimeData.showingChat.value"
        :filters="renderContacts"
      />
    </template>
    <template #chat>
      <ChatPanel :chat-info="runtimeData.showingChat.value" />
    </template>
  </ChatPageLayout>
</template>
