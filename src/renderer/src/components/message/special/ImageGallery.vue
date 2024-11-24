<script setup lang="ts">
import { computed, ref } from 'vue'
import MsgImage from '../basic/MsgImage.vue'
import ImgPreview from '@renderer/components/misc/ImgPreview.vue'

const { msg } = defineProps<{
  msg: { type: 'gallery'; images: string[] }
}>()

const showPreview = ref(false)
const showingImgIndex = ref(0)
const blobUrls = ref<string[]>([])

const splitedImg = computed(() => {
  const totalImages = msg.images.length
  const optimalRows = Math.ceil(Math.sqrt(totalImages))
  const imagesPerRow = Math.ceil(totalImages / optimalRows)

  const result: string[][] = []
  for (let i = 0; i < totalImages; i += imagesPerRow) {
    result.push(msg.images.slice(i, Math.min(i + imagesPerRow, totalImages)))
  }
  console.log(result)
  return result
})

const getSize = (rowImgCount: number) => {
  const maxLength = Math.max(...splitedImg.value.map((row) => row.length))
  const maxGapWidth = maxLength * 0.25
  const curWidth = 20 + maxGapWidth - (rowImgCount - 1) * 0.25

  return {
    width: `calc(${curWidth}rem / ${rowImgCount})`,
    height: `calc(${curWidth}rem / ${rowImgCount})`
  }
}

const getPreIndex = (rowIndex: number, imgIndex: number) => {
  return rowIndex * splitedImg.value[0].length + imgIndex
}

const openPreview = (index: number) => {
  showingImgIndex.value = index
  showPreview.value = true
}
</script>

<template>
  <div>
    <div v-for="(row, index) in splitedImg" :key="index" ref="urls" class="mb-1">
      <div class="flex flex-row justify-between gap-1">
        <div v-for="(img, i) in row" :key="i">
          <MsgImage
            v-model:blob-url="blobUrls[getPreIndex(index, i)]"
            :src="img"
            :rounded="false"
            :style="getSize(row.length)"
            class="object-cover max-h-40"
            @click="openPreview(getPreIndex(index, i))"
          />
        </div>
      </div>
    </div>
    <ImgPreview v-model="showPreview" :images="blobUrls" :index="showingImgIndex" />
  </div>
</template>
