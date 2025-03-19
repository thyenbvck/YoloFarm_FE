import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar.js";
import UserInfo from "../component/toolBar.jsx";
import avatar from "../assets/avt.jpg";
import websocketService from "../api/dashboardAPI.js";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
const Dashboard = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [light, setLight] = useState<number | null>(null);
  const [soilMoisture, setSoilMoisture] = useState<number>(50);
  const [temperatureData, setTemperatureData] = useState<{ time: string; value: number }[]>([]);
  const [humidityData, setHumidityData] = useState<{ time: string; value: number }[]>([]);
  const [lightData, setLightData] = useState<{ time: string; value: number }[]>([]);  
  const [isLightOn, setIsLightOn] = useState<boolean>(false);
  const [isPumpOn, setIsPumpOn] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    websocketService.onSensorData((data) => {
      const timestamp = new Date().toLocaleTimeString();
      if (data.type === "SOIL_MOISTURE") {
        setSoilMoisture(data.value);
      }
      if (data.type === "TEMPERATURE") {
        setTemperature(data.value);
        setTemperatureData((prev) => [...prev.slice(-10), { time: timestamp, value: data.value }]);
      }
      if (data.type === "HUMIDITY") {
        setHumidity(data.value);
        setHumidityData((prev) => [...prev.slice(-10), { time: timestamp, value: data.value }]);
      }
      if (data.type === "LIGHT") {
        setLight(data.value);
        setLightData((prev) => [...prev.slice(-10), { time: timestamp, value: data.value }]);
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
      setAlerts((prev) => [...prev, alert.message]);
    });
  }, []);

  const getColor = (value: number) => {
    if (value < 30) return "#16a34a"; // Xanh lá
    if (value < 60) return "#eab308"; // Vàng
    return "#dc2626"; // Đỏ
  };
  
  const soilMoistureData = [
    { name: "Soil Moisture", value: soilMoisture, fill: getColor(soilMoisture) },
  ];

  const renderChart = (data: any[], color: string) => {
    return (
      <LineChart width={600} height={300} data={data.length > 0 ? data : [{ time: '', value: 0 }]}>
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
          
          <div className="col-span-3 bg-green-600 text-white p-5 rounded-lg shadow-lg text-center">
            <p className="text-lg">Smart Farm</p>
            <h1 className="text-3xl font-bold">No. 1</h1>
          </div>

          <div className="col-span-6 bg-green-600 text-white p-5 rounded-lg shadow-lg text-center relative">
            <h1 className="text-4xl font-bold absolute left-5 top-1/2 transform -translate-y-1/2">09:03 AM</h1>
            <p className="text-lg absolute right-20 top-7">Hồ Chí Minh</p>
            <p className="text-lg absolute right-12 bottom-7">Thursday, March 15</p>
          </div>
          
          <div className="w-[200px] h-[120px] flex flex-col items-center overflow-hidden">
            <p className="text-gray-800 text-sm font-bold">ĐỘ ẨM ĐẤT</p>
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
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" angleAxisId={0} />
              </RadialBarChart>
              <p className="absolute text-xl font-semibold mt-18">{soilMoisture}%</p>
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

          <div className="col-span-12 flex">
  {/* Slider - Chiếm 9 cột */}
  <div className="w-3/4"> 
    <Slider
      dots={true}
      infinite={false}
      speed={500}
      slidesToShow={1} // Hiển thị 1 biểu đồ mỗi lần
      slidesToScroll={1} // Cuộn 1 slide mỗi lần vuốt
      autoplay={false}
      arrows={true}
      swipeToSlide={true}
      prevArrow={<div className="arrow left"><FaArrowLeft size={30} /></div>} // Customize left arrow
      nextArrow={<div className="arrow right"><FaArrowRight size={30} /></div>} // Customize right arrow
    >
      <div className="flex justify-center mt-6">
        {renderChart(temperatureData, "#ff0000")}
      </div>
      {/* <div className="flex justify-center">
        {renderChart(humidityData, "#0000ff")}
      </div>
      <div className="flex justify-center">
        {renderChart(lightData, "#ffcc00")}
      </div> */}
    </Slider>
  </div>

  {/* Pump & Light - Chiếm 3 cột */}
  <div className="w-1/4 flex flex-col gap-4 justify-center">
    {/* Light */}
    <div className="bg-white p-4 shadow-lg rounded-lg text-center">
      <p className="text-yellow-500 font-bold">💡 LIGHT</p>
      <div className="mt-4">
        <button
          className={`p-2 rounded-full ${isLightOn ? "bg-yellow-500" : "bg-gray-500"}`}
          onClick={toggleLight}
        >
          {isLightOn ? "Turn Off" : "Turn On"}
        </button>
        
      </div>
    </div>

    {/* Pump */}
    <div className="bg-white p-4 shadow-lg rounded-lg text-center">
      <p className="text-blue-500 font-bold">💦 PUMP</p>
      <div className="mt-4">
        <button
          className={`p-2 rounded-full ${isPumpOn ? "bg-blue-500" : "bg-gray-500"}`}
          onClick={togglePump}
        >
          {isPumpOn ? "Turn Off" : "Turn On"}
        </button>
      </div>
    </div>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
