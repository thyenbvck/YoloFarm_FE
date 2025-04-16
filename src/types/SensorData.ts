export interface SensorData {
  type: "TEMPERATURE" | "HUMIDITY" | "LIGHT" | "SOIL_MOISTURE";
  value: number;
  recordedAt: Date;
}
