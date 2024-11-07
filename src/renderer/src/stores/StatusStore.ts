import { UserInfo } from '@renderer/functions/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStatusStore = defineStore('status', () => {
  const user = ref<UserInfo | null>(null)

  return {
    user
  }
})
