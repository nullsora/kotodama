<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'
import { Friend, Group } from '@renderer/functions/types'

const runtimeData = inject('runtimeData') as DataManager

const props = defineProps<{
  chatInfo: {
    type: 'friend' | 'group'
    id: number
  } | null
}>()

const showInfo = ref(false)

const chat = computed(() => {
  if (props.chatInfo?.type === 'friend') {
    return runtimeData.user.value.contacts.friends.find(
      (friend) => friend.user_id === props.chatInfo?.id
    )
  } else if (props.chatInfo?.type === 'group') {
    return runtimeData.user.value.contacts.groups.find(
      (group) => group.group_id === props.chatInfo?.id
    )
  }
  return undefined
})

const chatName = computed(() => {
  if (props.chatInfo?.type === 'friend') {
    return {
      name:
        (chat.value as Friend)?.remark === ''
          ? (chat.value as Friend)?.nickname
          : (chat.value as Friend)?.remark
    }
  } else if (props.chatInfo?.type === 'group') {
    return {
      name: (chat.value as Group)?.group_name,
      memberCount: (chat.value as Group)?.member_count
    }
  }
  return { name: '' }
})

const avartarUrl = computed(() => {
  if (props.chatInfo?.type === 'friend') {
    return `https://q1.qlogo.cn/g?b=qq&s=0&nk=${props.chatInfo.id}`
  } else if (props.chatInfo?.type === 'group') {
    return `https://p.qlogo.cn/gh/${props.chatInfo.id}/${props.chatInfo.id}/640`
  } else return ''
})
</script>

<template>
  <div class="chat-info">
    <div>{{ chatName.name + (chatName.memberCount ? ` (${chatName.memberCount})` : '') }}</div>
    <Button
      icon="i-fluent-more-24-regular w-6 h-6"
      severity="secondary"
      text
      rounded
      @click="showInfo = !showInfo"
    />
    <Teleport defer to=".chat-panel">
      <Transition enter-active-class="slide-in-right" leave-active-class="slide-out-right">
        <div v-if="showInfo" class="chat-info-modal scrollbar scrollbar-w-1 scrollbar-rounded">
          <div class="info-card w-full p-sm gap-sm primary-border flex flex-row items-center">
            <img :src="avartarUrl" class="w-12 h-12 rounded-full" crossorigin="anonymous" />
            <div class="flex flex-col justify-center items-start gap-1">
              <div class="max-w-55 whitespace-nowrap overflow-hidden text-ellipsis">
                {{ chatName.name }}
              </div>
              <Tag class="chat-id" severity="secondary" :value="chatInfo?.id" rounded />
            </div>
          </div>
          <div
            class="info-card w-full mt-sm p-sm gap-sm primary-border flex flex-col justify-center"
          >
            <!--群聊成员-->
            <div v-if="props.chatInfo?.type === 'group'">
              <div class="text-sm">群聊成员</div>
              <div class="flex flex-row flex-wrap gap-1"></div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.chat-info {
  display: flex;
  width: 100%;
  height: 3rem;
  justify-content: space-between;
  align-items: center;

  padding: 0.8rem;
  padding-right: 0.3rem;
  color: black;

  border-bottom: 1px solid #e2e8f0;
  border-radius: 0.5rem 0.5rem 0 0;
}

.dark-mode .chat-info {
  color: white;

  border-bottom: 1px solid var(--p-gray-700);
}

.chat-info-modal {
  position: absolute;
  top: 3rem;
  right: 0;

  width: 22.5rem;
  height: calc(100vh - 7.5rem);

  box-shadow: -0.3rem 0 1rem rgba(0, 0, 0, 0.1);
  border-left: 1px solid #e2e8f0;
  border-radius: 0 0 0.5rem 0;

  background-color: var(--p-gray-100);

  padding: 0.875rem;
}

.dark-mode .chat-info-modal {
  border-left: 1px solid var(--p-gray-700);
  background-color: var(--p-gray-800);
}

.info-card {
  background-color: white;
}

.dark-mode .info-card {
  background-color: var(--p-gray-700);
  color: white;
}

.chat-id {
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
