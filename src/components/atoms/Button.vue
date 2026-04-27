<template>
  <component
    :is="tag"
    :class="classes"
    :href="tag === 'a' ? href : undefined"
    :disabled="tag === 'button' && disabled ? true : undefined"
    :aria-disabled="disabled || undefined"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Maps semantic kind names to the actual CSS utility classes defined in button.css.
// primary   → btn-primary      (filled dark navy — used for CTAs like "Request a Demo")
// secondary → btn-outline-white (transparent + white border — used for secondary CTAs)
// tertiary  → btn-transparent  (ghost, no background — used for "See the Platform →")
type Kind = 'primary' | 'secondary' | 'tertiary'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    kind?: Kind
    size?: Size
    disabled?: boolean
    tag?: 'button' | 'a'
    href?: string
    full?: boolean
  }>(),
  {
    kind: 'primary',
    size: 'md',
    disabled: false,
    tag: 'button',
    full: false,
  },
)

const kindMap: Record<Kind, string> = {
  primary:   'btn-primary',
  secondary: 'btn-outline-white',
  tertiary:  'btn-transparent',
}

const classes = computed(() => [
  'btn',
  kindMap[props.kind],
  `btn-${props.size}`,
  props.full ? 'w-full' : '',
  props.disabled ? 'opacity-50 pointer-events-none' : '',
])
</script>
