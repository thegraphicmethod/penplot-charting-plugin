<script setup lang="ts">
import { ref, watch } from 'vue';

interface ChartData {
  name: string;
  value: number;
}

const props = defineProps<{
  initialData?: ChartData[]
}>();

const emit = defineEmits<{
  (e: 'update', data: ChartData[]): void
}>();

const sliceCount = ref(4);
const chartData = ref<ChartData[]>([]);

// Initialize with random data
const generateRandomData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    name: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 100)
  }));
};

// Update data when slice count changes
watch(sliceCount, (newCount) => {
  chartData.value = generateRandomData(newCount);
  emit('update', chartData.value);
}, { immediate: true });

// Update parent when data changes
const updateData = () => {
  emit('update', chartData.value);
};
</script>

<template>
  <div class="chart-editor">
    <div class="plugin__field">
      <label class="plugin__label">How many slices?</label>
      <input 
        type="number" 
        v-model="sliceCount"
        min="2"
        max="10"
        class="plugin__input"
      >
    </div>

    <table class="plugin__table">
      <thead>
        <tr>
          <th>Label</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in chartData" :key="index">
          <td>
            <input 
              type="text"
              v-model="item.name"
              class="plugin__input"
              @change="updateData"
            >
          </td>
          <td>
            <input 
              type="number"
              v-model="item.value"
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
  gap: var(--space-16);
}

.plugin__table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--lb-quaternary);
}

.plugin__table th,
.plugin__table td {
  padding: var(--space-4);
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
}
</style> 