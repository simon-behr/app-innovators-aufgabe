<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { type CreateProductInput, CreateProductSchema } from '#shared/schemas/Product'
import { CATEGORIES } from '#shared/data/category'

const toast = useToast()

const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ created: [] }>()

function createInitialState(): Partial<CreateProductInput> {
  return {
    name: '',
    description: undefined,
    price: undefined,
    category: undefined,
    stock: 0,
    tags: [],
  }
}

const state = reactive(createInitialState())
const view = ref<'form' | 'confirm-discard'>('form')
const formRef = useTemplateRef('form')

const isValid = computed(() => CreateProductSchema.safeParse(state).success)
const isDirty = computed(() => formRef.value?.dirty ?? false)

const categoryItems = CATEGORIES.map(category => ({ label: getCategoryText(category), value: category }))

const submitting = ref(false)

watch(open, (isOpen) => {
  if (!isOpen) {
    Object.assign(state, createInitialState())
    view.value = 'form'
  }
})

function requestClose() {
  if (isDirty.value) view.value = 'confirm-discard'
  else open.value = false
}

function handleOpenUpdate(value: boolean) {
  if (value) {
    open.value = true
    return
  }
  requestClose()
}

async function onSubmit(event: FormSubmitEvent<CreateProductInput>) {
  submitting.value = true
  try {
    await $fetch('/api/product', {
      method: 'POST',
      body: event.data,
    })
    toast.add({
      title: 'Produkt angelegt',
      description: `„${event.data.name}" wurde erfolgreich angelegt.`,
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
    emit('created')
    open.value = false
  }
  catch {
    toast.add({
      title: 'Fehler beim Anlegen',
      description: 'Das Produkt konnte nicht angelegt werden. Bitte versuche es erneut.',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <UModal
    :open="open"
    :title="view === 'form' ? 'Neues Produkt anlegen' : 'Änderungen verwerfen?'"
    @update:open="handleOpenUpdate"
  >
    <template #body>
      <div v-show="view === 'form'">
        <UForm
          ref="form"
          :schema="CreateProductSchema"
          :state="state"
          class="flex flex-col gap-4"
          @submit="onSubmit"
        >
          <UFormField
            label="Name"
            name="name"
            required
          >
            <UInput
              v-model="state.name"
              placeholder="Produktname"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Beschreibung"
            name="description"
          >
            <UTextarea
              v-model="state.description"
              placeholder="Produktbeschreibung (optional)"
              :rows="4"
              class="w-full"
            />
          </UFormField>

          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
              label="Preis"
              name="price"
              required
            >
              <UInputNumber
                v-model.optional="state.price"
                :min="0"
                :step="0.01"
                :increment="false"
                :decrement="false"
                locale="de-DE"
                :format-options="{ style: 'currency', currency: 'EUR' }"
                placeholder="0,00 €"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Bestand"
              name="stock"
              required
            >
              <UInputNumber
                v-model.optional="state.stock"
                :min="0"
                :step="1"
                :format-options="{ maximumFractionDigits: 0 }"
                placeholder="0"
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField
            label="Kategorie"
            name="category"
            required
          >
            <USelect
              v-model="state.category"
              :items="categoryItems"
              placeholder="Kategorie auswählen…"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Tags"
            name="tags"
          >
            <UInputTags
              v-model="state.tags"
              placeholder="Tag hinzufügen und Enter drücken…"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end gap-2 pt-2">
            <UButton
              label="Abbrechen"
              color="neutral"
              variant="ghost"
              :disabled="submitting"
              @click="requestClose"
            />
            <UButton
              label="Produkt anlegen"
              :disabled="!isValid"
              type="submit"
              :loading="submitting"
            />
          </div>
        </UForm>
      </div>

      <div
        v-if="view === 'confirm-discard'"
        class="flex flex-col gap-4"
      >
        <p class="text-sm text-muted">
          Du hast ungespeicherte Änderungen. Wenn du fortfährst, gehen diese verloren.
        </p>
        <div class="flex justify-end gap-2">
          <UButton
            label="Zurück zum Formular"
            color="neutral"
            variant="ghost"
            @click="view = 'form'"
          />
          <UButton
            label="Änderungen verwerfen"
            color="error"
            @click="open = false"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
