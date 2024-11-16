<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'
import { xml2js } from 'xml-js'

const { msg } = defineProps<{
  msg: MessageTypes['XML']
}>()

const parsedMsg = computed(() => {
  const res = xml2js(msg.data.data, { compact: true })
  //TODO: parse xml
  return res
})
</script>

<template>
  <div>{{ parsedMsg }}</div>
</template>
