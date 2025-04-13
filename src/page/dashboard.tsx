import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar.js";
import UserInfo from "../component/toolBar.jsx";
import avatar from "../assets/avt.jpg";
import websocketService from "../api/dashboardAPI.js";
import { getLocationAndTime } from "@/utils/LocationandTime.js";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import type { AlertData } from "@/types/Alert.js";
import { AlertComponent } from "@/component/Alert.js";
import { Button } from "@/components/ui/button.js";
const Dashboard = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [light, setLight] = useState<number | null>(null);
  const [soilMoisture, setSoilMoisture] = useState<number>(50);
  const [temperatureData, setTemperatureData] = useState<
    { time: string; value: number }[]
  >([]);
  const [humidityData, setHumidityData] = useState<
    { time: string; value: number }[]
  >([]);
  const [lightData, setLightData] = useState<{ time: string; value: number }[]>(
    []
  );
  const [isLightOn, setIsLightOn] = useState<boolean>(false);
  const [isPumpOn, setIsPumpOn] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [time, setTime] = useState<string>("");
  const handleShowAlert = () => {
    const newAlert: AlertData = {
      id: crypto.randomUUID(), // Dùng UUID để tạo id ngẫu nhiên
      type: "TEMPERATURE", // Đảm bảo type chỉ nhận một trong các giá trị đã khai báo
      value: 80,
      message: "Cảnh báo nhiệt độ",
      createdAt: new Date(),
    };
    setAlerts((prev) => [...prev, newAlert]);
    // Xóa alert sau 3 giây
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== newAlert.id));
    }, 3000);
  };
  useEffect(() => {
    websocketService.onSensorData((data) => {
      const timestamp = new Date().toLocaleTimeString();
      if (data.type === "SOIL_MOISTURE") {
        setSoilMoisture(data.value);
      }
      if (data.type === "TEMPERATURE") {
        setTemperature(data.value);
        setTemperatureData((prev) => [
          ...prev.slice(-10),
          { time: timestamp, value: data.value },
        ]);
      }
      if (data.type === "HUMIDITY") {
        setHumidity(data.value);
        setHumidityData((prev) => [
          ...prev.slice(-10),
          { time: timestamp, value: data.value },
        ]);
      }
      if (data.type === "LIGHT") {
        setLight(data.value);
        setLightData((prev) => [
          ...prev.slice(-10),
          { time: timestamp, value: data.value },
        ]);
      }
    });
    websocketService.onDeviceActivity((activity) => {
      if (activity.deviceName === "den") {
        setIsLightOn(activity.action === "on");
      }
      if (activity.deviceName === "maybom") {
        setIsPumpOn(activity.action === "on");
      }
    });

    // Lắng nghe cảnh báo
    websocketService.onAlert((alert) => {
      setAlerts((prev) => [...prev, alert]);

      // Tự động ẩn alert sau 3 giây
      setTimeout(() => {
        setAlerts((prev) =>
          prev.filter((a) => a.createdAt !== alert.createdAt)
        );
      }, 3000);
    });
  }, []);
  useEffect(() => {
    getLocationAndTime()
      .then(({ latitude, longitude, dateTime }) => {
        setLocation({ latitude, longitude });
        setTime(dateTime);
      })
      .catch((err) => {
        console.error("Lỗi:", err.message);
      });
  }, []);
  const getColor = (value: number) => {
    if (value < 30) return "#16a34a"; // Xanh lá
    if (value < 60) return "#eab308"; // Vàng
    return "#dc2626"; // Đỏ
  };

  const soilMoistureData = [
    {
      name: "Soil Moisture",
      value: soilMoisture,
      fill: getColor(soilMoisture),
    },
  ];

  const renderChart = (data: any[], color: string) => {
    return (
      <LineChart
        width={500}
        height={300}
        data={data.length > 0 ? data : [{ time: "", value: 0 }]}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke={color} />
      </LineChart>
    );
  };
  const toggleLight = () => {
    setIsLightOn((prev) => !prev);
    websocketService.sendCommand("den", isLightOn ? "off" : "on");
  };

  const togglePump = () => {
    setIsPumpOn((prev) => !prev);
    websocketService.sendCommand("maybom", isPumpOn ? "off" : "on");
  };
  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200">
        <Sidebar />
      </div>
      <div className="flex-grow p-5 bg-gray-100">
        <div className="grid grid-cols-12 gap-4 auto-rows-auto">
          <div className="col-span-12">
            <UserInfo name="Bach Hoang" status="available" avatar={avatar} />
          </div>

          <div className="col-span-3 row-span-2 bg-green-600 text-white p-5 rounded-lg shadow-lg text-center">
            <p className="text-lg">Smart Farm</p>
            <h1 className="text-3xl font-bold">No. 1</h1>
          </div>

          <div className="col-span-6 row-span-2 bg-green-600 text-white p-5 rounded-lg shadow-lg text-center relative">
            <p className="text-lg absolute right-20 top-7">Hồ Chí Minh</p>
            <p className="text-lg absolute right-12 bottom-7">{time}</p>
          </div>
          <div className="col-span-3 row-span-1 bg-white p-4 shadow-lg rounded-lg text-center">
  <div className="flex items-center justify-center gap-4">
    <span className="text-5xl text-yellow-500">💡</span>
    <p className="text-xl font-bold text-yellow-600">LIGHT</p>
    <button
      className={`ml-4 px-4 py-2 rounded-full text-white transition ${
        isLightOn ? "bg-yellow-500" : "bg-gray-500"
      }`}
      onClick={toggleLight}
    >
      {isLightOn ? "Turn Off" : "Turn On"}
    </button>
  </div>
</div>


<div className="col-span-3 row-span-1 bg-white p-4 shadow-lg rounded-lg">
  <div className="flex items-center justify-center gap-4">
    <span className="text-5xl text-blue-500">💦</span>
    <p className="text-xl font-bold text-blue-600">PUMP</p>
    <button
      className={`ml-4 px-4 py-2 rounded-full text-white transition ${
        isPumpOn ? "bg-blue-500" : "bg-gray-500"
      }`}
      onClick={togglePump}
    >
      {isPumpOn ? "Turn Off" : "Turn On"}
    </button>
  </div>
</div>

          <div className="col-span-3 bg-white p-4 shadow-lg rounded-lg text-center">
            <p className="text-red-500 font-bold">🌡 TEMPERATURE</p>
            <p className="text-xl font-semibold">{temperature}°C</p>
          </div>

          <div className="col-span-3 row-span-1 bg-white p-4 shadow-lg rounded-lg text-center">
            <p className="text-blue-500 font-bold">💧 HUMIDITY</p>
            <p className="text-xl font-semibold">{humidity}%</p>
          </div>

          <div className="col-span-3 row-span-1 bg-white p-4 shadow-lg rounded-lg text-center">
            <p className="text-yellow-500 font-bold">☀ LIGHT</p>
            <p className="text-xl font-semibold">{light} Lux</p>
          </div>
          
          <div className="w-[200px] h-[120px] flex flex-col items-center overflow-hidden pl-20">
            <p className="text-gray-800 text-l font-bold">ĐỘ ẨM ĐẤT</p>
            <div className="relative flex justify-center">
              <RadialBarChart
                width={200}
                height={200}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="90%"
                barSize={12}
                data={soilMoistureData}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar background dataKey="value" angleAxisId={0} />
              </RadialBarChart>
              <p className="absolute text-xl font-semibold mt-18">
                {soilMoisture}%
              </p>
            </div>
          </div>
          <div className="col-span-12 flex">
            {/* Slider - Chiếm 9 cột */}
            <div className="w-1/3">
              <div className="flex justify-center mt-3">
                {renderChart(temperatureData, "#ff0000")}
              </div>
              <h2 className="text-lg font-semibold mb-2 pl-55">Nhiệt độ</h2>
            </div>
            <div className="w-1/3">
              <div className="flex justify-center mt-3">
                {renderChart(humidityData, "#ff0000")}
              </div>
              <h2 className="text-lg font-semibold mb-2 pl-55">Độ ẩm</h2>
            </div>

            <div className="w-1/3">
              <div className="flex justify-center mt-3">
                {renderChart(lightData, "#ff0000")}
              </div>
              <h2 className="text-lg font-semibold mb-2 pl-55">Ánh sáng</h2>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "fixed", top: 0, right: 0, zIndex: 1000 }}>
        {alerts.map((alert) => (
          <AlertComponent alert={alert} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
