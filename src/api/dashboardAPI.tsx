import { Client } from "@stomp/stompjs";

interface SensorData {
  type: "TEMPERATURE" | "HUMIDITY" | "LIGHT" | "SOIL_MOISTURE";
  value: number;
  recordedAt: Date;
}

interface DeviceActivity {
  deviceName: "den" | "maybom";
  action: "on" | "off";
  triggeredBy: "System" | "User";
  reason: string;
  timestamp: Date;
}

interface Alert {
  type: "TEMPERATURE" | "HUMIDITY" | "LIGHT" | "SOIL_MOISTURE";
  value: number;
  message: string;
  createdAt: Date;
}

class WebSocketService {
  private client: Client;
  private listeners: {
    onSensorData?: (data: SensorData) => void;
    onDeviceActivity?: (activity: DeviceActivity) => void;
    onAlert?: (alert: Alert) => void;
  } = {};

  constructor() {
    this.client = new Client({
      brokerURL: "ws://localhost:8080/api/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Kết nối WebSocket thành công!");

        // Lắng nghe dữ liệu cảm biến
        this.client.subscribe("/topic/microbit/nhietdo", (message) => {
          let data: SensorData = JSON.parse(message.body);
          this.listeners.onSensorData?.(data);
        });

        this.client.subscribe("/topic/microbit/doam", (message) => {
          let data: SensorData = JSON.parse(message.body);
          this.listeners.onSensorData?.(data);
        });

        this.client.subscribe("/topic/microbit/dosang", (message) => {
          let data: SensorData = JSON.parse(message.body);
          this.listeners.onSensorData?.(data);
        });

        this.client.subscribe("/topic/microbit/doamdat", (message) => {
          let data: SensorData = JSON.parse(message.body);
          this.listeners.onSensorData?.(data);
        });

        // Lắng nghe trạng thái máy bơm & đèn
        this.client.subscribe("/topic/microbit/maybom", (message) => {
          let activity: DeviceActivity = JSON.parse(message.body);
          this.listeners.onDeviceActivity?.(activity);
        });

        this.client.subscribe("/topic/microbit/den", (message) => {
          let activity: DeviceActivity = JSON.parse(message.body);
          this.listeners.onDeviceActivity?.(activity);
        });

        // Lắng nghe cảnh báo
        this.client.subscribe("/topic/microbit/limit", (message) => {
          let alert: Alert = JSON.parse(message.body);
          this.listeners.onAlert?.(alert);
        });
      },
      onStompError: (error) => console.error("❌ Lỗi STOMP:", error),
    });

    this.client.activate();
  }

  // Đăng ký callback khi có dữ liệu cảm biến
  onSensorData(callback: (data: SensorData) => void) {
    this.listeners.onSensorData = callback;
  }

  // Đăng ký callback khi có trạng thái máy bơm/đèn
  onDeviceActivity(callback: (activity: DeviceActivity) => void) {
    this.listeners.onDeviceActivity = callback;
  }

  // Đăng ký callback khi có cảnh báo
  onAlert(callback: (alert: Alert) => void) {
    this.listeners.onAlert = callback;
  }

  // Gửi lệnh điều khiển thiết bị
  sendCommand(device: "den" | "maybom", action: "on" | "off") {
    const deviceActivity: DeviceActivity = {
      deviceName: device,
      action,
      triggeredBy: "User",
      reason: action === "on" ? `Turned on ${device}` : `Turned off ${device}`,
      timestamp: new Date(),
    };

    const destination = device === "den" ? "/app/den" : "/app/maybom";
    this.client.publish({ destination, body: JSON.stringify(deviceActivity) });

    console.log(`🟢 Gửi lệnh: ${device} -> ${action}`);
  }
}

const websocketService = new WebSocketService();
export default websocketService;
