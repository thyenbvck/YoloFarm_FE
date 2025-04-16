import dayjs from "dayjs";

export interface LocationAndTime {
  latitude: number;
  longitude: number;
  dateTime: string;
}

/**
 * Lấy vị trí hiện tại (tọa độ) và thời gian định dạng.
 * @returns Promise<LocationAndTime>
 */
export function getLocationAndTime(): Promise<LocationAndTime> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Trình duyệt không hỗ trợ định vị vị trí"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const dateTime = dayjs().format("HH:mm:ss DD/MM/YYYY");
        resolve({ latitude, longitude, dateTime });
      },
      (error) => {
        reject(new Error("Lỗi khi lấy vị trí: " + error.message));
      },
    );
  });
}
