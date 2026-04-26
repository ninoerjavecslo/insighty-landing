<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'white' | 'green' | 'yellow' | 'cyan' | 'gray'

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
