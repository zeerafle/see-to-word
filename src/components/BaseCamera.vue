<script setup>
import { ref, watch } from 'vue'
import { useLoadingStore } from '@/stores/loadingStore.js'
import IconButton from '@/components/IconButton.vue'
import { BlobServiceClient } from '@azure/storage-blob'
import createClient from '@azure-rest/ai-vision-image-analysis'
import { AzureKeyCredential } from '@azure/core-auth'

const loadingStore = useLoadingStore()
const isCameraOpen = ref(false)
const isPhotoTaken = ref(false)
const imageDescription = ref('')
const emit = defineEmits(['description-updated'])
watch(imageDescription, (newVal) => emit('description-updated', newVal))

// azure blob storage
const blobSasUrl = import.meta.env.VITE_BLOB_SERVICE_SAS_URL
const blobServiceClient = new BlobServiceClient(blobSasUrl)
const containerName = 'image-blobs'
const containerClient = blobServiceClient.getContainerClient(containerName)

const uploadFiles = async (file, fileName) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName)
    const uploadBlobResponse = await blockBlobClient.upload(
      file,
      file.byteLength,
    )
    console.log(
      `Upload block blob ${fileName} successfully`,
      uploadBlobResponse.requestId,
    )
    return blockBlobClient.url
  } catch (error) {
    console.log(error.message)
  }
}

// image analysis
const endpoint = import.meta.env.VITE_COGNITIVE_SERVICE_ENDPOINT
const key = import.meta.env.VITE_COGNITIVE_SERVICE_KEY
const credential = new AzureKeyCredential(key)
const client = new createClient(endpoint, credential)
const features = ['Caption', 'Read']

const analyzeImageFromUrl = async (imageUrl) => {
  return client.path('/imageanalysis:analyze').post({
    body: {
      url: imageUrl,
    },
    queryParameters: {
      features: features,
    },
    contentType: 'application/json',
  })
}

const createCameraElement = () => {
  const constraints = (window.constraints = {
    audio: false,
    video: {
      facingMode: 'environment',
    },
  })

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const video = document.querySelector('video')
      video.srcObject = stream
      video.onloadedmetadata = () => {
        video.width = video.videoWidth
        video.height = video.videoHeight
      }
      video.play()
    })
    .catch((error) => {
      console.error('Error accessing media devices.', error)
      alert('Error accessing media devices.' + error.message)
    })
}

const toggleCamera = () => {
  isCameraOpen.value = !isCameraOpen.value
  if (isCameraOpen.value) {
    createCameraElement()
  } else {
    const video = document.querySelector('video')
    video.srcObject.getTracks().forEach((track) => track.stop())
  }
}

const takePhoto = () => {
  const canvas = document.querySelector('canvas')
  const video = document.querySelector('video')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d').drawImage(video, 0, 0)
  isPhotoTaken.value = true
}

const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; ++i) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

const runInference = async () => {
  loadingStore.setLoading(true)
  takePhoto()
  const canvas = document.querySelector('canvas')
  const image = canvas
    .toDataURL('image/jpg')
    .replace(/^data:image\/(png|jpg|jpeg);base64,/, '')
  const arrayBuffer = base64ToArrayBuffer(image)
  const fileName = 'image-' + Date.now() + '.jpg'
  const imageUrl = await uploadFiles(arrayBuffer, fileName)
  const data = await analyzeImageFromUrl(imageUrl)
  let text = data.body.captionResult.text
  if (data.body.readResult.length > 0) {
    text +=
      '. And there is text says ' +
      data.body.readResult.blocks.map((line) => line).join(' ')
  }
  imageDescription.value = text
  loadingStore.setLoading(false)
}

// setInterval(() => runInference(), 5000)
</script>

<template>
  <div class="camera">
    <div class="wrapper">
      <div class="buttons">
        <IconButton
          :click-handler="toggleCamera"
          :description="isCameraOpen ? 'Hentikan Kamera' : 'Buka Kamera'"
          :icon="isCameraOpen ? 'circle-stop' : 'camera'"
        />
        <IconButton
          :click-handler="runInference"
          :need-loading="true"
          description="Deskripsikan Gambar"
          icon="robot"
        />
      </div>
      <div class="video-container">
        <video
          ref="camera"
          aria-label="A camera feed"
          autoplay
          class="camera-video"
          playsinline
        ></video>
        <canvas
          v-show="isPhotoTaken"
          id="photoTaken"
          ref="canvas"
          class="canvas-photo"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.canvas-photo {
  display: none;
}

.buttons {
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  justify-content: center;
  padding: 10px;
}
</style>
