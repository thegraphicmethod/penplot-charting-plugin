<script setup lang="ts">
import type { BaseChartOptions } from "../types";

const props = defineProps<{
  defaultOptions: BaseChartOptions
}>();

const emit = defineEmits<{
  (e: 'create', data: { type: 'line', options: BaseChartOptions }): void
}>();

const handleCreate = () => {
  emit('create', { type: 'line', options: props.defaultOptions });
};
</script>

<template>
  <div class="plugin__section">
    <button type="button" data-appearance="primary" @click="handleCreate">
      Create Line Chart
    </button>
  </div>
</template> 