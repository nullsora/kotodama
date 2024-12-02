<script setup lang="ts">
import Connector from '@renderer/functions/connector'
import { ref } from 'vue'
import GetMsgHistory from './debug/GetMsgHistory.vue'

const action = ref('')
const paramsRaw = ref('{}')
const echo = ref('')

const result = ref('')

const fetchResult = async () => {
  const params = JSON.parse(paramsRaw.value)
  const res = await Connector.fetch(action.value, echo.value, params)
  result.value = JSON.stringify(res, null, 2)
}
</script>

<template>
  <div class="w-full calc-height scrollbar scrollbar-w-1 scrollbar-rounded items-center">
    <GetMsgHistory />
    <Card class="w-180 mt-sm">
      <template #title>Connector Sender</template>
      <template #content>
        <div class="flex flex-col justify-between items-center">
          <div class="flex flex-col justify-start items-center w-full mb-2">
            <InputText v-model="action" class="w-full mb-2" placeholder="Action Name" />
            <InputText v-model="paramsRaw" class="w-full mb-2" placeholder="params" />
            <InputText v-model="echo" class="w-full mb-2" placeholder="Echo" />
          </div>

          <div class="flex justify-between items-center w-full mb-2">
            <Button class="flex-1 mr-1" label="Clear" severity="success" @click="result = ''" />
            <Button
              class="flex-1"
              icon="i-fluent-send-24-regular"
              label="Send"
              @click="fetchResult"
            />
          </div>

          <ScrollPanel class="w-full h-80 mb-2">
            <Message severity="success" class="w-full whitespace-pre-wrap break-words">
              {{ result }}
            </Message>
          </ScrollPanel>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.calc-height {
  height: calc(100vh - 6rem);
}
</style>
