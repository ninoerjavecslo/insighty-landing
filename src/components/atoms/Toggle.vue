<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    :class="[
      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
      'transition-colors duration-200 ease-in-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      modelValue
        ? 'bg-primary-500'
        : 'bg-stroke-1 dark:bg-stroke-6',
    ]"
    @click="toggle"
  >
    <span
      :class="[
        'pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm',
        'transform transition-transform duration-200 ease-in-out',
        modelValue ? 'translate-x-5' : 'translate-x-0',
      ]"
    />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>
