<script setup lang="ts">
import { inject, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useConfirm } from 'primevue/useconfirm'

import { DataManager } from '@renderer/functions/data_manager'

import SelfInfo from '../chat/SelfInfo.vue'
import ContactGroup from '../contact_group/ContactGroup.vue'
import ContactGroupDialog from '../contact_group/ContactGroupDialog.vue'

const runtimeData = inject('runtimeData') as DataManager

const confirm = useConfirm()

const selectedGroupId = defineModel<number>('selectedGroupId')

const showContactGroupDialog = ref(false)
const showEditDialog = ref({
  show: false,
  edit: undefined as
    | {
        edit: boolean
        index: number
      }
    | undefined
})

const deleteContactGroup = (index: number, event: Event) => {
  confirm.require({
    target: event.target as HTMLElement,
    message: '确定要删除这个分组吗？',
    icon: 'i-fluent-warning-24-regular',
    acceptProps: {
      label: '确定',
      severity: 'danger'
    },
    rejectProps: {
      label: '取消',
      severity: 'secondary'
    },
    accept: () => {
      runtimeData.user.value.contactGroups.splice(index, 1)
    }
  })
}
</script>

<template>
  <div class="sidebar glassmorphism">
    <div class="flex flex-col justify-start items-center gap-2">
      <ContactGroup
        group-name="所有对话"
        icon-class="i-fluent-color-chat-multiple-24"
        :selected="selectedGroupId === -1"
        @click="selectedGroupId = -1"
      />
      <ContactGroup
        v-for="(group, index) in runtimeData.user.value.contactGroups"
        :key="index"
        :group-name="group.name"
        :icon-class="group.iconClass"
        :selected="selectedGroupId === index"
        @click="selectedGroupId = index"
      />
      <ContactGroup
        group-name="编辑分组"
        icon-class="i-fluent-color-edit-24"
        :selected="false"
        @click="showContactGroupDialog = true"
      />
    </div>
    <SelfInfo />
    <Dialog v-model:visible="showContactGroupDialog" modal class="w-2/5">
      <template #header>
        <div class="text-xl font-bold">对话分组</div>
      </template>
      <div class="text-xs text-gray-500 w-full">
        为不同的对话与群组创建分组，以便在它们之间快速切换。
      </div>
      <Divider />
      <div class="primary-border p-sm">
        <div class="font-bold mb-2 primary-text">分组列表</div>
        <div class="mb-2 text-xs primary-text">拖动以改变顺序</div>
        <div class="p-2 h-40vh scrollbar scrollbar-w-1 scrollbar-rounded">
          <VueDraggable v-model="runtimeData.user.value.contactGroups">
            <div
              v-for="(group, index) in runtimeData.user.value.contactGroups"
              :key="index"
              v-ripple
              class="flex flex-row justify-between items-center gap-2 mb-2 select-none"
            >
              <div class="flex flex-row items-center gap-2">
                <i class="pi" :class="group.iconClass" />
                <div class="primary-text">{{ group.name }}</div>
              </div>
              <div class="flex flex-row justify-end items-center gap-2">
                <Button
                  icon="i-fluent-edit-24-regular"
                  text
                  @click="
                    showEditDialog = {
                      show: true,
                      edit: {
                        edit: true,
                        index
                      }
                    }
                  "
                />
                <Button
                  icon="i-fluent-delete-24-regular"
                  text
                  severity="danger"
                  @click="deleteContactGroup(index, $event)"
                />
              </div>
            </div>
          </VueDraggable>
        </div>
      </div>
      <template #footer>
        <Button
          class="w-full"
          severity="secondary"
          rounded
          @click="
            showEditDialog = {
              show: true,
              edit: undefined
            }
          "
        >
          <div class="flex flex-row items-center gap-2">
            <i class="i-fluent-color-add-circle-24 text-size-5" />
            新建分组
          </div>
        </Button>
      </template>
    </Dialog>
    <ContactGroupDialog v-model:show="showEditDialog.show" :edit="showEditDialog.edit" />
    <ConfirmPopup></ConfirmPopup>
  </div>
</template>

<style scoped>
.sidebar {
  padding: 0.5rem 0.5rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  height: 100%;
}

.primary-text {
  color: var(--p-primary-500);
}
</style>
