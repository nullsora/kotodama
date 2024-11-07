<script setup lang="ts">
import { ref } from 'vue'

import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

import { useConfigStore } from '@renderer/stores/ConfigStore'
import SettingItem from '@renderer/components/misc/SettingItem.vue'
import DebugWS from '@renderer/components/misc/DebugWS.vue'
import localforage from 'localforage'

const confirm = useConfirm()
const toast = useToast()

const config = useConfigStore()

const currentSettingItem = ref('General')

const menuItems = ref([
  {
    label: '设置',
    items: [
      {
        label: '通用设置',
        icon: 'i-fluent-settings-24-regular',
        command: () => {
          currentSettingItem.value = 'General'
        }
      }
    ]
  },
  {
    label: 'Debug',
    items: [
      {
        label: 'Websocket Debug',
        icon: 'i-fluent-globe-24-regular',
        command: () => {
          currentSettingItem.value = 'WS'
        }
      }
    ]
  }
])

const confirmResetConfig = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: '确定要重置所有设置吗？',
    icon: 'i-fluent-warning-24-regular',
    rejectProps: {
      label: '取消',
      severity: 'secondary'
    },
    acceptProps: {
      label: '确定',
      severity: 'danger'
    },
    accept: () => {
      config.$reset()
      toast.add({
        severity: 'success',
        summary: '重置成功',
        detail: '所有设置已重置',
        group: 'br',
        life: 3000
      })
    }
  })
}
const confirmClearAll = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: '确定要重置所有设置吗？',
    icon: 'i-fluent-warning-24-regular',
    rejectProps: {
      label: '取消',
      severity: 'secondary'
    },
    acceptProps: {
      label: '确定',
      severity: 'danger'
    },
    accept: async () => {
      config.$reset()
      config.clearUserSettings()
      await localforage.clear()
      toast.add({
        severity: 'success',
        summary: '重置成功',
        detail: '所有设置已重置',
        group: 'br',
        life: 3000
      })
    }
  })
}
</script>

<template>
  <div class="flex flex-row h-full p-2">
    <div class="flex-1 w-full m-r-2">
      <Menu class="h-full" :model="menuItems" />
    </div>
    <div class="flex-3 w-full">
      <ScrollPanel v-if="currentSettingItem === 'General'">
        <SettingItem :title="'窗口标题'" :description="'设置窗口标题'">
          <InputText v-model="config.windowTitle" />
        </SettingItem>
        <SettingItem class="m-t-sm" :title="'RESET'" :description="'重置所有设置'">
          <Button label="重置" severity="danger" @click="confirmResetConfig($event)" />
        </SettingItem>
        <SettingItem class="m-t-sm" :title="'CLEAR ALL'" :description="'CLEAR ALL'">
          <Button label="CLEAR" severity="danger" @click="confirmClearAll($event)" />
        </SettingItem>
      </ScrollPanel>

      <DebugWS v-else-if="currentSettingItem === 'WS'" />
    </div>
    <Toast position="bottom-right" group="br" />
    <ConfirmPopup />
  </div>
</template>
