import { Pages } from '@renderer/functions/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStatusStore = defineStore('status', () => {
  const currentPage = ref(Pages.Login)
  const sendingText = ref('')
  const localFaceList = ref<{ category: string; faces: string[] }[]>([])

  return {
    currentPage,
    sendingText,
    localFaceList
  }
})
