import React, { useState, useEffect } from "react";
import { Moon, Sun, Circle, CheckCircle, Bell } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { AlertData } from "@/types/Alert";
import { fetchAlerts } from "@/api/getNotificationAPI";
type UserInfoProps = {
  name: string;
  status: string;
  avatar: string;
};
const UserInfo = ({ name, status, avatar }: UserInfoProps) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  // const alerts: AlertData[] = [
  //   {
  //     id: "1",
  //     type: "TEMPERATURE",
  //     value: 80,
  //     message: "Cảnh báo nhiệt độ cao",
  //     createdAt: new Date(),
  //   },
  //   {
  //     id: "2",
  //     type: "HUMIDITY",
  //     value: 90,
  //     message: "Độ ẩm vượt ngưỡng",
  //     createdAt: new Date(),
  //   },
  //   {
  //     id: "3",
  //     type: "HUMIDITY",
  //     value: 90,
  //     message: "Độ ẩm vượt ngưỡng",
  //     createdAt: new Date(),
  //   },
  //   {
  //     id: "4",
  //     type: "HUMIDITY",
  //     value: 90,
  //     message: "Độ ẩm vượt ngưỡng",
  //     createdAt: new Date(),
  //   },
  // ];
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const getAlerts = async () => {
      const data = await fetchAlerts();
      const sortedAlerts = [...data].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }).slice(0, 10);
      setAlerts(sortedAlerts);
    };

    getAlerts();
  }, []);
  return (
    <div
      className={`w-full rounded-lg flex items-center justify-between  p-2 shadow-lg z-50 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-greenStart  text-white"
      }`}
    >
      {/* Light/Dark Mode Toggle */}
      {/* <button
        className="flex items-center px-3 py-1 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        <span className="ml-2">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
      </button> */}
      {/* User Info */}
      <div className="flex items-center">
        <div className="p-2">
          <NotificationBell alerts={alerts} />
        </div>
        <img
          src={avatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        {/* <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="flex items-center text-sm">
            {status === "available" ? (
              <CheckCircle className="w-4 h-4 text-green-300 mr-1" />
            ) : (
              <Circle className="w-4 h-4 text-gray-300 mr-1" />
            )}
            {status}
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default UserInfo;
