<script setup lang="ts">
const props = defineProps<{ stock: number }>()

const status = computed(() => getAvailabilityStatus(props.stock))
</script>

<template>
  <UBadge
    :label="getAvailabilityText(status)"
    :color="getAvailabilityColor(status)"
    variant="subtle"
  />
</template>
