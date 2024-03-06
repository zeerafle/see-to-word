<script setup>
defineProps({
  imageDescription: {
    type: String,
    required: true,
  },
})

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
