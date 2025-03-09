export interface BaseChartOptions {
  width?: number;
  height?: number;
}

export interface BarChartOptions extends BaseChartOptions {
  // Bar specific options can be added here
}

export interface PieChartOptions extends BaseChartOptions {
  // Pie specific options can be added here
}

export interface LineChartOptions extends BaseChartOptions {
  // Line specific options can be added here
} 