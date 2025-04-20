// pages/AlertPage.tsx
import { useEffect, useState } from "react";
import Sidebar from "../component/sidebar.js";
import UserInfo from "../component/toolBar.jsx";
import avatar from "../assets/avt.jpg";
import { fetchAlerts } from "@/api/getNotificationAPI.js";
import { AlertData } from "@/types/Alert.js";

const AlertPage = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | AlertData["type"]>("all");
  const [filterDate, setFilterDate] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      try {
        let data = await fetchAlerts();
        console.log(data);
        if (filterType !== "all") {
          data = data.filter((alert) => alert.type === filterType);
        }
        if (filterDate) {
          const filterDateObj = new Date(filterDate);
          // Ensure time is set to midnight to match only the date part
          filterDateObj.setHours(0, 0, 0, 0);
  
          data = data.filter(item => {
            const itemDate = new Date(item.createdAt);
            // Set the time of itemDate to midnight for a correct date comparison
            itemDate.setHours(0, 0, 0, 0);
            return itemDate.getTime() === filterDateObj.getTime();
          });
        }
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAlerts(data);
        setTotalItems(data.length);
      } catch (error) {
        console.error("Error loading alerts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAlerts();
  }, [filterType, filterDate]); // Ensure filterDate is included in the dependencies
  

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = alerts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (num: number) => setCurrentPage(num);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/7 bg-gray-200">
        <Sidebar />
      </div>

      <div className="flex-grow px-5 bg-gray-100 overflow-y-scroll scrollbar-none">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <UserInfo name="Bach Hoang" status="available" avatar={avatar} />
          </div>

          <div className="col-span-12 bg-white p-4 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800">THÔNG BÁO CẢM BIẾN</h1>
          </div>
          <div className="col-span-12 bg-white p-4 shadow-lg rounded-lg">
        <div className="flex gap-4 items-center">
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại cảm biến</label>
            <select
              className="border p-2 rounded w-full"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as AlertData["type"] | "all");
                setCurrentPage(1);
              }}
            >
              <option value="all">Tất cả</option>
              <option value="TEMPERATURE">Nhiệt độ</option>
              <option value="HUMIDITY">Độ ẩm không khí</option>
              <option value="LIGHT">Ánh sáng</option>
              <option value="SOIL_MOISTURE">Độ ẩm đất</option>
            </select>
          </div>
          <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                <input 
                  type="date" 
                  className="border p-2 rounded w-full"
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                    setCurrentPage(1); // Reset về trang đầu khi thay đổi filter
                  }}
                />
              </div>
              <button 
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => {
                    setFilterType('all');
                  setFilterDate('');
                  setCurrentPage(1);
                }}
              >
                Xóa lọc
              </button>
            </div>
          </div>
          <div className="col-span-12 bg-white p-4 shadow-lg rounded-lg overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">Đang tải thông báo...</div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá trị</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thông điệp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((alert) => (
                        <tr key={alert.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{formatDate(alert.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{alert.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{alert.value}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">{alert.message}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          Không có thông báo nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-l-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        &lt;
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-3 py-1 border-t border-b ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                          {number}
                        </button>
                      ))}

                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-r-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        &gt;
                      </button>
                    </nav>
                  </div>
                )}

                <div className="mt-2 text-sm text-gray-500 text-center">
                  Hiển thị {indexOfFirst + 1}-{Math.min(indexOfLast, totalItems)} của {totalItems} thông báo
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPage;
