<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import ForwardWrapperMsg from './basic/ForwardWrapperMsg.vue'
import ForwardInternalMsg from './basic/ForwardInternalMsg.vue'

defineProps<{
  msg: MessageTypes['Forward']
}>()
</script>

<template>
  <ForwardInternalMsg v-if="msg.data.content" :msg="msg" />
  <ForwardWrapperMsg v-else :msg="msg" />
</template>
