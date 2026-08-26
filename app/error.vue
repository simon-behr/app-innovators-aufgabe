<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <UError
    icon="i-lucide-file-x"
    :error="{
      statusCode: error.status,
      statusMessage: error.statusText,
    }"
  />
</template>
