import React, { useState, useEffect, useRef } from 'react';
import { AlertData } from "@/types/Alert";
import { Bell } from "lucide-react";
interface NotificationBellProps {
    alerts: AlertData[];
  }
  const NotificationBell: React.FC<NotificationBellProps> = ({ alerts }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    const toggleDropdown = () => setShowDropdown((prev) => !prev);
  
    // Đóng dropdown nếu click ra ngoài
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setShowDropdown(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    return (
      <div ref={dropdownRef} className="relative inline-block text-left">
        <button
          onClick={toggleDropdown}
          className="relative p-2 rounded-full hover:bg-gray-200 transition"
        >
          <Bell />
          {alerts.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
              {alerts.length}
            </span>
          )}
        </button>
  
        {showDropdown && (
          <div className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="p-2">
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">Không có cảnh báo</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="border-b py-2 px-2">
                    <p className="text-sm font-semibold text-red-600">
                      {alert.type} : {alert.value}
                    </p>
                    <p className="text-xs text-gray-500">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default NotificationBell;