<script setup lang="ts">
const props = defineProps<{ description: string, searchTerm: string }>()

const expanded = ref(false)
const truncated = ref(false)

// check if the description would overflow
function checkTruncation(el: Element | null) {
  if (!(el instanceof HTMLElement) || expanded.value) return
  truncated.value = el.scrollWidth > el.clientWidth
}

function handleClick(event: MouseEvent) {
  if (!truncated.value) return
  event.stopPropagation()
  expanded.value = !expanded.value
}

// Auto-expand the description when it matches the current search so the hit is visible
watch([() => props.searchTerm, () => props.description], ([term, description]) => {
  if (term && description.toLowerCase().includes(term.toLowerCase())) expanded.value = true
}, { immediate: true })
</script>

<template>
  <p
    :ref="(el) => checkTruncation(el as Element | null)"
    class="text-sm text-muted"
    :class="[
      expanded ? 'whitespace-normal' : 'truncate',
      truncated ? 'cursor-pointer hover:text-default hover:underline decoration-dotted underline-offset-2' : '',
    ]"
    @click="handleClick"
    v-html="highlightSearchTerm(description, searchTerm)"
  />
</template>
