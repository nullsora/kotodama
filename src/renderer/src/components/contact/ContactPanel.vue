<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import { Chat, Friend, Group } from '@renderer/functions/types'
import ContactCard from './ContactCard.vue'

const runtimeData = inject('runtimeData') as DataManager

const selectedContact = defineModel<{
  type: 'friend' | 'group'
  id: number
} | null>('selectedContact')

const selectedPanel = ref<'friends' | 'groups'>('friends')

const enterAnimation = computed(() => {
  if (selectedPanel.value === 'friends') {
    return 'slide-in-left'
  } else {
    return 'slide-in-right'
  }
})

const leaveAnimation = computed(() => {
  if (selectedPanel.value === 'friends') {
    return 'slide-out-right'
  } else {
    return 'slide-out-left'
  }
})

const getSelected = (chat: Chat) => {
  if (selectedContact.value?.type === 'friend') {
    return selectedContact.value.id === (chat.data as Friend).user_id
  } else if (selectedContact.value?.type === 'group') {
    return selectedContact.value.id === (chat.data as Group).group_id
  } else return false
}
</script>

<template>
  <div class="h-full primary-border p-2 overflow-hidden">
    <div class="w-full flex justify-center items-center mb-2">
      <ButtonGroup class="w-1/2 mt-2">
        <Button
          class="w-1/2"
          :severity="selectedPanel === 'friends' ? 'primary' : 'secondary'"
          size="small"
          label="好友"
          rounded
          @click="selectedPanel = 'friends'"
        />
        <Button
          class="w-1/2"
          :severity="selectedPanel === 'groups' ? 'primary' : 'secondary'"
          size="small"
          label="群聊"
          rounded
          @click="selectedPanel = 'groups'"
        />
      </ButtonGroup>
    </div>
    <Transition :enter-active-class="enterAnimation" :leave-active-class="leaveAnimation">
      <KeepAlive>
        <div
          v-if="selectedPanel === 'friends'"
          class="w-full calc-height p-2 scrollbar scrollbar-w-1 scrollbar-rounded"
        >
          <Accordion :value="[]" multiple>
            <AccordionPanel
              v-for="(categories, index) in runtimeData.user.value.contacts.friendsCategories"
              :key="index"
              :value="index"
            >
              <AccordionHeader>
                <span class="text-sm">
                  {{ categories.categoryName }} ({{ categories.buddyList.length }})
                </span>
              </AccordionHeader>
              <AccordionContent>
                <div
                  v-for="(friend, friendIndex) in categories.buddyList"
                  :key="friendIndex"
                  class="m-b-2 w-full"
                >
                  <ContactCard
                    :contact="{ type: 'private', data: friend }"
                    :selected="getSelected({ type: 'private', data: friend })"
                    @click="selectedContact = { type: 'friend', id: friend.user_id }"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>

        <div
          v-else-if="selectedPanel === 'groups'"
          class="w-full calc-height primary-border p-2 scrollbar scrollbar-w-1 scrollbar-rounded"
        >
          <ContactCard
            v-for="group in runtimeData.user.value.contacts.groups"
            :key="group.group_id"
            class="m-b-2"
            :contact="{ type: 'group', data: group }"
            :selected="getSelected({ type: 'group', data: group })"
            @click="selectedContact = { type: 'group', id: group.group_id }"
          />
        </div>
      </KeepAlive>
    </Transition>
  </div>
</template>

<style scoped>
.calc-height {
  height: calc(100vh - 8.3rem);
}
</style>
