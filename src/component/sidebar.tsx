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
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const navigate = useNavigate();

  const routes = [
    { path: "/dashboard", icon: <Home size={20} />, text: "Home" },
    { path: "/dashboard", icon: <LayoutDashboard size={20} />, text: "Dashboard" },
    { path: "/dashboard", icon: <Cloud size={20} />, text: "Humidity" },
    { path: "/dashboard", icon: <Sun size={20} />, text: "Light" },
    { path: "/dashboard", icon: <Thermometer size={20} />, text: "Temperature" },
    { path: "/dashboard", icon: <Users size={20} />, text: "Irrigation" },
  ];

  const bottomRoutes = [
    { path: "/history", icon: <FileText size={20} />, text: "Report" },
    { path: "/notification", icon: <Bell size={20} />, text: "Notification" },
    { path: "/setting", icon: <Settings size={20} />, text: "Setting" },
  ];

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="h-screen w-60 bg-gradient-to-b from-greenStart to-greenEnd text-white flex flex-col">
      <div>
        <ul className="p-4 space-y-3">
          {routes.map((route) => (
            <div key={route.text} onClick={() => handleClick(route.path)}>
              <SidebarItem
                icon={route.icon}
                text={route.text}
                active={location.pathname === route.path}
              />
            </div>
          ))}
        </ul>
      </div>

      <div>
        <ul className="p-4 space-y-2">
          {bottomRoutes.map((route) => (
            <div key={route.text} onClick={() => handleClick(route.path)}>
              <SidebarItem
                icon={route.icon}
                text={route.text}
                active={location.pathname === route.path}
              />
            </div>
          ))}
          <button
            className="mt-4 flex items-center w-4/5 bg-gray-700 p-2 rounded-lg hover:bg-gray-600"
            onClick={() => navigate("/")}
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
