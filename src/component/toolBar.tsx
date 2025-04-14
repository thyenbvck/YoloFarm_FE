import React, { useState } from "react"
import { Moon, Sun, Circle, CheckCircle, Bell } from "lucide-react"
import NotificationBell from "./NotificationBell"
import { AlertData } from "@/types/Alert"
type UserInfoProps = {
  name: string;
  status: string;
  avatar: string;
};
const UserInfo = ({ name, status, avatar }:UserInfoProps) => {
  const alerts: AlertData[] = [
    {
      id: '1',
      type: 'TEMPERATURE',
      value: 80,
      message: 'Cảnh báo nhiệt độ cao',
      createdAt: new Date(),
    },
    {
      id: '2',
      type: 'HUMIDITY',
      value: 90,
      message: 'Độ ẩm vượt ngưỡng',
      createdAt: new Date(),
    },
  ]
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hasNotification, setHasNotification] = useState(true) // giả lập có thông báo

  return (
    <div
      className={`w-full rounded-lg flex items-center justify-between p-2 shadow-lg z-50 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-green-700 text-white"
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
      <div className="p-4">
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
  )
}

export default UserInfo
