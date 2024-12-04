<script setup lang="ts">
import SettingItem from '@renderer/components/misc/SettingItem.vue'
import BackgroundSettings from '@renderer/components/settings/General/BackgroundSettings.vue'
import PrimaryColorSettings from '@renderer/components/settings/General/PrimaryColorSettings.vue'
import { useConfigStore } from '@renderer/stores/config_store'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const config = useConfigStore()

const confirm = useConfirm()
const toast = useToast()

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
</script>

<template>
  <div class="scrollbar scrollbar-w-1 scrollbar-rounded">
    <SettingItem :title="'窗口标题'" :description="'设置窗口标题'">
      <InputText v-model="config.windowTitle" />
    </SettingItem>
    <PrimaryColorSettings />
    <BackgroundSettings />
    <SettingItem class="mt-sm" :title="'RESET'" :description="'重置所有设置'">
      <Button label="重置" severity="danger" @click="confirmResetConfig($event)" />
    </SettingItem>
  </div>
</template>
