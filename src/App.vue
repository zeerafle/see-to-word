<script setup>
import BaseCamera from '@/components/BaseCamera.vue'
import ImageDescription from '@/components/ImageDescription.vue'
import {ref} from 'vue'

const imageDescription = ref('')

const handleDescriptionUpdate = (newDescription) => {
  imageDescription.value = newDescription
}
</script>

<template>
  <BaseCamera @description-updated="handleDescriptionUpdate" />
  <ImageDescription :image-description="imageDescription" />
</template>

<style scoped></style>
