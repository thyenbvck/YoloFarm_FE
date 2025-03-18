import React, { useState } from "react";
import { Moon, Sun, Circle, CheckCircle } from "lucide-react";

const UserInfo = ({ name, status, avatar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`w-full rounded-lg  flex items-center justify-between p-4 shadow-lg z-50 ${isDarkMode ? "bg-gray-800 text-white" : "bg-green-700 text-white"}`}>
      {/* Light/Dark Mode Toggle */}
      <button
        className="flex items-center px-3 py-1 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        <span className="ml-2">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
      </button>

      {/* User Info */}
      <div className="flex items-center">
        <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="flex items-center text-sm">
            {status === "available" ? <CheckCircle className="w-4 h-4 text-green-300 mr-1" /> : <Circle className="w-4 h-4 text-gray-300 mr-1" />}
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
