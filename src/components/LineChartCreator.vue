<script setup lang="ts">
import { ref } from 'vue';
import type { LineChartOptions, ChartCreateMessage } from "../types";
import LineDataEditor from "./LineDataEditor.vue";
import * as d3 from 'd3';
import { createLineChart } from "../createLineChart";

const props = defineProps<{
  defaultOptions: LineChartOptions
}>();

const emit = defineEmits<{
  (e: 'create', data: ChartCreateMessage & { type: 'line', options: LineChartOptions }): void
}>();

const currentData = ref([]);
const showGrid = ref(true);
const showDots = ref(true);
const showArea = ref(false);

const handleCreate = () => {
  const chartData = createLineChart(currentData.value, {
    ...props.defaultOptions,
    showGrid: showGrid.value,
    showDots: showDots.value,
    showArea: showArea.value,
    colorScheme: d3.schemeTableau10
  });

  emit('create', { 
    type: 'line', 
    options: {
      ...props.defaultOptions,
      showGrid: showGrid.value,
      showDots: showDots.value,
      showArea: showArea.value
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
    
    <div class="plugin__field-group">
      <div class="plugin__field">
        <label class="plugin__label">
          <input 
            type="checkbox" 
            v-model="showGrid"
          >
          Show Grid
        </label>
      </div>

      <div class="plugin__field">
        <label class="plugin__label">
          <input 
            type="checkbox" 
            v-model="showDots"
          >
          Show Dots
        </label>
      </div>

      <div class="plugin__field">
        <label class="plugin__label">
          <input 
            type="checkbox" 
            v-model="showArea"
          >
          Show Area
        </label>
      </div>
    </div>

    <div class="plugin__section">
      <button type="button" data-appearance="primary" @click="handleCreate">
        Create Line Chart
      </button>
    </div>
  </div>
</template>

<style scoped>
.plugin__section {
  padding-top: var(--spacing-20);
  padding-bottom: var(--spacing-20);
}

.plugin__field-group {
  display: flex;
  gap: var(--spacing-16);
  margin-top: var(--spacing-16);
}
</style> 