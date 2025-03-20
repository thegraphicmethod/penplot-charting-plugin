<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'update', data: any[]): void
}>();

const pasteArea = ref<HTMLTextAreaElement | null>(null);

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text');
  
  if (!pasteData) return;

  try {
    // Split by newlines and filter empty rows
    const rows = pasteData.split('\n').filter(row => row.trim());
    
    // Detect delimiter (tab or comma)
    const delimiter = rows[0].includes('\t') ? '\t' : ',';
    
    // Parse headers
    const headers = rows[0].split(delimiter).map(h => h.trim());
    
    if (headers.length < 2) {
      throw new Error('Data must have at least two columns');
    }

    // Parse data rows
    const data = rows.slice(1).map(row => {
      const values = row.split(delimiter);
      if (values.length !== headers.length) return null;

      // For line/radar charts: first column is x, rest are series
      const series: Record<string, number> = {};
      headers.slice(1).forEach((header, index) => {
        const value = parseFloat(values[index + 1]);
        if (!isNaN(value)) {
          series[header] = value;
        }
      });

      return {
        x: values[0],
        series
      };
    }).filter(Boolean);

    if (data.length > 0) {
      emit('update', data);
      if (pasteArea.value) {
        pasteArea.value.value = formatDataPreview(data);
      }
    }
  } catch (error) {
    console.error('Error parsing pasted data:', error);
  }
};

const formatDataPreview = (data: any[]) => {
  if (data.length === 0) return '';
  
  const headers = ['x', ...Object.keys(data[0].series)];
  const rows = data.map(d => [d.x, ...Object.values(d.series)]);
  
  return [
    headers.join('\t'),
    ...rows.map(row => row.join('\t'))
  ].join('\n');
};
</script>

<template>
  <div class="data-paste">
    <div class="plugin__field">
      <label class="plugin__label">Paste Data from CSV/Excel</label>
      <textarea
        ref="pasteArea"
        class="plugin__textarea"
        placeholder="Paste your data here...
Format: First column for labels, additional columns for values
Example:
Month   Sales   Costs
Jan     100     80
Feb     120     85
Mar     140     90"
        @paste="handlePaste"
      ></textarea>
    </div>
  </div>
</template>

<style scoped>
.data-paste {
  margin-bottom: var(--spacing-16);
}

.plugin__textarea {
  width: 100%;
  min-height: 100px;
  padding: var(--spacing-8);
  border: 1px solid var(--lb-tertiary);
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  resize: vertical;
}

[data-theme="dark"] .plugin__textarea {
  border-color: var(--db-tertiary);
  background-color: var(--db-primary);
  color: var(--df-primary);
}
</style> 