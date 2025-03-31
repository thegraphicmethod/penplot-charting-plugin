<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{
  initialData?: any[]
}>();

const emit = defineEmits<{
  (e: 'update', data: any[]): void
}>();

// Add this function to sanitize series names
const sanitizeSeriesName = (name: string) => {
  return name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
};

// Initialize refs
const rowCount = ref(4);
const columnCount = ref(1);
const headers = ref<string[]>(['x', 'series-1']);
const rows = ref<Array<{ x: string, series: Record<string, number> }>>([]);

// Generate random number between 0 and 100
const generateRandomValue = () => Math.floor(Math.random() * 100);

// Initialize data function
const initializeData = () => {
  rows.value = Array(rowCount.value).fill(null).map((_, i) => ({
    x: `Item ${i + 1}`,
    series: Object.fromEntries(
      headers.value.slice(1).map(h => [h, generateRandomValue()])
    )
  }));
  emitUpdate();
};

// Update headers function
const updateHeaders = (newCount: number) => {
  const targetLength = newCount + 1; // Add 1 for 'x' column
  const currentHeaders = [...headers.value]; // Create a copy to avoid mutation

  if (targetLength > currentHeaders.length) {
    // Add new headers with sanitized names
    for (let i = currentHeaders.length; i < targetLength; i++) {
      currentHeaders.push(`series-${i}`);
    }
  } else {
    // Remove extra headers
    currentHeaders.splice(targetLength);
  }

  headers.value = currentHeaders;
};

// Update rows function
const updateRows = () => {
  rows.value = rows.value.map(row => ({
    x: row.x,
    series: Object.fromEntries(
      headers.value.slice(1).map(h => [h, row.series[h] ?? generateRandomValue()])
    )
  }));
  emitUpdate();
};

// Watch effects
watch(rowCount, () => {
  initializeData();
});

watch(columnCount, (newCount) => {
  updateHeaders(newCount);
  updateRows();
});

// Initialize on mount
onMounted(() => {
  initializeData();
});

const emitUpdate = () => {
  if (!rows.value) return; // Guard against undefined rows
  emit('update', rows.value);
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text');
  
  if (!pasteData) return;

  try {
    // Split by newlines and filter empty rows
    const pastedRows = pasteData.split('\n').filter(row => row.trim());
    
    // Detect delimiter (tab or comma)
    const delimiter = pastedRows[0].includes('\t') ? '\t' : ',';
    
    // Parse headers from first row and sanitize them
    const pastedHeaders = pastedRows[0].split(delimiter)
      .map(h => h.trim())
      .map((h, i) => i === 0 ? 'x' : sanitizeSeriesName(h));
    
    if (pastedHeaders.length < 2) {
      throw new Error('Data must have at least two columns');
    }

    // Update column count and headers (subtract 1 to not count 'x' column)
    columnCount.value = pastedHeaders.length - 1;
    headers.value = pastedHeaders;

    // Parse data rows
    const parsedRows = pastedRows.slice(1)
      .map(row => {
        const values = row.split(delimiter).map(v => v.trim());
        if (values.length !== pastedHeaders.length) return null;

        const series: Record<string, number> = {};
        // Start from index 1 to skip the label column
        for (let i = 1; i < pastedHeaders.length; i++) {
          const header = pastedHeaders[i];
          const value = parseFloat(values[i]);
          series[header] = isNaN(value) ? 0 : value;
        }

        return {
          x: values[0],
          series
        };
      })
      .filter((row): row is { x: string; series: Record<string, number> } => row !== null);

    if (parsedRows.length > 0) {
      rowCount.value = parsedRows.length;
      rows.value = parsedRows;
      emitUpdate();
    }
  } catch (error) {
    console.error('Error parsing pasted data:', error);
  }
};

const updateCell = (rowIndex: number, header: string, value: string) => {
  if (!rows.value[rowIndex]) return; // Guard against undefined row

  if (header === 'x') {
    rows.value[rowIndex].x = value;
  } else {
    rows.value[rowIndex].series[header] = parseFloat(value) || 0;
  }
  emitUpdate();
};
</script>

<template>
  <div class="chart-editor">
    <div class="plugin__field-group">
      <div class="plugin__field">
        <label class="plugin__label">Number of rows</label>
        <input 
          type="number" 
          v-model="rowCount"
          min="2"
          max="20"
          class="plugin__input input"
        >
      </div>

      <div class="plugin__field">
        <label class="plugin__label">Number of series</label>
        <input 
          type="number" 
          v-model="columnCount"
          min="1"
          max="10"
          class="plugin__input input"
        >
      </div>
    </div>

    <div class="plugin__field">
      <label class="plugin__label">Data Table (Ctrl/Cmd + V to paste data)</label>
      <div class="table-container">
        <table class="plugin__table" @paste="handlePaste">
          <thead>
            <tr>
              <th v-for="header in headers" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
              <td v-for="header in headers" :key="header">
                <input 
                  type="text"
                  :value="header === 'x' ? row.x : row.series[header]"
                  @input="(e) => updateCell(rowIndex, header, (e.target as HTMLInputElement).value)"
                  class="plugin__input input"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
  margin-bottom: var(--spacing-16);
}

.plugin__field {
  flex: 1;
}

.plugin__input {

  
  
}

.table-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--lb-tertiary);
  border-radius: 4px;
}

.plugin__table {
  width: 100%;
  border-collapse: collapse;
}

.plugin__table th,
.plugin__table td {
  padding: var(--spacing-4);
  text-align: left;
  border: 1px solid var(--lb-tertiary);
}

.plugin__table th {
  position: sticky;
  top: 0;
  background-color: var(--lb-tertiary);
  color: var(--lf-primary);
  z-index: 1;
}

.plugin__table input {
  width: 100%;
  border: none;
  background: none;
  padding: var(--spacing-4);
}

/* [data-theme="dark"] .plugin__input {
  border-color: var(--db-tertiary);
  color: var(--df-primary);
} */

[data-theme="dark"] .table-container {
  border-color: var(--db-tertiary);
}

[data-theme="dark"] .plugin__table th,
[data-theme="dark"] .plugin__table td {
  border-color: var(--db-tertiary);
}

[data-theme="dark"] .plugin__table th {
  background-color: var(--db-tertiary);
  color: var(--df-primary);
}

[data-theme="dark"] .plugin__table input {
  color: var(--df-primary);
}
</style> 