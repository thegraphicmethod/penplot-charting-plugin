<script setup lang="ts">
import { ref,watch } from 'vue';
import * as d3 from 'd3';
import type { PieChartOptions, ChartCreateMessage } from "../types";
import ChartDataEditor from "./ChartDataEditor.vue";
import ColorSchemeSelector from "./ColorSchemeSelector.vue";
import { createPieChart } from "../createPieChart";

const props = defineProps<{
  defaultOptions: PieChartOptions
}>();

const emit = defineEmits<{
  (e: 'create', data: ChartCreateMessage & { type: 'pie', options: PieChartOptions }): void
}>();

const currentData = ref([]);
const innerRadius = ref(0);
const colorScheme = ref<readonly string[]>(d3.schemeTableau10);

// watch(() => colorScheme, (newValue, oldValue) => {
//   console.log('colorScheme',newValue, oldValue)
// })

const handleCreate = () => {
  const chartData = createPieChart(currentData.value, {
    ...props.defaultOptions,
    innerRadius: innerRadius.value,
    colorScheme: [...colorScheme.value]
  });

  emit('create', { 
    type: 'pie', 
    options: {
      ...props.defaultOptions,
      innerRadius: innerRadius.value,
      colorScheme: [...colorScheme.value]
    },
    content: chartData,
    data: currentData.value
  });
};

const handleDataUpdate = (newData: any[]) => {
  currentData.value = newData;
};
</script>

<template>
  <div>
    <ChartDataEditor @update="handleDataUpdate" />
    
    <div class="plugin__field">
      <label class="plugin__label">Chart Type</label>
      <div class="plugin__range-field">
        <span>Pie</span>
        <input 
          type="range" 
          v-model="innerRadius" 
          min="0" 
          max="0.8" 
          step="0.1" 
          class="plugin__range"
        >
        <span>Doughnut</span>
      </div>
    </div>

    <ColorSchemeSelector v-model="colorScheme" />

    <div class="plugin__section">
      <button type="button" data-appearance="primary" @click="handleCreate">
        Create {{ innerRadius > 0 ? 'Doughnut' : 'Pie' }} Chart
      </button>
    </div>
  </div>
</template>

<style scoped>
.plugin__section {
  padding-top: var(--spacing-20);
  padding-bottom: var(--spacing-20);
}

.plugin__range-field {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  margin-top: var(--spacing-4);
}
.plugin__range-field input{
  width: 200px
}

.plugin__range {
  flex: 1;
}

.plugin__field {
  margin-top: var(--spacing-16);
}
</style> 