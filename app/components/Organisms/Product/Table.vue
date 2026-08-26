<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn, TableRow } from '@nuxt/ui/components/Table.vue'
import type { Product } from '#shared/schemas/Product'
import type { ApiPageable } from '#shared/schemas/ApiPageable.ts'

const props = defineProps<{ products: Product[], pageable: ApiPageable | null, pending: boolean, searchTerm: string }>()

const activePageIndex = defineModel<number>('activePageIndex', { required: true })
const emit = defineEmits<{ select: [product: Product], resetFilter: [], newProduct: [] }>()

const expandedDescriptionIds = reactive(new Set<string>())
const truncatedDescriptionIds = reactive(new Set<string>())

function toggleDescription(productId: string) {
  if (expandedDescriptionIds.has(productId)) expandedDescriptionIds.delete(productId)
  else expandedDescriptionIds.add(productId)
}

// Only relevant while collapsed (truncate) — expanded text wraps, so scrollWidth stops
// reflecting whether it would overflow, and we don't want to lose the "was truncated" flag then
function checkDescriptionTruncation(productId: string, el: Element | null) {
  if (!(el instanceof HTMLElement) || expandedDescriptionIds.has(productId)) return
  if (el.scrollWidth > el.clientWidth) truncatedDescriptionIds.add(productId)
  else truncatedDescriptionIds.delete(productId)
}

// Auto-expand descriptions that match the current search so the hit is visible
watch([() => props.searchTerm, () => props.products], ([term, products]) => {
  if (!term) return
  const q = term.toLowerCase()
  for (const product of products) {
    if (product.description?.toLowerCase().includes(q)) expandedDescriptionIds.add(product.id)
  }
}, { immediate: true })

const columns: TableColumn<Product>[] = [
  {
    // Rendering fully happens via the #name-cell slot
    accessorKey: 'name',
    header: 'Produkt',
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
      :ui="{ base: 'table-fixed w-full' }"
    >
      <template #name-cell="{ row }">
        <div class="flex flex-col gap-2 min-w-0">
          <span
            class="font-bold"
            v-html="highlightSearchTerm(row.original.name, searchTerm)"
          />
          <p
            v-if="row.original.description"
            :ref="(el) => checkDescriptionTruncation(row.original.id, el as Element | null)"
            class="text-sm text-muted"
            :class="[
              expandedDescriptionIds.has(row.original.id) ? 'whitespace-normal' : 'truncate',
              truncatedDescriptionIds.has(row.original.id) ? 'cursor-pointer hover:text-default hover:underline decoration-dotted underline-offset-2' : '',
            ]"
            @click.stop="toggleDescription(row.original.id)"
            v-html="highlightSearchTerm(row.original.description, searchTerm)"
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
