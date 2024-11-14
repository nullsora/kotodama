<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import { Chat, Friend, Group } from '@renderer/functions/types'
import SelectIcon from './SelectIcon.vue'
import FadeTransition from '../misc/FadeTransition.vue'
import ContactCard from '../contact/ContactCard.vue'

const runtimeData = inject('runtimeData') as DataManager

const show = defineModel<boolean>('show')
const props = defineProps<{
  edit?: {
    edit: boolean
    index: number
  }
}>()

const newContactGroupInfo = ref({
  name: '',
  iconClass: 'i-fluent-color-library-24',
  chats: [] as Chat[]
})
const selectedPanel = ref<'friends' | 'groups' | 'manage'>('friends')

const canEmit = computed(() => {
  return (
    newContactGroupInfo.value.name &&
    newContactGroupInfo.value.chats.length > 0 &&
    newContactGroupInfo.value.iconClass
  )
})

const checkChatInList = (chat: Chat) => {
  return (
    newContactGroupInfo.value.chats.find((c) => {
      if (c.type !== chat.type) return false

      if (c.type === 'private') return (c.data as Friend).user_id === (chat.data as Friend).user_id
      else if (c.type === 'group')
        return (c.data as Group).group_id === (chat.data as Group).group_id

      return false
    }) !== undefined
  )
}

const toggleSelection = (chat: Chat) => {
  if (checkChatInList(chat)) {
    newContactGroupInfo.value.chats = newContactGroupInfo.value.chats.filter((c) => {
      if (c.type !== chat.type) return true

      if (c.type === 'private') return (c.data as Friend).user_id !== (chat.data as Friend).user_id
      else if (c.type === 'group')
        return (c.data as Group).group_id !== (chat.data as Group).group_id

      return true
    })
  } else {
    newContactGroupInfo.value.chats.push(chat)
  }
}

const quit = () => {
  newContactGroupInfo.value = {
    name: '',
    iconClass: 'i-fluent-color-library-24',
    chats: []
  }
  show.value = false
}

const submitGroup = async () => {
  if (props.edit?.edit) {
    runtimeData.user.value.contactGroups[props.edit.index] = {
      name: newContactGroupInfo.value.name,
      iconClass: newContactGroupInfo.value.iconClass,
      chats: newContactGroupInfo.value.chats
    }
    quit()
    return
  }
  for (const chat of newContactGroupInfo.value.chats) {
    if (chat.type === 'private') {
      await runtimeData.pushFriend((chat.data as Friend).user_id)
    } else if (chat.type === 'group') {
      await runtimeData.pushGroup((chat.data as Group).group_id)
    }
  }
  await runtimeData.updateInfo()
  runtimeData.user.value.contactGroups.push({
    name: newContactGroupInfo.value.name,
    iconClass: newContactGroupInfo.value.iconClass,
    chats: newContactGroupInfo.value.chats
  })
  quit()
}

onMounted(() => {
  if (props.edit?.edit) {
    newContactGroupInfo.value = {
      name: runtimeData.user.value.contactGroups[props.edit.index].name,
      iconClass: runtimeData.user.value.contactGroups[props.edit.index].iconClass,
      chats: runtimeData.user.value.contactGroups[props.edit.index].chats
    }
  }
})

watch(
  () => props.edit,
  () => {
    if (props.edit?.edit) {
      newContactGroupInfo.value = {
        name: runtimeData.user.value.contactGroups[props.edit.index].name,
        iconClass: runtimeData.user.value.contactGroups[props.edit.index].iconClass,
        chats: runtimeData.user.value.contactGroups[props.edit.index].chats
      }
    }
  }
)
</script>

<template>
  <Dialog v-model:visible="show" :closable="false" modal class="w-2/5">
    <template #header>
      <div class="text-xl font-bold">新建分组</div>
    </template>
    <div class="mb-sm mt-sm flex flex-row justify-between items-center gap-2">
      <FloatLabel class="w-full" variant="on">
        <InputText
          id="token"
          v-model="newContactGroupInfo.name"
          :invalid="!newContactGroupInfo.name"
          class="w-full"
        />
        <label for="token">分组名称</label>
      </FloatLabel>
      <SelectIcon v-model:icon-class="newContactGroupInfo.iconClass" />
    </div>
    <div class="w-full flex justify-center items-center mb-2">
      <ButtonGroup class="w-full mt-2">
        <Button
          class="w-1/3"
          :severity="selectedPanel === 'friends' ? 'primary' : 'secondary'"
          size="small"
          label="好友"
          rounded
          @click="selectedPanel = 'friends'"
        />
        <Button
          class="w-1/3"
          :severity="selectedPanel === 'groups' ? 'primary' : 'secondary'"
          size="small"
          label="群聊"
          rounded
          @click="selectedPanel = 'groups'"
        />
        <Button
          class="w-1/3"
          :severity="selectedPanel === 'manage' ? 'primary' : 'secondary'"
          size="small"
          label="已选"
          rounded
          @click="selectedPanel = 'manage'"
        />
      </ButtonGroup>
    </div>
    <FadeTransition>
      <div
        v-if="selectedPanel === 'friends'"
        class="primary-border p-sm max-h-40vh overflow-y-auto scrollbar scrollbar-w-1 scrollbar-rounded"
      >
        <div
          v-for="(friend, index) in runtimeData.user.value.contacts.friends"
          :key="index"
          class="mb-2"
          @click="toggleSelection({ type: 'private', data: friend })"
        >
          <ContactCard
            :contact="{
              type: 'private',
              data: friend
            }"
            :selected="checkChatInList({ type: 'private', data: friend })"
          />
        </div>
      </div>
      <div
        v-else-if="selectedPanel === 'groups'"
        class="primary-border p-sm max-h-40vh overflow-y-auto scrollbar scrollbar-w-1 scrollbar-rounded"
      >
        <div
          v-for="(group, index) in runtimeData.user.value.contacts.groups"
          :key="index"
          class="mb-2"
          @click="toggleSelection({ type: 'group', data: group })"
        >
          <ContactCard
            :contact="{
              type: 'group',
              data: group
            }"
            :selected="checkChatInList({ type: 'group', data: group })"
          />
        </div>
      </div>
      <div
        v-else-if="selectedPanel === 'manage'"
        class="primary-border p-sm h-40vh overflow-y-auto scrollbar scrollbar-w-1 scrollbar-rounded"
      >
        <div
          v-for="(chat, index) in newContactGroupInfo.chats"
          :key="index"
          class="mb-2"
          @click="toggleSelection(chat)"
        >
          <ContactCard :contact="chat" :selected="true" />
        </div>
      </div>
    </FadeTransition>
    <template #footer>
      <Button class="w-full" severity="secondary" size="small" rounded @click="quit"> 取消 </Button>
      <Button
        :disabled="!canEmit"
        class="w-full"
        severity="primary"
        size="small"
        rounded
        @click="submitGroup"
      >
        确定
      </Button>
    </template>
  </Dialog>
</template>
