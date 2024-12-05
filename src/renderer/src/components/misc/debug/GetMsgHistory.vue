<script setup lang="ts">
import { packagedGetter } from '@renderer/functions/packaged_api'
import { ref } from 'vue'

const isGroup = ref({ label: 'Group', value: true })
const selectGroup = ref([
  { label: 'Group', value: true },
  { label: 'Private', value: false }
])
const chatId = ref<number>()
const count = ref<number>()
const msgResult = ref('')

const fetchMsg = async () => {
  if (!chatId.value) return
  if (isGroup.value.value) {
    const res = await packagedGetter.getMsg.group(chatId.value, count.value)
    msgResult.value = JSON.stringify(res, null, 2)
  } else {
    const res = await packagedGetter.getMsg.friend(chatId.value, count.value)
    msgResult.value = JSON.stringify(res, null, 2)
  }
}
</script>

<template>
  <Card class="w-180 ml-a mr-a">
    <template #title> Get History Message </template>
    <template #content>
      <SelectButton v-model="isGroup" :options="selectGroup" option-label="label" />
      <div class="flex justify-center items-center w-full mt-2">
        <InputNumber
          v-model="chatId"
          :use-grouping="false"
          class="w-full mr-1"
          placeholder="Chat ID"
        />
        <InputNumber v-model="count" class="w-full ml-1" placeholder="count" />
      </div>
      <div class="flex justify-between items-center w-full mt-2">
        <Button class="flex-1 mr-1" label="Clear" severity="success" @click="msgResult = ''" />
        <Button class="flex-1" icon="i-fluent-send-24-regular" label="Send" @click="fetchMsg" />
      </div>
      <div
        v-if="msgResult !== ''"
        class="w-full max-h-80 mt-2 scrollbar scrollbar-w-1 scrollbar-rounded"
      >
        <Message severity="success" class="whitespace-pre-wrap break-anywhere">
          {{ msgResult }}
        </Message>
      </div>
    </template>
  </Card>
</template>
