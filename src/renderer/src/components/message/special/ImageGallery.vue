<script setup lang="ts">
import { computed, ref } from 'vue'
import MsgImage from '../basic/MsgImage.vue'
import ImgPreview from '@renderer/components/misc/ImgPreview.vue'
import { FileInfo } from '@renderer/functions/message/message_types'
import { packagedGetter } from '@renderer/functions/packaged_api'

const { msg } = defineProps<{
  msg: { type: 'gallery'; images: string[] }
}>()

const showPreview = ref(false)
const showingImgIndex = ref(0)

const localPaths = ref<FileInfo[] | null>(null)

const imgUrls = computed(() => {
  if (!localPaths.value) return msg.images
  else return localPaths.value.map((path) => path.file)
})

const parsedImgs = computed(() =>
  imgUrls.value.map((img) => {
    const { protocol } = new URL(img)
    return 'k-web-img:' + img.slice(protocol.length)
  })
)

const splitedImg = computed(() => {
  const totalImages = imgUrls.value.length
  const optimalRows = Math.ceil(Math.sqrt(totalImages))
  const imagesPerRow = Math.ceil(totalImages / optimalRows)

  const result: string[][] = []
  for (let i = 0; i < totalImages; i += imagesPerRow) {
    result.push(imgUrls.value.slice(i, Math.min(i + imagesPerRow, totalImages)))
  }
  return result
})

const getLocalPaths = async () => {
  localPaths.value = await Promise.all(
    msg.images.map((img) => packagedGetter.getMsg.imgPath(img).then((res) => res.data))
  )
}

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
      <div class="flex justify-between gap-1">
        <div v-for="(img, i) in row" :key="i">
          <MsgImage
            :src="img"
            :style="getSize(row.length)"
            class="object-cover max-h-40"
            @click="openPreview(getPreIndex(index, i)), getLocalPaths()"
          />
        </div>
      </div>
    </div>
    <ImgPreview v-model="showPreview" v-model:index="showingImgIndex" :images="parsedImgs" />
  </div>
</template>
