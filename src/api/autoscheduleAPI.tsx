import { Client } from "@stomp/stompjs";
import { AutoS } from "../types/AutoSchedule";

const API_URL = "https://example.com/api/schedules";

// REST API Functions
export const fetchSchedules = async (): Promise<AutoS[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch schedules");
  }
  return response.json();
};

export const createSchedule = async (schedule: Omit<AutoS, 'id'>): Promise<AutoS> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(schedule),
  });
  if (!response.ok) {
    throw new Error("Failed to create schedule");
  }
  return response.json();
};

export const updateSchedule = async (id: string, schedule: Partial<AutoS>): Promise<AutoS> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(schedule),
  });
  if (!response.ok) {
    throw new Error("Failed to update schedule");
  }
  return response.json();
};

export const deleteSchedule = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete schedule");
  }
};

// WebSocket Integration (Add to existing WebSocketService)
class WebSocketService {
    private client: Client;
    private listeners: {
    onScheduleUpdate?: (schedule: AutoS) => void;
    onSchedules?: (schedules: AutoS[]) => void;
  } = {};

  constructor() {
    this.client = new Client({
          brokerURL: "ws://localhost:8080/api/ws",
          reconnectDelay: 5000,
          onConnect: () => {
            console.log("✅ Kết nối WebSocket thành công!");
      
      // Add new subscriptions for schedules
      this.client.subscribe("/topic/schedules/updates", (message) => {
        const schedule: AutoS = JSON.parse(message.body);
        this.listeners.onScheduleUpdate?.(schedule);
      });

      this.client.subscribe("/topic/schedules/all", (message) => {
        const schedules: AutoS[] = JSON.parse(message.body);
        this.listeners.onSchedules?.(schedules);
      });
    }, onStompError: (error) => console.error("❌ Lỗi STOMP:", error),
  });
  this.client.activate();
}

  // ... existing methods ...

  // New methods for AutoSchedule
  onScheduleUpdate(callback: (schedule: AutoS) => void) {
    this.listeners.onScheduleUpdate = callback;
  }

  onSchedules(callback?: (schedules: AutoS[]) => void) {
    this.listeners.onSchedules = callback;
  }
  

  async fetchSchedules(): Promise<AutoS[]> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout when fetching schedules"));
      }, 5000);

      const tempListener = (schedules: AutoS[]) => {
        clearTimeout(timeout);
        resolve(schedules);
        this.listeners.onSchedules = undefined;
      };

      this.listeners.onSchedules = tempListener;
      this.client.publish({
        destination: "/app/schedules/get",
        body: JSON.stringify({ requestId: Date.now() }),
      });
    });
  }

  async updateSchedule(schedule: AutoS): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout when updating schedule"));
      }, 5000);

      const subscription = this.client.subscribe(
        `/temp-queue/schedules/update/${schedule}`,
        (message) => {
          clearTimeout(timeout);
          subscription.unsubscribe();
          const response = JSON.parse(message.body);
          if (response.success) {
            resolve();
          } else {
            reject(new Error(response.error || "Update failed"));
          }
        }
      );

      this.client.publish({
        destination: "/app/schedules/update",
        body: JSON.stringify(schedule),
        headers: {
          'reply-to': `/temp-queue/schedules/update/${schedule}`,
        },
      });
    });
  }
}

// Export the enhanced WebSocketService
const websocketService = new WebSocketService();
export default websocketService;