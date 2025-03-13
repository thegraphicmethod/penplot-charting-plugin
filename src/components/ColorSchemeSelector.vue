<script setup lang="ts">
import { ref, watch } from 'vue';
import * as d3 from 'd3';

const props = defineProps<{
  modelValue: readonly string[]
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: readonly string[]): void
}>();

// Available categorical color schemes from D3
const colorSchemes = {
  'Tableau10': d3.schemeTableau10,
  'Category10': d3.schemeCategory10,
  'Accent': d3.schemeAccent,
  'Dark2': d3.schemeDark2,
  'Paired': d3.schemePaired,
  'Pastel1': d3.schemePastel1,
  'Pastel2': d3.schemePastel2,
  'Set1': d3.schemeSet1,
  'Set2': d3.schemeSet2,
  'Set3': d3.schemeSet3
} as const;

// Track the selected scheme name
const selectedScheme = ref('Tableau10');

const handleChange = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  const scheme = colorSchemes[select.value as keyof typeof colorSchemes];
  selectedScheme.value = select.value;
  emit('update:modelValue', scheme);
};

// Initialize with default scheme
watch(() => props.modelValue, (newValue) => {
  // Update selected scheme name if modelValue changes externally
  const entry = Object.entries(colorSchemes).find(([_, scheme]) => scheme === newValue);
  if (entry) {
    selectedScheme.value = entry[0];
  }
}, { immediate: true });
</script>

<template>
  <div class="color-scheme-selector">
    <label class="plugin__label">Color Scheme</label>
    <div class="selector-container">
      <select 
        class="plugin__select"
        :value="selectedScheme"
        @change="handleChange"
      >
        <option 
          v-for="[name] in Object.entries(colorSchemes)" 
          :key="name"
          :value="name"
        >
          {{ name }}
        </option>
      </select>
      <div class="color-preview">
        <div 
          v-for="color in modelValue" 
          :key="color"
          class="color-swatch"
          :style="{ backgroundColor: color }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-scheme-selector {
  margin-top: var(--spacing-16);
}

.selector-container {
  display: flex;
  gap: var(--spacing-8);
  align-items: center;
  margin-top: var(--spacing-4);
}

.plugin__select {
  flex: 1;
  min-width: 120px;
  color: var(--lf-primary);
}

.color-preview {
  display: flex;
  gap: 2px;
  padding: 4px;
  background: var(--lb-tertiary);
  border-radius: 4px;
}

.color-swatch {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

[data-theme="dark"] .color-preview {
  background: var(--db-tertiary);
}
</style> 