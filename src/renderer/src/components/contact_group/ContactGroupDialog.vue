<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import { Chat } from '@renderer/functions/types'
import SelectIcon from './SelectIcon.vue'
import ContactCard from '../contact/ContactCard.vue'
import FadeTransition from '../misc/FadeTransition.vue'

const runtimeData = inject('runtimeData') as DataManager

const show = defineModel<boolean>('show')
const { edit } = defineProps<{
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

const checkSameChat = (chat1: Chat, chat2: Chat) => {
  if (chat1.type === 'friend' && chat2.type === 'friend') {
    return chat1.data.user_id === chat2.data.user_id
  } else if (chat1.type === 'group' && chat2.type === 'group') {
    return chat1.data.group_id === chat2.data.group_id
  } else return false
}

const checkChatInList = (chat: Chat) => {
  return newContactGroupInfo.value.chats.find((c) => checkSameChat(c, chat)) !== undefined
}

const toggleSelection = (chat: Chat) => {
  if (checkChatInList(chat)) {
    newContactGroupInfo.value.chats = newContactGroupInfo.value.chats.filter(
      (c) => !checkSameChat(c, chat)
    )
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
  if (edit?.edit) {
    runtimeData.user.value.contactGroups[edit.index] = {
      name: newContactGroupInfo.value.name,
      iconClass: newContactGroupInfo.value.iconClass,
      chats: newContactGroupInfo.value.chats
    }
    quit()
    return
  }
  for (const chat of newContactGroupInfo.value.chats) {
    if (chat.type === 'friend') {
      await runtimeData.addToList.private(chat.data.user_id)
    } else if (chat.type === 'group') {
      await runtimeData.addToList.group(chat.data.group_id)
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

const updateInfo = () => {
  if (edit?.edit) {
    newContactGroupInfo.value = {
      name: runtimeData.user.value.contactGroups[edit.index].name,
      iconClass: runtimeData.user.value.contactGroups[edit.index].iconClass,
      chats: runtimeData.user.value.contactGroups[edit.index].chats
    }
  }
}

onMounted(updateInfo)
watch(() => edit, updateInfo)
</script>

<template>
  <Dialog v-model:visible="show" :closable="false" modal class="w-2/5">
    <template #header>
      <div class="text-xl font-bold">新建分组</div>
    </template>
    <div class="mb-sm mt-sm flex justify-between items-center gap-2">
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
          v-for="(friend, index) in runtimeData.curContacts.friends"
          :key="index"
          class="mb-2"
          @click="toggleSelection({ type: 'friend', data: friend })"
        >
          <ContactCard
            :contact="{
              type: 'friend',
              data: friend
            }"
            :selected="checkChatInList({ type: 'friend', data: friend })"
          />
        </div>
      </div>
      <div
        v-else-if="selectedPanel === 'groups'"
        class="primary-border p-sm max-h-40vh overflow-y-auto scrollbar scrollbar-w-1 scrollbar-rounded"
      >
        <div
          v-for="(group, index) in runtimeData.curContacts.groups"
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
