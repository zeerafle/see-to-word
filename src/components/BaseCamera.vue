<script setup>
import { onMounted, ref } from 'vue'

const isCameraOpen = ref(false)
const isPhotoTaken = ref(false)

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
        Authorization: 'Bearer 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',
        'Content-Type': 'application/json',
      },
      body: base64ToArrayBuffer(image),
    },
  )
  const data = await response.json()
  console.log(data)
}

const downloadImage = () => {
  const canvas = document.querySelector('canvas')
  const image = canvas.toDataURL('image/jpg')
  const link = document.getElementById('downloadPhoto')
  link.href = image
}

onMounted(() => {
  createCameraElement()
})

// setInterval(() => runInference(), 5000)
</script>

<template>
  <div class="camera">
    <div class="wrapper">
      <button @click="this.$parent.showCamera = false" class="button-close">
        x
      </button>
      <button class="button" @click="toggleCamera()">
        <span v-if="!isCameraOpen">Open Camera</span>
        <span v-else>Close Camera</span>
      </button>
      <button @click="runInference()" class="button">Run Inference</button>
      <div class="video-container">
        <video
          class="camera-video"
          ref="camera"
          :width="450"
          :height="337"
          autoplay
          playsinline
        ></video>
        <canvas
          id="photoTaken"
          v-show="isPhotoTaken"
          class="canvas-photo"
          ref="canvas"
          :width="450"
          :height="337"
        ></canvas>
      </div>
      <!--      <button class="button" @click="takePhoto">-->
      <!--        <span>Snap!</span>-->
      <!--      </button>-->
      <!--      <button class="camera-download">-->
      <!--        <a id="downloadPhoto" download="VueRocksPhoto.jpg" class="button" role="button" @click="downloadImage">-->
      <!--          Download-->
      <!--        </a>-->
      <!--      </button>-->
    </div>
  </div>
</template>

<style scoped>
.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
