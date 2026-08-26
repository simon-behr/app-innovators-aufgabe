<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn, TableRow } from '@nuxt/ui/components/Table.vue'
import type { Product } from '#shared/schemas/Product'
import type { ApiPageable } from '#shared/schemas/ApiPageable.ts'

const props = defineProps<{ products: Product[], pageable: ApiPageable | null, pending: boolean, searchTerm: string }>()

const activePageIndex = defineModel<number>('activePageIndex', { required: true })
const emit = defineEmits<{ select: [product: Product], resetFilter: [], newProduct: [] }>()

const columns: TableColumn<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Produkt',
    meta: { class: { th: 'max-w-48', td: 'max-w-48' } },
  },
  {
    accessorKey: 'category',
    header: 'Kategorie',
    cell: ({ row }) => h('span', { class: 'text-right tabular-nums' }, getCategoryText(row.original.category)),
    meta: { class: { th: 'w-36', td: 'w-36' } },
  },
  {
    accessorKey: 'price',
    header: () => h('div', { class: 'text-right' }, 'Preis'),
    cell: ({ row }) => h('div', { class: 'text-right tabular-nums' }, formatPrice(row.original.price)),
    meta: { class: { th: 'w-32', td: 'w-32' } },
  },
  {
    accessorKey: 'stock',
    header: () => h('div', 'Bestand'),
    cell: ({ row }) => h(resolveComponent('AtomsProductInStockBadge'), { stock: row.original.stock }),
    meta: { class: { th: 'w-36', td: 'w-36' } },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.original.tags
      if (tags.length === 0) return h('span', { class: 'text-muted' }, '--')

      const visible = tags.slice(0, 2)
      const rest = tags.length - visible.length
      return h('div', { class: 'flex flex-wrap gap-1' }, [
        ...visible.map(tag => h(
          resolveComponent('UBadge'),
          { key: tag, color: 'neutral', variant: 'outline', size: 'sm' },
          { default: () => h('span', { innerHTML: highlightSearchTerm(tag, props.searchTerm) }) },
        )),
        rest > 0 ? h(resolveComponent('UBadge'), { label: `+${rest}`, color: 'neutral', variant: 'outline', size: 'sm' }) : null,
      ])
    },
    meta: { class: { th: 'w-44', td: 'w-44' } },
  },
]

function handleSelect(_event: Event, row: TableRow<Product>) {
  emit('select', row.original)
}
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <UTable
      :loading="pending"
      :data="products"
      :columns="columns"
      :on-select="handleSelect"
      :class="{ 'cursor-pointer': products.length > 0 }"
      :ui="{ base: 'w-full' }"
    >
      <template #name-cell="{ row }">
        <div class="flex flex-col gap-2 min-w-0">
          <!-- v-html to highlight the search term for more understandable search behavior
          (name, description and tags are searched at once) -->
          <span
            class="font-bold"
            v-html="highlightSearchTerm(row.original.name, searchTerm)"
          />
          <MoleculesProductDescriptionCell
            v-if="row.original.description"
            :description="row.original.description"
            :search-term="searchTerm"
          />
        </div>
      </template>
      <template #empty>
        <div class="flex flex-col gap-4 items-center text-center">
          <span class="font-bold text-base">Keine Produkte gefunden.</span>
          <p class="max-w-80">
            Für die aktuelle Kombination aus Suchbegriff und Filtern liefert der Katalog keine Treffer.
            Filter anpassen oder ein neues Produkt anlegen.
          </p>
          <div class="flex gap-2">
            <UButton
              label="Filter zurücksetzen"
              color="neutral"
              variant="outline"
              @click="emit('resetFilter')"
            />
            <UButton
              label="Neues Produkt"
              color="neutral"
              @click="emit('newProduct')"
            />
          </div>
        </div>
      </template>
    </UTable>
    <div class="flex justify-end border-t border-default pt-4 px-4">
      <UPagination
        :page="activePageIndex + 1"
        :items-per-page="pageable?.pageSize"
        :total="pageable?.totalElements"
        @update:page="(p) => activePageIndex = p - 1"
      />
    </div>
  </div>
</template>
