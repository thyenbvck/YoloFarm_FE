import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function LoginLayout() {
  useEffect(() => {
    document.body.style.background = "#74f650";
    document.body.style.background =
      "-webkit-linear-gradient(to right, #1E5938, #6ebd8f)";
    document.body.style.background =
      "linear-gradient(to right, #1E5938, #6ebd8f)";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
}
