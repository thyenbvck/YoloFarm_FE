import {
  Home,
  LayoutDashboard,
  Cloud,
  Sun,
  Thermometer,
  Users,
  FileText,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { JSX } from "react";

interface SidebarItemProps {
  icon: JSX.Element;
  text: string;
  active?: boolean;
}
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  active = false,
}) => {
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
    <div className="h-full w-60 bg-linear-to-b from-greenStart to-greenEnd text-white flex flex-col">
      <div>
        <ul className="p-4 space-y-3">
          <SidebarItem icon={<Home size={20} />} text="Home" />
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            active
          />
          <SidebarItem icon={<Cloud size={20} />} text="Humidity" />
          <SidebarItem icon={<Sun size={20} />} text="Light" />
          <SidebarItem icon={<Thermometer size={20} />} text="Temperature" />
          <SidebarItem icon={<Users size={20} />} text="Irrigation" />
        </ul>
      </div>

      {/* Bottom Section */}
      <div>
        <ul className="p-4 space-y-2">
          <SidebarItem icon={<FileText size={20} />} text="Report" />
          <SidebarItem icon={<Bell size={20} />} text="Notification" />
          <SidebarItem icon={<Settings size={20} />} text="Setting" />
          <button className="mt-4 flex items-center w-4/5 bg-gray-700 p-2  rounded-lg hover:bg-gray-600">
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
