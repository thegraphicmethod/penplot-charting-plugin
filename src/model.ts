/**
 * This file contains the typescript interfaces for the plugin events.
 */

interface ChartDimensions {
  width: number;
  height: number;
}

interface CreateChartMessage {
  type: 'create-chart';
  content: string;
  dimensions: ChartDimensions;
}

interface ThemeMessage {
  type: 'theme';
  content: string;
}

export type PluginMessageEvent = CreateChartMessage | ThemeMessage;
