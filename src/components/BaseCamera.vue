<script setup>
import { ref, watch } from 'vue'
import IconButton from '@/components/IconButton.vue'

const isCameraOpen = ref(false)
const isPhotoTaken = ref(false)
const imageDescription = ref('')
const emit = defineEmits(['description-updated'])
watch(imageDescription, (newVal) => emit('description-updated', newVal))

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
  takePhoto()
  const canvas = document.querySelector('canvas')
  const image = canvas
    .toDataURL('image/jpg')
    .replace(/^data:image\/(png|jpg|jpeg);base64,/, '')
  const response = await fetch(
    'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + import.meta.env.VITE_HF_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: base64ToArrayBuffer(image),
    },
  )
  const data = await response.json()
  imageDescription.value = data[0].generated_text
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
          description="Deskripsikan Gambar"
          icon="robot"
        />
      </div>
      <div class="video-container">
        <video
          ref="camera"
          :height="337"
          :width="450"
          aria-label="A camera feed"
          autoplay
          class="camera-video"
          playsinline
        ></video>
        <canvas
          v-show="isPhotoTaken"
          id="photoTaken"
          ref="canvas"
          :height="337"
          :width="450"
          class="canvas-photo"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
