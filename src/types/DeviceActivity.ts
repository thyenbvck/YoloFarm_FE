export interface DeviceActivity {
  deviceName: "den" | "maybom";
  action: "on" | "off";
  triggeredBy: "System" | "User";
  reason: string;
  timestamp: Date;
}
