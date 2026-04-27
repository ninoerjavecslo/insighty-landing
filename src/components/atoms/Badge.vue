<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant =
  | 'primary'
  | 'primary-light'
  | 'secondary'
  | 'secondary-light'
  | 'white'
  | 'green'
  | 'yellow'
  | 'cyan'
  | 'gray'
  | 'gray-light'
  | 'gray-dark'
  | 'metal'
  | 'blur'
  | 'blur-light'
  | 'ivory'

const props = withDefaults(
  defineProps<{
    variant?: Variant
  }>(),
  {
    variant: 'primary',
  }
)

const classes = computed(() => ['badge', `badge-${props.variant}`])
</script>
