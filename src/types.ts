export interface BaseChartOptions {
  width?: number;
  height?: number;
  colorScheme?: readonly string[]; // Add to base options since it's used by multiple charts
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