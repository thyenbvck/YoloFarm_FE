import { Home, LayoutDashboard, Cloud, Sun, Thermometer, Users, FileText, Bell, Settings, LogOut } from "lucide-react";
import { JSX } from "react";

// Định nghĩa kiểu cho SidebarItem
interface SidebarItemProps {
  icon: JSX.Element;
  text: string;
  active?: boolean; // Active là tùy chọn
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active = false }) => {
  return (
    <li
      className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-600 transition ${active ? "bg-gray-700" : ""}`}
    >
      {icon}
      <span className="ml-3">{text}</span>
    </li>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-60 bg-gradient-to-b from-green-700 to-green-500 p-5 text-white flex flex-col justify-between">
      {/* Menu Items */}
      <div>
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          <SidebarItem icon={<Home size={20} />} text="Home" />
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active />
          <SidebarItem icon={<Cloud size={20} />} text="Humidity" />
          <SidebarItem icon={<Sun size={20} />} text="Light" />
          <SidebarItem icon={<Thermometer size={20} />} text="Temperature" />
          <SidebarItem icon={<Users size={20} />} text="Irrigation" />
        </ul>
      </div>

      {/* Bottom Section */}
      <div>
        <ul className="space-y-4">
          <SidebarItem icon={<FileText size={20} />} text="Report" />
          <SidebarItem icon={<Bell size={20} />} text="Notification" />
          <SidebarItem icon={<Settings size={20} />} text="Setting" />
        </ul>
        <button className="mt-6 flex items-center w-4/5 bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition">
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
