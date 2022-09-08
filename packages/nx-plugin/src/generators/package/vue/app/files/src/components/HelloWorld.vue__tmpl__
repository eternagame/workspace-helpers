<template>
  <h1>{{ message }}</h1>
  <button @click="emit('buttonClicked')">
    Click Me!
  </button>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<(e: 'buttonClicked') => void>();
</script>
