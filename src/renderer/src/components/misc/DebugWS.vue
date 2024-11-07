<script setup lang="ts">
import Connector from '@renderer/functions/connector'
import { ref } from 'vue'

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
  <div class="flex flex-row flex-justify-center flex-items-center w-full h-full">
    <Card class="w-180">
      <template #title>Connector Sender</template>
      <template #content>
        <div class="flex flex-col flex-justify-between flex-items-center">
          <div class="flex flex-col flex-justify-start flex-items-center w-full m-b-2">
            <InputText v-model="action" class="w-full m-b-2" placeholder="Action Name" />
            <InputText v-model="paramsRaw" class="w-full m-b-2" placeholder="params" />
            <InputText v-model="echo" class="w-full m-b-2" placeholder="Echo" />
          </div>

          <div class="flex flex-row flex-justify-between flex-items-center w-full m-b-2">
            <Button class="flex-1 m-r-1" label="Clear" severity="success" @click="result = ''" />
            <Button
              class="flex-1"
              icon="i-fluent-send-24-regular"
              label="Send"
              @click="fetchResult"
            />
          </div>

          <ScrollPanel class="w-full h-80 m-b-2">
            <Message severity="success" class="w-full">{{ result }}</Message>
          </ScrollPanel>
        </div>
      </template>
    </Card>
  </div>
</template>
