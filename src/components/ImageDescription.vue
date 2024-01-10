<script setup>
import {ref, toRef, watch} from 'vue'

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
  const url = '/translate'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'text': [text],
      'sourceLang': 'EN',
      'targetLang': 'ID',
    })
  })
  const data = await response.json()
  console.log(data)
  return data.translations[0].text
}
</script>

<template>
  <div class="description-box">
    <p>{{ translatedDescription }}</p>
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
  background-color: rgba(0,0,0,0.5);
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