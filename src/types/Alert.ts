export interface Alert {
  type: "TEMPERATURE" | "HUMIDITY" | "LIGHT" | "SOIL_MOISTURE";
  value: number;
  message: string;
  createdAt: Date;
}