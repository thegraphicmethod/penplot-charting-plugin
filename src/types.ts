export interface BaseChartOptions {
  width?: number;
  height?: number;
  colorScheme?: readonly string[]; // Add to base options since it's used by multiple charts
}

export interface TextData {
  content: string;
  x: number;
  y: number;
  align: 'left' | 'center' | 'right';  // Changed from textAlign to align to match Penpot's API
  name?: string;
  fontSize?: string;
  fontFamily?: string;
  fills?: Array<{
    fillColor: string;
    fillOpacity: number;
  }>;
}

export interface BarChartOptions extends BaseChartOptions {
  // Bar specific options can be added here
}

export interface PieChartOptions extends BaseChartOptions {
  innerRadius?: number; // 0 to 1, where 1 would be maximum possible inner radius
}

export interface LineChartOptions extends BaseChartOptions {
  showGrid?: boolean;
  showDots?: boolean;
  showArea?: boolean;
}

export interface RadarChartOptions extends BaseChartOptions {
  showFill?: boolean;
  gridColor?: string;
}

// Add these interfaces for chart results
export interface ChartResult {
  svg: string;
  texts: TextData[];
}

// Update the message types for each chart
export interface ChartCreateMessage {
  type: 'bar' | 'pie' | 'line' | 'radar';
  options: BaseChartOptions;
  content: ChartResult;
  data: any[];
} 