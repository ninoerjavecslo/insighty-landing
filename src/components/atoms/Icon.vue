<template>
  <span
    :class="['inline-flex items-center justify-center shrink-0', sizeClass, extraClass]"
    aria-hidden="true"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    size?: Size
    class?: string
  }>(),
  {
    size: 'md',
  }
)

const sizeClass = computed(() => {
  return {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  }[props.size]
})

const extraClass = computed(() => props.class ?? '')
</script>
