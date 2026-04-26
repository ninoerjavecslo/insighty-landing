<template>
  <div>
    <!-- Tab list -->
    <div
      role="tablist"
      class="flex gap-0 border-b border-stroke-2 dark:border-stroke-6"
      :aria-label="ariaLabel"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="modelValue === tab.id"
        :class="[
          'relative px-4 py-2.5 text-tagline-2 font-medium transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-inset',
          modelValue === tab.id
            ? 'text-primary-500 dark:text-primary-200'
            : 'text-secondary/60 dark:text-accent/60 hover:text-secondary dark:hover:text-accent',
        ]"
        @click="select(tab.id)"
      >
        {{ tab.label }}
        <!-- Active indicator -->
        <span
          v-if="modelValue === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 dark:bg-primary-300 rounded-t-full"
        />
      </button>
    </div>

    <!-- Panel slot -->
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Tab {
  id: string
  label: string
}

withDefaults(
  defineProps<{
    tabs: Tab[]
    modelValue: string
    ariaLabel?: string
  }>(),
  {
    ariaLabel: 'Tabs',
  }
)

const emit = defineEmits<{
  'update:modelValue': [id: string]
}>()

const select = (id: string) => {
  emit('update:modelValue', id)
}
</script>
