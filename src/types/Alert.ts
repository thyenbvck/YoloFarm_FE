export interface AlertData {
  id: string;
  type: "TEMPERATURE" | "HUMIDITY" | "LIGHT" | "SOIL_MOISTURE";
  value: number;
  message: string;
  createdAt: Date;
}
