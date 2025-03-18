import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useState } from "react";
import Sidebar from "../component/sidebar.tsx";
import UserInfo from "../component/toolBar.jsx";
import avatar from "../assets/avt.jpg"
import WebSocketComponent from "../api/dashboardAPI";
const Dashboard = () => {
  const [lightMode, setLightMode] = useState(true);
  const data = [
    { name: "1", temp: 20, humidity: 50, light: 800 },
    { name: "2", temp: 22, humidity: 55, light: 850 },
    { name: "3", temp: 23, humidity: 60, light: 900 },
  ];

  return (
<div className="flex h-screen">
<div className="left-section w-1/4 bg-gray-200">
    <Sidebar />
    <WebSocketComponent/>
  </div>
  <div className="right-section flex-grow p-5 bg-gray-100">
  <div className="grid grid-cols-12 gap-4 auto-rows-auto">
  <div className="col-span-12">
  <UserInfo name="Bach Hoang" status="available" avatar={avatar} />
</div>
    {/* Đồng hồ + Vị trí */}
    <div className="col-span-3 row-span-1  bg-green-600 text-white p-5 rounded-lg shadow-lg flex flex-col justify-center items-center max-h-[120px]">
      <p className="text-lg">Smart Farm</p>
      <h1 className="text-3xl font-bold">No. 1</h1>
    </div>
    <div className="relative col-span-6 row-span-1  bg-green-600 text-white p-5 rounded-lg shadow-lg flex flex-col justify-center items-center max-h-[120px]">

    <h1 className="text-4xl font-bold absolute left-5 top-1/2 transform -translate-y-1/2">
    09:03 AM</h1>
    <p className="text-lg absolute right-20 top-7">Hồ Chí Minh</p>
    <p className="text-lg absolute right-12 bottom-7">Thursday, March 15</p>
    </div>
        {/* Dự báo thời tiết */}
    <div className="col-span-3 row-span-4 bg-green-700 p-5 text-white rounded-lg shadow-lg">
      <h3 className="text-lg font-bold">Weather Forecast</h3>
      {[
        { day: "Sunday, March 16", temp: "25°C", rain: "Tiny rain" },
        { day: "Monday, March 17", temp: "23°C", rain: "Mid rain" },
        { day: "Tuesday, March 18", temp: "28°C", rain: "Tiny rain" },
      ].map((weather, index) => (
        <div key={index} className="mt-3 p-2 bg-green-800 rounded-lg">
          <p>{weather.day}</p>
          <p className="text-xl font-semibold">{weather.temp}</p>
          <p>{weather.rain}</p>
        </div>
      ))}
    </div>
    {/* Box thông tin môi trường */}
    <div className="col-span-3 row-span-1 bg-white p-4 shadow-lg rounded-lg text-center">
      <p className="text-red-500 font-bold">🌡 TEMPERATURE</p>
      <p className="text-xl font-semibold">25.5°C</p>
    </div>
    
    <div className="col-span-3 row-span-1 bg-white p-4 shadow-lg rounded-lg text-center">
      <p className="text-blue-500 font-bold">💧 HUMIDITY</p>
      <p className="text-xl font-semibold">18%</p>
    </div>

    <div className="col-span-3 row-span-1 bg-white p-4 shadow-lg rounded-lg text-center">
      <p className="text-yellow-500 font-bold">☀ LIGHT</p>
      <p className="text-xl font-semibold">1200 Lux</p>
    </div>

    {/* Biểu đồ nhiệt độ */}
    <div className="col-span-7 row-span-2 bg-white p-5 shadow-lg rounded-lg">
      <h3 className="text-lg font-bold mb-3">Temperature (°C)</h3>
      <LineChart width={400} height={200} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="temp" stroke="#ff0000" />
      </LineChart>
    </div>

    {/* Trạng thái quạt */}
    {["Fan 1", "Fan 2"].map((fan, index) => (
      <div key={index} className="col-span-2 row-span-1 bg-white p-5 shadow-lg rounded-lg flex flex-col items-center">
        <p className="text-lg font-bold">{fan}</p>
        <p>Status:</p>
        <span className={`w-4 h-4 rounded-full ${index % 2 === 0 ? "bg-green-500" : "bg-red-500"}`} />
      </div>
    ))}

    {/* Biểu đồ ánh sáng */}
    <div className="col-span-4 row-span-1 bg-white p-5 shadow-lg rounded-lg">
      <h3 className="text-lg font-bold mb-3">Light (Lux)</h3>
      <LineChart width={300} height={150} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="light" stroke="#ffaa00" />
      </LineChart>
    </div>

    {/* Biểu đồ độ ẩm */}
    <div className="col-span-3 row-span-1 bg-white p-5 shadow-lg rounded-lg">
      <h3 className="text-lg font-bold mb-3">Humidity (%)</h3>
      <LineChart width={300} height={150} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="humidity" stroke="#0000ff" />
      </LineChart>
    </div>


  </div>
</div>

    </div>
  );
};

export default Dashboard;
