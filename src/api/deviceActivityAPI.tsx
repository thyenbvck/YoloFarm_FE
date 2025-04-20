import type { HistoryRecord } from "@/types/HistoryRecord.js";
export const fetchDeviceActivity = async (): Promise<HistoryRecord[]> => {
  try {
    const res = await fetch("http://localhost:8080/api/devicelog/logs");

    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }

    const data = await res.json();
    return data.data as HistoryRecord[];
  } catch (err) {
    console.error("Lỗi khi tải thông báo:", err);
    return [];
  }
};
