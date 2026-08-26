<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { Category, Product } from '#shared/schemas/Product'
import { CATEGORIES } from '#shared/data/category'
import type { Availability, ProductQueryInput } from '#shared/schemas/ProductQuery.ts'
import { AVAILABILITY_STATUSES } from '#shared/data/availability'
import type { ApiPageable } from '#shared/schemas/ApiPageable.ts'

const searchText = ref('')
const searchTextDebounced = refDebounced(searchText, 300)
const selectedCategories = ref<Category[]>([])
const availability = ref<Availability>('all')
const activePageIndex = ref(0)

const categoryItems = computed(() => CATEGORIES.map(category => ({ label: getCategoryText(category), value: category })))
const availabilityItems = AVAILABILITY_STATUSES.map(status => ({ label: getAvailabilityText(status), value: status }))

// reset pagination when user changes any filter
watch([searchTextDebounced, selectedCategories, availability], () => {
  activePageIndex.value = 0
})

function resetFilters() {
  searchText.value = ''
  selectedCategories.value = []
  availability.value = 'all'
  activePageIndex.value = 0
}

const query = computed<ProductQueryInput>(() => ({
  search: searchTextDebounced.value || undefined,
  category: selectedCategories.value.length ? selectedCategories.value : undefined,
  availability: availability.value === 'all' ? undefined : availability.value,
  pageIndex: activePageIndex.value,
}))

const { data, pending, refresh } = await useFetch('/api/products', {
  query,
})

const products = computed<Product[]>(() => data.value?.content ?? [])
const pageable = computed<ApiPageable | null>(() => data.value?.pageable ?? null)

const createModalOpen = ref(false)

const selectedProduct = shallowRef<Product | null>(null)
const drawerOpen = ref(false)

function onSelectProduct(product: Product) {
  selectedProduct.value = product
  drawerOpen.value = true
}
</script>

<template>
  <UContainer class="py-8">
    <UPageHeader
      title="Produktkatalog"
      description="Übersicht über alle Produkte im Lager."
      :links="[{ label: 'Neues Produkt anlegen', icon: 'i-lucide-plus', onClick: () => createModalOpen = true }]"
    />

    <div class="my-4 flex flex-wrap items-end gap-2">
      <UFormField label="Suche">
        <UInput
          v-model="searchText"
          icon="i-lucide-search"
          placeholder="Produkte durchsuchen…"
          class="w-full min-w-80"
        />
      </UFormField>

      <UFormField label="Kategorie">
        <USelectMenu
          v-model="selectedCategories"
          multiple
          value-key="value"
          :items="categoryItems"
          :search-input="false"
          :clear="true"
          placeholder="Kategorie"
          class="w-full sm:w-auto sm:max-w-52 min-w-40"
        />
      </UFormField>

      <UFormField label="Verfügbarkeit">
        <USelect
          v-model="availability"
          :items="availabilityItems"
          class="w-full sm:w-auto sm:max-w-44 min-w-40"
        />
      </UFormField>

      <UButton
        label="Zurücksetzen"
        icon="i-lucide-rotate-ccw"
        class="ml-auto"
        color="neutral"
        variant="outline"
        @click="resetFilters"
      />
    </div>

    <OrganismsProductTable
      v-model:active-page-index="activePageIndex"
      :pending="pending"
      :pageable="pageable"
      :products="products ?? []"
      :search-term="searchTextDebounced"
      @reset-filter="resetFilters()"
      @new-product="createModalOpen = true"
      @select="onSelectProduct"
    />

    <OrganismsProductDetailsDrawer
      v-model:open="drawerOpen"
      :product="selectedProduct"
    />

    <OrganismsProductCreateModal
      v-model:open="createModalOpen"
      @created="refresh"
    />
  </UContainer>
</template>
