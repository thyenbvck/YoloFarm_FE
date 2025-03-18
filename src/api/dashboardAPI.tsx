import { useEffect } from "react";
import { Client } from "@stomp/stompjs";

interface DeviceActivity{
  deviceName: "den" | "maybom",
  action: "on" | "off",
  triggeredBy: "System" | "User",
  reason: string, 
  timestamp: Date
}

interface SensorData{
  type: "TEMPERATURE" | "HUMIDITY" | "LIGHT" | "SOIL_MOISTURE",
  value: number, 
  recordedAt: Date
}

interface Alert{
  type: "TEMPERATURE" | "HUMIDITY" | "LIGHT" | "SOIL_MOISTURE",
  value: number,
  message: string,
  createdAt: Date
}

export default function WebSocketComponent() {
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/api/ws",
      reconnectDelay: 5000, // Tự động reconnect nếu mất kết nối
      onConnect: () => {
        console.log("Kết nối thành công!");
        stompClient.subscribe("/topic/microbit/nhietdo", (message) => {
          let sensorData: SensorData = JSON.parse(message.body);
          console.log("Dữ liệu nhận được nhietdo:",sensorData);
        });
        stompClient.subscribe("/topic/microbit/doam", (message) => {
          let sensorData: SensorData = JSON.parse(message.body);
          console.log("Dữ liệu nhận được doam:", sensorData);
        });
        stompClient.subscribe("/topic/microbit/doamdat", (message) => {
          let sensorData: SensorData = JSON.parse(message.body);
          console.log("Dữ liệu nhận được doamdat:", sensorData);
        });
        stompClient.subscribe("/topic/microbit/dosang", (message) => {
          let sensorData: SensorData = JSON.parse(message.body);
          console.log("Dữ liệu nhận được dosang:", sensorData);
        });
        stompClient.subscribe("/topic/microbit/limit", (message) => {
          let alert: Alert = JSON.parse(message.body);
          console.log("Giá trị vượt ngưỡng:", alert);
        });
        stompClient.subscribe("/topic/microbit/maybom", (message) => {
          let deviceActivity: DeviceActivity = JSON.parse(message.body);
          console.log("Tương tác tự động với máy bơm:", deviceActivity);
        });
        stompClient.subscribe("/topic/microbit/den", (message) => {
          let deviceActivity:DeviceActivity = JSON.parse(message.body);
          console.log("Tương tác tự động với đèn:", deviceActivity);
        });
        let lightController: DeviceActivity = {
            deviceName: "den",
            action: "off",
            triggeredBy: "User",
            reason: "I want to turn on the light", 
            timestamp: new Date()
        };
        stompClient.publish({ destination: "/app/den", body: JSON.stringify(lightController)})
        let pumperController: DeviceActivity = {
          deviceName: "maybom",
          action: "off",
          triggeredBy: "User",
          reason: "I want to turn on the pumper", 
          timestamp: new Date()
      };
      stompClient.publish({ destination: "/app/maybom", body: JSON.stringify(pumperController)})
        // "/topic/microbit/maybom", (message) => {
        //   var deviceActivity = JSON.parse(message.body);
        //   console.log("Hệ thống tương tác tự động với máy bơm:", deviceActivity);
        // });
      },
      onStompError: (error) => console.error("Lỗi STOMP:", error),
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate(); // Không trả về Promise nữa
    };
  }, []);

  return <div>WebSocket đang chạy...</div>;
}