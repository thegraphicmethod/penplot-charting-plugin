<script setup lang="ts">
import { ref } from 'vue';
import { BaseChartOptions } from "../types";
import ChartDataEditor from "./ChartDataEditor.vue";

const props = defineProps<{
  defaultOptions: BaseChartOptions
}>();

const emit = defineEmits<{
  (e: 'create', data: { type: 'bar', options: BaseChartOptions }): void
}>();

const currentData = ref([]);

const handleCreate = () => {
  emit('create', { 
    type: 'bar', 
    options: props.defaultOptions,
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