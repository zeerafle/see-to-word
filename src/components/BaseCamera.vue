<script setup>
import { ref } from 'vue'
import { useLoadingStore } from '@/stores/loadingStore.js'
import IconButton from '@/components/IconButton.vue'

const loadingStore = useLoadingStore()
const isCameraOpen = ref(false)
const isPhotoTaken = ref(false)
const vttSrc = ref('')

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

// Helper function to convert base64 string to Blob
function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
}

const getDescription = async () => {
  loadingStore.setLoading(true)
  takePhoto()
  const canvas = document.querySelector('canvas')
  const image = canvas
    .toDataURL('image/jpg')
    .replace(/^data:image\/(png|jpg|jpeg);base64,/, '')

  const api_endpoint = import.meta.env.VITE_API_ENDPOINT

  const result = await fetch(`${api_endpoint}/describe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'base64_image': image
    }),
  })

  const data = await result.json()

  // Create a simple VTT file content for the description.
  // Adjust the timestamps as needed.
  const vttContent = `WEBVTT

00:00:00.000 --> 00:05:00.000
${data.translation}
`
  const vttBlob = new Blob([vttContent], { type: 'text/vtt' })
  vttSrc.value = URL.createObjectURL(vttBlob)

  if (data.audio) {
    const audioBlob = b64toBlob(data.audio, 'audio/wav')
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)
    audio.play()
  }
  loadingStore.setLoading(false)
}
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
          :click-handler="getDescription"
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
        >
            <track kind="captions" :src="vttSrc" label="Image Description" srclang="id" default />
        </video>
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
