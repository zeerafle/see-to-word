<script setup>
import { useLoadingStore } from '@/stores/loadingStore.js'

const loadingStore = useLoadingStore()
defineProps({
  icon: {
    type: String,
    required: true,
  },
  clickHandler: {
    type: Function,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  needLoading: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>

<template>
  <button id="icon-button" @click="clickHandler">
    <font-awesome-icon
      :icon="loadingStore.getLoading() && needLoading ? 'spinner' : icon"
      aria-hidden="true"
    />
    {{ loadingStore.getLoading() && needLoading ? 'Loading...' : description }}
  </button>
</template>

<style scoped>
button {
  background-color: #fff;
  border: none;
  border-radius: 30rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
  color: #000;
  cursor: pointer;
  height: 2.5em;
  margin: 0 1em;
  padding: 0.5em;
  transition: box-shadow 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
