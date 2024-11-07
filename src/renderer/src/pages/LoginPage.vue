<script setup lang="ts">
import { computed, ref } from 'vue'

import { Logger } from '@renderer/functions/logger'
import { useConfigStore } from '@renderer/stores/ConfigStore'
import Connector from '@renderer/functions/connector'

const config = useConfigStore()

const url = ref('')
const accessToken = ref('')

const urlValid = computed(() => {
  return url.value.match(/^(ws|wss):\/\/[^\s]+|^[a-zA-Z0-9.-]+:\d+$/g) ? true : false
})

const addToAccounts = () => {
  if (urlValid.value) {
    config.accounts.push({
      url: url.value,
      token: accessToken.value
    })
  }
}
const deleteAccount = (index: number) => {
  config.accounts.splice(index, 1)
}
const getAccount = (index: number) => {
  url.value = config.accounts[index].url
  accessToken.value = config.accounts[index].token
}

const login = () => {
  Logger.getInstance().info('Login')
  Connector.connect(url.value, accessToken.value)
}
</script>

<template>
  <div class="h-full flex flex-col flex-justify-center flex-items-center">
    <Card>
      <template #title>
        <div class="flex flex-justify-center">登录 Onebot</div>
      </template>
      <template #content>
        <div class="grid grid-cols-2 w-180">
          <div class="m-r-sm flex-grow">
            <ScrollPanel class="w-full h-45 p-sm">
              <TransitionGroup
                name="list"
                enter-active-class="fade-in-fwd"
                leave-active-class="fade-out-fwd"
              >
                <ButtonGroup v-for="(account, index) in config.accounts" :key="index">
                  <div class="w-full m-b-sm grid accounts-grid">
                    <Button class="h-10" severity="secondary" @click="getAccount(index)">
                      <div class="flex flex-items-center flex-justify-between w-full">
                        <i class="i-fluent-color-person-24 font-size-5" />
                        <div class="flex flex-col flex-items-end">
                          <div class="font-size-4">{{ account.url }}</div>
                          <div class="font-size-2">{{ account.token }}</div>
                        </div>
                      </div>
                    </Button>
                    <Button class="h-10" severity="danger" @click="deleteAccount(index)">
                      <i class="i-fluent-delete-24-regular font-size-5" />
                    </Button>
                  </div>
                </ButtonGroup>
              </TransitionGroup>
            </ScrollPanel>
          </div>
          <div class="m-l-sm flex-grow">
            <FloatLabel class="m-b-sm m-t-sm" variant="on">
              <IconField>
                <InputIcon class="i-fluent-color-person-24" />
                <InputText id="url" v-model="url" :invalid="!urlValid" class="w-full" />
              </IconField>
              <label for="url">Onebot URL</label>
            </FloatLabel>
            <FloatLabel class="m-b-sm" variant="on">
              <IconField>
                <InputIcon class="i-fluent-color-shield-24" />
                <InputText id="token" v-model="accessToken" class="w-full" />
              </IconField>
              <label for="token">Access Token (可选)</label>
            </FloatLabel>
            <Divider />
            <div class="flex flex-justify-center">
              <Button
                class="w-full m-r-sm"
                label="加入快捷登录"
                severity="secondary"
                icon="i-fluent-add-24-regular"
                :disabled="!urlValid"
                @click="addToAccounts"
              />
              <Button
                class="w-full"
                label="登录"
                icon="i-fluent-send-24-regular"
                :disabled="!urlValid"
                @click="login"
              />
            </div>
          </div>
        </div>
      </template>
      <template #footer> </template>
    </Card>
  </div>
</template>

<style scoped>
.accounts-grid {
  grid-gap: 0;
  grid-template-columns: 1fr auto;
}
</style>
