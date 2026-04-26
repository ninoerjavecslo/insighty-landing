<template>
  <component
    :is="tag"
    :class="classes"
    :href="tag === 'a' ? href : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="disabled || undefined"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'accent' | 'white'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    disabled?: boolean
    tag?: 'button' | 'a'
    href?: string
    full?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    tag: 'button',
    full: false,
  }
)

const classes = computed(() => [
  'btn',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  props.full ? 'w-full' : '',
  props.disabled ? 'opacity-50 pointer-events-none' : '',
])
</script>
