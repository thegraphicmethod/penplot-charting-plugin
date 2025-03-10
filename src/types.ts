export interface BaseChartOptions {
  width?: number;
  height?: number;
}

export interface BarChartOptions extends BaseChartOptions {
  // Bar specific options can be added here
}

export interface PieChartOptions extends BaseChartOptions {
  innerRadius?: number; // 0 to 1, where 1 would be maximum possible inner radius
}

export interface LineChartOptions extends BaseChartOptions {
  // Line specific options can be added here
} 