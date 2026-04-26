<template>
  <div class="accordion w-full space-y-3" aria-label="Accordion">
    <div
      v-for="(item, i) in items"
      :key="i"
      :class="[
        'border rounded-[20px] transition-colors duration-200',
        isOpen(i)
          ? 'border-stroke-2 dark:border-stroke-7'
          : 'border-stroke-1 dark:border-stroke-6',
      ]"
    >
      <button
        type="button"
        class="flex w-full cursor-pointer items-center justify-between p-4 md:p-5 lg:p-6 outline-none"
        :aria-expanded="isOpen(i)"
        @click="toggle(i)"
      >
        <span class="xl:text-heading-6 text-tagline-1 text-secondary dark:text-accent flex-1 text-left font-normal">
          {{ item.q }}
        </span>
        <span
          :class="[
            'ml-2.5 flex size-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ease-in-out sm:ml-auto',
            isOpen(i)
              ? 'bg-secondary dark:bg-accent'
              : 'bg-primary-700',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            :class="[
              'transition-transform duration-300 ease-in-out',
              isOpen(i) ? 'rotate-180' : '',
            ]"
          >
            <path d="M9 0.910156L5 4.91016L1 0.910156" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </button>

      <!-- Grid-based smooth open/close (no JS height calc needed) -->
      <div
        :class="[
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          isOpen(i) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        ]"
      >
        <div class="overflow-hidden min-h-0">
          <div class="px-6 pb-6">
            <p class="text-tagline-1 text-secondary/80 dark:text-accent/80 leading-relaxed">{{ item.a }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface AccordionItem {
  q: string
  a: string
}

const props = withDefaults(
  defineProps<{
    items: AccordionItem[]
    openFirst?: boolean
    allowMultiple?: boolean
  }>(),
  {
    openFirst: false,
    allowMultiple: false,
  }
)

const openItems = ref<Set<number>>(
  new Set(props.openFirst ? [0] : [])
)

const isOpen = (index: number) => openItems.value.has(index)

const toggle = (index: number) => {
  const next = new Set(openItems.value)
  if (next.has(index)) {
    next.delete(index)
  } else {
    if (!props.allowMultiple) next.clear()
    next.add(index)
  }
  openItems.value = next
}
</script>
