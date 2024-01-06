<script setup>
import {onMounted, ref} from 'vue'

const isCameraOpen = ref(false)
const isPhotoTaken = ref(false)

const createCameraElement = () => {
    const constraints = (window.constraints = {
        audio: false,
        video: {
            facingMode: 'environment',
        }
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

const downloadImage = () => {
    const canvas = document.querySelector('canvas')
    const image = canvas.toDataURL('image/jpg')
    const link = document.getElementById('downloadPhoto')
    link.href = image
}

onMounted(() => {
    createCameraElement()
})

</script>

<template>
  <div class="camera">
    <div class="wrapper">
      <button @click="this.$parent.showCamera = false" class="button-close">x</button>
      <button class="button" @click="toggleCamera()">
        <span v-if="!isCameraOpen">Open Camera</span>
        <span v-else>Close Camera</span>
      </button>
      <div class="video-container">
        <video class="camera-video" ref="camera" :width="450" :height="337" autoplay playsinline ></video>
<!--        <canvas id="photoTaken" v-show="isPhotoTaken" class="canvas-photo" ref="canvas" :width="450" :height="337"></canvas>-->
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