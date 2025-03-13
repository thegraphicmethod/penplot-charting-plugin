<script setup lang="ts">
import { ref, watch } from 'vue';

interface LineData {
  x: string;
  series: { [key: string]: number };
}

const props = defineProps<{
  initialData?: LineData[]
}>();

const emit = defineEmits<{
  (e: 'update', data: LineData[]): void
}>();

const pointCount = ref(4);
const seriesCount = ref(2);
const chartData = ref<LineData[]>([]);

// Initialize with random data
const generateRandomData = (points: number, series: number) => {
  return Array.from({ length: points }, (_, i) => ({
    x: `Point ${i + 1}`,
    series: Object.fromEntries(
      Array.from({ length: series }, (_, j) => [
        `y${j}`,
        Math.floor(Math.random() * 100)
      ])
    )
  }));
};

// Update data when point count or series count changes
watch([pointCount, seriesCount], ([newPoints, newSeries]) => {
  chartData.value = generateRandomData(newPoints, newSeries);
  emit('update', chartData.value);
}, { immediate: true });

// Update parent when data changes
const updateData = () => {
  emit('update', chartData.value);
};
</script>

<template>
  <div class="chart-editor">
    <div class="plugin__field-group">
      <div class="plugin__field">
        <label class="plugin__label">Number of points</label>
        <input 
          type="number" 
          v-model="pointCount"
          min="2"
          max="10"
          class="plugin__input"
        >
      </div>

      <div class="plugin__field">
        <label class="plugin__label">Number of series</label>
        <input 
          type="number" 
          v-model="seriesCount"
          min="1"
          max="5"
          class="plugin__input"
        >
      </div>
    </div>

    <table class="plugin__table">
      <thead>
        <tr>
          <th>X</th>
          <th v-for="i in seriesCount" :key="i">Y{{ i - 1 }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in chartData" :key="index">
          <td>
            <input 
              type="text"
              v-model="item.x"
              class="plugin__input"
              @change="updateData"
            >
          </td>
          <td v-for="i in seriesCount" :key="i">
            <input 
              type="number"
              v-model="item.series[`y${i-1}`]"
              class="plugin__input"
              @change="updateData"
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.chart-editor {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
}

.plugin__field-group {
  display: flex;
  gap: var(--spacing-16);
}

.plugin__table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--lb-quaternary);
}

.plugin__table th,
.plugin__table td {
  padding: var(--spacing-4);
  text-align: left;
  border: 1px solid var(--lb-quaternary);
}

.plugin__table th {
  color: var(--lf-primary);
  background-color: var(--lb-tertiary);
}

[data-theme="dark"] .plugin__table {
  border-color: var(--db-quaternary);
}

[data-theme="dark"] .plugin__table th,
[data-theme="dark"] .plugin__table td {
  border-color: var(--db-quaternary);
}

[data-theme="dark"] .plugin__table th {
  color: var(--df-primary);
  background-color: var(--db-tertiary);
}

.plugin__input {
  width: 100%;
  border: 1px solid var(--lb-tertiary);
  padding: var(--spacing-4);
}

[data-theme="dark"] .plugin__input {
  border-color: var(--db-tertiary);
}

.plugin__field {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-8);
}
</style> 