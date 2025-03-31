<script setup lang="ts">
import { ref, computed } from 'vue';
import * as d3 from 'd3';
import type { RadarChartOptions, ChartCreateMessage } from "../types";
import LineDataEditor from "./LineDataEditor.vue";
import ColorSchemeSelector from "./ColorSchemeSelector.vue";
import { createRadarChart } from "../createRadarChart";

const props = defineProps<{
  defaultOptions: RadarChartOptions
}>();

const emit = defineEmits<{
  (e: 'create', data: ChartCreateMessage & { type: 'radar', options: RadarChartOptions }): void
}>();

const currentData = ref([]);
const showFill = ref(true);
const colorScheme = ref<readonly string[]>(d3.schemeTableau10);

// Compute if we have multiple series
const hasMultipleSeries = computed(() => {
  if (currentData.value.length === 0) return false;
  // Check if there are more than one series in the first data point
  const firstPoint = currentData.value[0];
  return firstPoint && Object.keys(firstPoint.series || {}).length > 1;
});

const handleCreate = () => {
  const chartData = createRadarChart(currentData.value, {
    ...props.defaultOptions,
    showFill: showFill.value,
    gridColor: "#E2E8F0",
    colorScheme: [...colorScheme.value]
  });

  emit('create', { 
    type: 'radar',
    options: {
      ...props.defaultOptions,
      showFill: showFill.value,
      gridColor: "#E2E8F0",
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
    <LineDataEditor @update="handleDataUpdate" />
    
    <div class="plugin__field">
      <label class="plugin__label">
        <input 
          type="checkbox" 
          v-model="showFill"
          class="checkbox-input"
        >
        Fill Area
      </label>
    </div>

    <ColorSchemeSelector 
      v-if="hasMultipleSeries"
      v-model="colorScheme"
    />

    <div class="plugin__section">
      <button type="button" data-appearance="primary" @click="handleCreate">
        Create Radar Chart
      </button>
    </div>
  </div>
</template>

<style scoped>
.plugin__section {
  padding-top: var(--spacing-20);
  padding-bottom: var(--spacing-20);
}

.plugin__field {
  margin-top: var(--spacing-16);
}
</style> 