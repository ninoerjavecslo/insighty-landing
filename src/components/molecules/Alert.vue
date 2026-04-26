<template>
  <div
    v-if="visible"
    :class="[
      'flex items-start gap-3 px-4 py-3 rounded-2xl border w-full',
      typeStyles[type].wrapper,
    ]"
    role="alert"
  >
    <!-- Icon -->
    <span class="shrink-0 mt-0.5" aria-hidden="true">
      <svg v-if="type === 'info'" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="typeStyles[type].iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      <svg v-else-if="type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="typeStyles[type].iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17L4 12" />
      </svg>
      <svg v-else-if="type === 'warning'" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="typeStyles[type].iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <svg v-else-if="type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="typeStyles[type].iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    </span>

    <!-- Content -->
    <div class="flex flex-1 flex-col gap-0.5 min-w-0">
      <p v-if="title" :class="['text-tagline-2 font-semibold', typeStyles[type].title]">{{ title }}</p>
      <p v-if="message" :class="['text-tagline-2', typeStyles[type].message]">{{ message }}</p>
      <slot />
    </div>

    <!-- Dismiss button -->
    <button
      v-if="dismissible"
      type="button"
      :class="['shrink-0 p-0.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity cursor-pointer', typeStyles[type].title]"
      aria-label="Dismiss"
      @click="dismiss"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type AlertType = 'info' | 'success' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{
    type?: AlertType
    title?: string
    message?: string
    dismissible?: boolean
  }>(),
  {
    type: 'info',
    dismissible: false,
  }
)

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)

const dismiss = () => {
  visible.value = false
  emit('close')
}

const typeStyles: Record<AlertType, { wrapper: string; title: string; message: string; iconColor: string }> = {
  info: {
    wrapper: 'border-primary-400/30 bg-primary-50 dark:bg-primary-800/20 dark:border-primary-400/20',
    title: 'text-primary-500 dark:text-primary-200',
    message: 'text-primary-500/80 dark:text-primary-200/80',
    iconColor: '#4a6ec7',
  },
  success: {
    wrapper: 'border-ns-green/30 bg-ns-green-light/60 dark:bg-ns-green/10 dark:border-ns-green/20',
    title: 'text-ns-green dark:text-ns-green',
    message: 'text-ns-green/80',
    iconColor: '#2d9b9b',
  },
  warning: {
    wrapper: 'border-ns-yellow/40 bg-ns-yellow-light/60 dark:bg-ns-yellow/10 dark:border-ns-yellow/20',
    title: 'text-ns-linen dark:text-ns-yellow',
    message: 'text-ns-linen/80 dark:text-ns-yellow/80',
    iconColor: '#d4a574',
  },
  error: {
    wrapper: 'border-ns-red/40 bg-ns-red/10 dark:bg-ns-red/10 dark:border-ns-red/20',
    title: 'text-red-600 dark:text-ns-red',
    message: 'text-red-600/80 dark:text-ns-red/80',
    iconColor: '#ffb9a2',
  },
}
</script>
