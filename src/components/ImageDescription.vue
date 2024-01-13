<script setup>
import { ref, toRef, watch } from 'vue'
import { useLoadingStore } from '@/stores/loadingStore.js'

const loadingStore = useLoadingStore()
const props = defineProps({
  imageDescription: {
    type: String,
    required: true,
  },
})

const imageDescription = toRef(props, 'imageDescription')
const translatedDescription = ref('')

watch(imageDescription, async (newVal) => {
  translatedDescription.value = await translate(newVal)
})

const translate = async (text) => {
  const url = `https://deepl-backend.fly.dev/?text=${text}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  loadingStore.setLoading(false)
  return data.text
}
</script>

<template>
  <div class="description-box">
    <p aria-live="assertive">{{ translatedDescription }}</p>
  </div>
</template>

<style scoped>
p {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
}

.description-box {
  width: 100%;
  position: fixed;
  bottom: 2em;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
</style>
