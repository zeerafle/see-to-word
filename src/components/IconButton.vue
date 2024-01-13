<script setup>
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
})
</script>

<template>
  <button id="icon-button" @click="clickHandler">
    <font-awesome-icon :icon="icon" />
    {{ description }}
  </button>
</template>

<style scoped>
button {
  background-color: #fff;
  border: none;
  border-radius: 30rem;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.5);
  color: #000;
  cursor: pointer;
  font-size: 1.5rem;
  height: 2em;
  margin: 0 1em;
  padding: 0.5em;
  transition: box-shadow 0.3s ease-in-out;
}
</style>