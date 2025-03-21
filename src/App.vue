<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { BaseChartOptions, ChartCreateMessage } from "./types";
import BarChartCreator from "./components/BarChartCreator.vue";
import PieChartCreator from "./components/PieChartCreator.vue";
import LineChartCreator from "./components/LineChartCreator.vue";
import RadarChartCreator from "./components/RadarChartCreator.vue";

const theme = ref<string | null>(null);
const activeTab = ref<'bar' | 'pie' | 'line' | 'radar'>('line');

onMounted(() => {
  const url = new URL(window.location.href);
  const initialTheme = url.searchParams.get("theme");

  if (initialTheme) {
    theme.value = initialTheme as string;
  }

  window.addEventListener("message", (event) => {
    if (event.data.type === "theme") {
      theme.value = event.data.content;
    }
  });
});


const defaultOptions: BaseChartOptions = {
  width: 600,
  height: 400
};

const handleCreate = (data: ChartCreateMessage) => {
  window.parent.postMessage({ 
    type: "create-chart", 
    content: data.content,
    dimensions: data.options
  }, "*");
};
</script>

<template>
  <main :data-theme="theme" class="plugin">
    <div class="plugin__content">
      <h2 class="plugin__title title-l">Choose chart type</h2>
      <div class="plugin__tabs">
        <button 
          class="plugin__tab-item"
          :class="{ 'is-selected': activeTab === 'line' }" 
          @click="activeTab = 'line'"
        >
          Line/Area
        </button>
        <button 
          class="plugin__tab-item"
          :class="{ 'is-selected': activeTab === 'bar' }" 
          @click="activeTab = 'bar'"
        >
          Bar
        </button>
        <button 
          class="plugin__tab-item"
          :class="{ 'is-selected': activeTab === 'pie' }" 
          @click="activeTab = 'pie'"
        >
          Pie / Doughnut
        </button>
        <button 
          class="plugin__tab-item"
          :class="{ 'is-selected': activeTab === 'radar' }" 
          @click="activeTab = 'radar'"
        >
          Radar
        </button>
      </div>

      <div class="plugin__section " >
        <BarChartCreator
          v-if="activeTab === 'bar'"
          :default-options="defaultOptions"
          @create="handleCreate"
        />
        <PieChartCreator
          v-if="activeTab === 'pie'"
          :default-options="defaultOptions"
          @create="handleCreate"
        />
        <LineChartCreator
          v-if="activeTab === 'line'"
          :default-options="defaultOptions"
          @create="handleCreate"
        />
        <RadarChartCreator
          v-if="activeTab === 'radar'"
          :default-options="defaultOptions"
          @create="handleCreate"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.plugin__section {
  padding: var(--spacing-20);
}

.plugin__title {
  margin-bottom: var(--spacing-20);
}

.plugin__tabs {
  display: flex;
  gap: var(--spacing-8);
}

.plugin__tab-item {
  transition: all 0.3s ease;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--lf-primary); /* Light mode secondary text */
  border-bottom: 2px solid transparent;
}

[data-theme="dark"] .plugin__tab-item {
  color: var(--df-primary); /* Dark mode secondary text */
}

.is-selected {
  color: var(--la-primary); /* Light mode accent text */
  position: relative;
  border-bottom: 2px solid var(--la-primary);
}

[data-theme="dark"] .is-selected {
  color: var(--da-primary); /* Dark mode accent text */
  border-bottom: 2px solid var(--da-primary);
}

.is-selected::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-primary);
}
</style>
