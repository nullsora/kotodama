<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import AtTag from './basic/AtTag.vue'

defineProps<{
  msg: MessageTypes['At']
  sendGroupId?: number
}>()
</script>

<template>
  <span class="m-1 line-height-relaxed">
    <Suspense>
      <AtTag :msg="msg" :send-group-id="sendGroupId" />
      <template #fallback>
        <Tag>
          <span class="text-sm">@</span>
        </Tag>
      </template>
    </Suspense>
  </span>
</template>
