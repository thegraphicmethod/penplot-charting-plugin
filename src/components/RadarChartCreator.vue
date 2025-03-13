<script setup lang="ts">
import { ref } from 'vue';
import * as d3 from 'd3';
import type { RadarChartOptions, ChartCreateMessage } from "../types";
import LineDataEditor from "./LineDataEditor.vue";
import { createRadarChart } from "../createRadarChart";

const props = defineProps<{
  defaultOptions: RadarChartOptions
}>();

const emit = defineEmits<{
  (e: 'create', data: ChartCreateMessage & { type: 'radar', options: RadarChartOptions }): void
}>();

const currentData = ref([]);
const showFill = ref(true);

const handleCreate = () => {
  const chartData = createRadarChart(currentData.value, {
    ...props.defaultOptions,
    showFill: showFill.value,
    gridColor: "#E2E8F0",
    colorScheme: d3.schemeTableau10
  });

  emit('create', { 
    type: 'radar',
    options: {
      ...props.defaultOptions,
      showFill: showFill.value,
      gridColor: "#E2E8F0"
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
        >
        Fill Area
      </label>
    </div>

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