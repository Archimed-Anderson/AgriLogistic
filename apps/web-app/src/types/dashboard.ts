export interface KPI {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  icon: string;
  chartData?: ChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface FieldMetrics {
  yield: {
    current: number;
    target: number;
    unit: 'kg/ha';
    trend: number;
  };
  humidity: {
    current: number;
    optimal: number;
    unit: '%';
    trend: number;
  };
  alerts: {
    count: number;
    critical: number;
    warnings: number;
    items: Alert[];
  };
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  field?: string;
}

export interface Field3DData {
  width: number;
  height: number;
  color: string;
  hoverColor?: string;
}
