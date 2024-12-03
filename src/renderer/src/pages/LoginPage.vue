<script setup lang="ts">
import { computed, ref } from 'vue'

import { Logger } from '@renderer/functions/logger'
import { useConfigStore } from '@renderer/stores/config_store'
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
  <div class="h-full rd-lg gradient">
    <div class="h-full w-full">
      <div class="h-full flex flex-col justify-center items-center">
        <Card>
          <template #title>
            <div class="flex flex-col justify-start items-center gap-sm">
              <i class="pi i-fluent-iot-24-filled w-15 h-15 gray-text" />
              连接 Onebot
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-sm items-center justify-between w-full">
              <div class="calc-height w-full p-2 scrollbar scrollbar-w-1 scrollbar-rounded">
                <TransitionGroup
                  name="list"
                  enter-active-class="fade-in-fwd"
                  leave-active-class="fade-out-bck"
                >
                  <ButtonGroup v-for="(account, index) in config.accounts" :key="index">
                    <div class="w-full grid accounts-grid mb-2">
                      <Button class="h-10" severity="secondary" @click="getAccount(index)">
                        <div class="flex items-center justify-between w-full">
                          <i class="i-fluent-color-person-24 font-size-5" />
                          <div class="flex flex-col items-end">
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
              </div>
              <div class="w-80 ml-sm flex-grow">
                <FloatLabel class="mb-sm mt-sm" variant="on">
                  <IconField>
                    <InputIcon class="i-fluent-color-person-24" />
                    <InputText id="url" v-model="url" :invalid="!urlValid" class="w-full" />
                  </IconField>
                  <label for="url">Onebot URL</label>
                </FloatLabel>
                <FloatLabel class="mb-sm" variant="on">
                  <IconField>
                    <InputIcon class="i-fluent-color-shield-24" />
                    <InputText id="token" v-model="accessToken" class="w-full" />
                  </IconField>
                  <label for="token">Access Token (可选)</label>
                </FloatLabel>
                <Divider />
                <div class="flex justify-center">
                  <Button
                    class="w-full mr-sm"
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
    </div>
  </div>
</template>

<style scoped>
.accounts-grid {
  grid-gap: 0;
  grid-template-columns: 1fr auto;
}

.calc-height {
  max-height: calc(100vh - 25rem);
}

.gradient {
  background-color: #d299c2;
  background-image: radial-gradient(closest-side, #a18cd1ff, #fbc2eb00),
    radial-gradient(closest-side, #a1c4fdff, #c2e9fb00),
    radial-gradient(closest-side, #fccb90ff, #d57eeb00),
    radial-gradient(closest-side, #4facfeff, #00f2fe00),
    radial-gradient(closest-side, #fa709aff, #fee14000);
  background-size:
    130vmax 130vmax,
    80vmax 80vmax,
    90vmax 90vmax,
    110vmax 110vmax,
    90vmax 90vmax;
  background-position:
    -80vmax -80vmax,
    60vmax -30vmax,
    10vmax 10vmax,
    -30vmax -10vmax,
    50vmax 50vmax;
  background-repeat: no-repeat;
  animation: 10s movement linear infinite;
}

.gradient::after {
  content: '';
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(10px);
}

@keyframes movement {
  0%,
  100% {
    background-size:
      130vmax 130vmax,
      80vmax 80vmax,
      90vmax 90vmax,
      110vmax 110vmax,
      90vmax 90vmax;
    background-position:
      -80vmax -80vmax,
      60vmax -30vmax,
      10vmax 10vmax,
      -30vmax -10vmax,
      50vmax 50vmax;
  }
  25% {
    background-size:
      100vmax 100vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      60vmax 60vmax;
    background-position:
      -60vmax -90vmax,
      50vmax -40vmax,
      0vmax -20vmax,
      -40vmax -20vmax,
      40vmax 60vmax;
  }
  50% {
    background-size:
      80vmax 80vmax,
      110vmax 110vmax,
      80vmax 80vmax,
      60vmax 60vmax,
      80vmax 80vmax;
    background-position:
      -50vmax -70vmax,
      40vmax -30vmax,
      10vmax 0vmax,
      20vmax 10vmax,
      30vmax 70vmax;
  }
  75% {
    background-size:
      90vmax 90vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      70vmax 70vmax;
    background-position:
      -50vmax -40vmax,
      50vmax -30vmax,
      20vmax 0vmax,
      -10vmax 10vmax,
      40vmax 60vmax;
  }
}
</style>
