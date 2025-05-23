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
    [],
  );
  const [isLightOn, setIsLightOn] = useState<boolean>(false);
  const [isPumpOn, setIsPumpOn] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [time, setTime] = useState<string>("");
  const handleControl = async (
    device: "den" | "maybom",
    action: "on" | "off",
  ) => {
    try {
      const result = await websocketService.sendCommand(device, action);
      console.log("✔️ Kết quả:", result);
      alert(`Đã gửi lệnh ${action} cho thiết bị ${device}`);
    } catch (error) {
      console.error("❌ Lỗi:", error);
      alert("Gửi lệnh thất bại");
    }
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
    websocketService.onAlert((alert) => {
      setAlerts((prev) => [...prev, alert]);
      setTimeout(() => {
        setAlerts((prev) =>
          prev.filter((a) => a.createdAt !== alert.createdAt),
        );
      }, 3000);
      if (alert.type === "TEMPERATURE") {
        websocketService.sendCommand("maybom", "on");
      } else if (alert.type === "LIGHT") {
        if (isLightOn === true) {
          websocketService.sendCommand("den", "off");
        }
      }
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
        width={450}
        height={250}
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
    <div className="flex">
      <div className="w-1/7 bg-gray-200">
        <Sidebar />
      </div>
      <div className="flex-grow p-3 bg-gray-100">
        <div className="grid grid-cols-12 gap-3 auto-rows-auto">
          <div className="col-span-12 ">
            <UserInfo name="Bach Hoang" status="available" avatar={avatar} />
            {/* <Button onClick={handleShowAlert}>Alert</Button> */}
          </div>

          <div className="col-span-2 row-span-2 bg-greenStart text-white rounded-lg shadow-xl flex items-center justify-center p-6 hover:scale-105 transition-transform duration-300">
  <div className="text-center">
    <p className="text-lg font-semibold text-gray-300">Smart Farm</p>
    <h1 className="text-4xl font-extrabold text-white leading-tight mt-2">
      No. 1
    </h1>
  </div>
</div>


<div className="col-span-6 row-span-2 bg-gradient-to-r bg-greenStart text-white rounded-lg shadow-xl text-center relative p-8 hover:scale-105 transition-transform duration-300">
  <p className="text-3xl font-extrabold absolute right-12 top-4 drop-shadow-lg">{time}</p> {/* Giờ */}
  <p className="text-5xl font-extrabold absolute right-12 top-1/2 transform -translate-y-1/2 drop-shadow-lg">{`Hồ Chí Minh`}</p> {/* Hồ Chí Minh */}
  <p className="text-xs absolute right-12 bottom-4 text-gray-200">{new Date().toLocaleDateString("vi-VN")}</p> {/* Ngày */}
</div>



          <div className="col-span-2 row-span-2 bg-white p-4 shadow-lg rounded-lg flex flex-col justify-center items-center gap-4">
            <div className="flex flex-wrap justify-center items-center gap-4 w-full">
              <span className="text-3xl text-yellow-500">💡</span>
              <p className="text-xl font-bold text-yellow-600 whitespace-nowrap">
                LIGHT
              </p>
              <button
                className={`px-4 py-2 rounded-full text-white transition ${
                  isLightOn ? "bg-yellow-500" : "bg-gray-500"
                }`}
                onClick={toggleLight}
              >
                {isLightOn ? "Turn Off" : "Turn On"}
              </button>
            </div>
          </div>

          <div className="col-span-2 row-span-2 bg-white shadow-lg rounded-lg flex flex-col justify-center items-center">
            <div className="flex flex-wrap justify-center items-center gap-4 w-full">
              <span className="text-3xl text-blue-500">💦</span>
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
              <h2 className="text-lg font-semibold mb-2 pl-35">Temperature</h2>
            </div>
            <div className="w-1/3">
              <div className="flex justify-center mt-3">
                {renderChart(humidityData, "#ff0000")}
              </div>
              <h2 className="text-lg font-semibold mb-2 pl-45">Humidity</h2>
            </div>

            <div className="w-1/3">
              <div className="flex justify-center mt-3">
                {renderChart(lightData, "#ff0000")}
              </div>
              <h2 className="text-lg font-semibold mb-2 pl-50">Light</h2>
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
