<script setup lang="ts">
import { BaseChartOptions } from "../types";

const props = defineProps<{
  defaultOptions: BaseChartOptions
}>();

const emit = defineEmits<{
  (e: 'create', data: { type: 'pie', options: BaseChartOptions }): void
}>();

const handleCreate = () => {
  emit('create', { 
    type: 'pie', 
    options: {
      width: 450,
      height: 450
    }
  });
};
</script>

<template>
  <div class="plugin__section">
    <button type="button" data-appearance="primary" @click="handleCreate">
      Create Pie Chart
    </button>
  </div>
</template> 