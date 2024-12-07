<script setup lang="ts">
import SettingItem from '@renderer/components/misc/SettingItem.vue'
import { useConfigStore } from '@renderer/stores/config_store'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import BackgroundSettings from './BackgroundSettings.vue'
import LoglevelSetting from './LoglevelSetting.vue'
import PrimaryColorSettings from './PrimaryColorSettings.vue'

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

const selectPath = async () => {
  // @ts-ignore - window is defined in preload
  const kotodama = window.kotodama
  const path = await kotodama.file.chooseDirectory()
  if (path.length > 0) {
    config.customSettings.message.localFacePath = path[0]
  }
}
</script>

<template>
  <div class="scrollbar scrollbar-w-1 scrollbar-rounded">
    <SettingItem title="窗口标题">
      <InputText v-model="config.windowTitle" />
    </SettingItem>
    <SettingItem class="mt-sm" title="本地表情位置">
      <div class="flex items-center">
        <InputText v-model="config.customSettings.message.localFacePath" />
        <Button class="ml-sm" label="选择" @click="selectPath()" />
        <Button
          class="ml-sm"
          label="重置"
          severity="danger"
          @click="config.customSettings.message.localFacePath = ''"
        />
      </div>
    </SettingItem>
    <LoglevelSetting />
    <PrimaryColorSettings />
    <BackgroundSettings />
    <SettingItem class="mt-sm" title="RESET" description="重置所有设置">
      <Button label="重置" severity="danger" @click="confirmResetConfig($event)" />
    </SettingItem>
  </div>
</template>
