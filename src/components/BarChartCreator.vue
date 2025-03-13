<script setup lang="ts">
import { ref } from 'vue';
import * as d3 from 'd3';
import type { BarChartOptions, ChartCreateMessage } from "../types";
import ChartDataEditor from "./ChartDataEditor.vue";
import { createBarChart } from "../createBarChart";

const props = defineProps<{
  defaultOptions: BarChartOptions
}>();

const emit = defineEmits<{
  (e: 'create', data: ChartCreateMessage & { type: 'bar', options: BarChartOptions }): void
}>();

const currentData = ref([]);

const handleCreate = () => {
  const chartData = createBarChart(currentData.value, {
    ...props.defaultOptions,
    colorScheme: d3.schemeTableau10
  });

  emit('create', { 
    type: 'bar',
    options: props.defaultOptions,
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
    
    <div class="plugin__section">
      <button type="button" data-appearance="primary" @click="handleCreate">
        Create Bar Chart
      </button>
    </div>
  </div>
</template>

<style scoped>
.plugin__section {
  padding-top: var(--spacing-20);
  padding-bottom: var(--spacing-20);
}

.plugin__title {
  margin-bottom: var(--spacing-20);
}
</style>