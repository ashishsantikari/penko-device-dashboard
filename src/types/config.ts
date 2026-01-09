export interface FieldConfig {
  name: string;
  label: string;
  unit?: string;
  type: 'number' | 'string' | 'boolean';
  format?: 'decimal' | 'integer';
  decimalPlaces?: number;
  enum?: string[];
}

export interface DisplayConfig {
  grid: {
    columns: number;
    cardFields: string[];
    enableDragDrop: boolean;
    dragHandle: 'hover' | 'always';
  };
  table: {
    columns: string[];
    enableDragDrop: boolean;
    dragHandle: 'hover' | 'always';
  };
}

export interface DeviceConfig {
  fields: FieldConfig[];
  display: DisplayConfig;
}

export interface AppConfig {
  devices: DeviceConfig;
}
