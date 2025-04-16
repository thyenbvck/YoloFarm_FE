import { AlertData } from "@/types/Alert";
export const fetchAlerts = async (): Promise<AlertData[]> => {
  try {
    const res = await fetch("/api/notifications");

    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }

    const data = await res.json();
    return data as AlertData[];
  } catch (err) {
    console.error("Lỗi khi tải thông báo:", err);
    return [];
  }
};
