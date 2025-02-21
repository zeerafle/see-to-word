<script setup>
import BaseCamera from '@/components/BaseCamera.vue'
import {ref} from 'vue'

const imageDescription = ref('')

const handleDescriptionUpdate = (newDescription) => {
  imageDescription.value = newDescription
}
</script>

<template>
  <BaseCamera @description-updated="handleDescriptionUpdate" />
</template>

<style scoped></style>
