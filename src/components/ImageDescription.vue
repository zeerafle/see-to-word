<script setup>
import { toRef } from 'vue'

const props = defineProps({
  imageDescription: {
    type: String,
    required: true,
  },
})

const imageDescription = toRef(props, 'imageDescription')

// watch(imageDescription, async (newVal) => {
//   translatedDescription.value = await translate(newVal)
//   loadingStore.setLoading(false)
//   await synthesizeSpeech(translatedDescription.value)
// })

// async function synthesizeSpeech(text) {
//   const speechConfig = sdk.SpeechConfig.fromSubscription(
//     import.meta.env.VITE_AZURE_SPEECH_KEY,
//     region,
//   )
//   speechConfig.speechSynthesisVoiceName = 'id-ID-GadisNeural'
//   const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput()
//   const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)

//   synthesizer.speakTextAsync(
//     text,
//     (result) => {
//       if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
//         const audioData = result.audioData
//         const audioBlob = new Blob([audioData], { type: 'audio/wav' })
//         const audioUrl = URL.createObjectURL(audioBlob)
//         const audio = new Audio(audioUrl)
//         audio.play()
//       } else {
//         console.error(`CANCELED: Reason: ${sdk.ResultReason[result.reason]}`)
//       }
//     },
//     (error) => {
//       console.error(error)
//     },
//   )
// }

// const translate = async (text) => {
//   const translationClient = new TextTranslationClient(
//     endpoint,
//     translateCredential,
//   )
//   const inputText = [{ text: text }]
//   const translateResponse = await translationClient.path('/translate').post({
//     body: inputText,
//     queryParameters: {
//       from: 'en',
//       to: 'id',
//     },
//   })
//   const result = await translateResponse.body
//   console.log(translateResponse.body)
//   return 'Ada ' + result[0].translations[0].text
// }
</script>

<template>
  <div class="description-box">
    <p aria-live="assertive">{{ imageDescription }}</p>
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
