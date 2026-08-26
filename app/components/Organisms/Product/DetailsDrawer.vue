<script setup lang="ts">
import type { Product } from '#shared/schemas/Product'

defineProps<{ open: boolean, product: Product | null }>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const isMobile = useIsMobile()
</script>

<template>
  <UDrawer
    v-if="product"
    :open="open"
    :direction="isMobile ? 'bottom' : 'right'"
    :snap-points="isMobile ? [1] : undefined"
    :class="{ 'min-w-md max-w-1/2': !isMobile }"
    @update:open="emit('update:open', $event)"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex gap-4 items-center">
          <span class="text-lg font-bold">
            {{ product.name }}
          </span>
        </div>
        <UButton
          icon="i-lucide-x"
          variant="outline"
          color="neutral"
          class=" rounded-full"
          @click="emit('update:open', false)"
        />
      </div>
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="text-3xl font-semibold">{{ formatPrice(product.price) }}</span>
          <AtomsProductInStockBadge :stock="product.stock" />
        </div>

        <div class="flex flex-col gap-2 border-y py-2 border-accented">
          <div class="flex border-b border-accented pb-2 items-center justify-between">
            <span class="text-sm text-muted">Kategorie:</span>
            <span class="tabular-nums">{{ getCategoryText(product.category) }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">Bestand:</span>
            <span class="tabular-nums">{{ product.stock }} Stück</span>
          </div>
        </div>

        <p
          v-if="product.description"
          class="text-sm text-muted"
        >
          {{ product.description }}
        </p>

        <div
          v-if="product.tags.length"
          class="flex flex-col gap-2"
        >
          <span class="text-sm text-muted">Tags:</span>
          <div class="flex flex-wrap gap-1">
            <UBadge
              v-for="tag in product.tags"
              :key="tag"
              :label="tag"
              color="neutral"
              variant="outline"
              size="sm"
            />
          </div>
        </div>

        <span class="text-xs text-muted">Angelegt am {{ formatDate(product.createdAt) }}</span>
      </div>
    </template>
  </UDrawer>
</template>
