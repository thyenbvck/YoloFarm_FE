import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar.js";
import UserInfo from "../component/toolBar.jsx";
import avatar from "../assets/avt.jpg";
import websocketService from "../api/dashboardAPI.js";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import type { HistoryRecord } from "@/types/HistoryRecord.js";

const OperationHistory = () => {
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDevice, setFilterDevice] = useState<'all' | 'Đèn' | 'Máy bơm'>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  
  // Thêm state phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Số item mỗi trang
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchHistoryData = async () => {
      setLoading(true);
      try {
        // Mock data với kiểu Date
        const mockData: HistoryRecord[] = [
          {
            device: 'Đèn',
            action: 'on',
            triggeredBy: 'user',
            timeStart: new Date('2023-05-15T08:30:45')
          },
          {
            device: 'Máy bơm',
            action: 'off',
            triggeredBy: 'system',
            reason: 'Độ ẩm đất cao',
            timeStart: new Date('2023-05-15T09:15:22')
          },
          {
            device: 'Đèn',
            action: 'off',
            triggeredBy: 'system',
            reason: 'Trời sáng',
            timeStart: new Date('2023-05-15T06:00:00')
          },
          {
            device: 'Máy bơm',
            action: 'off',
            triggeredBy: 'system',
            reason: 'Độ ẩm đất cao',
            timeStart: new Date('2023-05-15T09:17:22')
          },
          {
            device: 'Đèn',
            action: 'off',
            triggeredBy: 'system',
            reason: 'Trời sáng',
            timeStart: new Date('2023-05-15T06:30:00')
          },
          {
            device: 'Máy bơm',
            action: 'on',
            triggeredBy: 'user',
            timeStart: new Date('2023-05-14T17:45:30')
          },
          // Thêm nhiều dữ liệu hơn để demo phân trang
          {
            device: 'Đèn',
            action: 'on',
            triggeredBy: 'user',
            timeStart: new Date('2023-05-16T18:20:00')
          },
          {
            device: 'Máy bơm',
            action: 'off',
            triggeredBy: 'system',
            reason: 'Độ ẩm đạt ngưỡng',
            timeStart: new Date('2023-05-16T19:05:00')
          },
          {
            device: 'Đèn',
            action: 'on',
            triggeredBy: 'user',
            timeStart: new Date('2023-05-17T07:15:00')
          },
          {
            device: 'Máy bơm',
            action: 'on',
            triggeredBy: 'system',
            reason: 'Độ ẩm thấp',
            timeStart: new Date('2023-05-17T08:30:00')
          }
        ];

        // Filter data
        let filteredData = mockData;
        
        if (filterDevice !== 'all') {
          filteredData = filteredData.filter(item => item.device === filterDevice);
        }
        
        if (filterDate) {
          const filterDateObj = new Date(filterDate);
          filteredData = filteredData.filter(item => 
            item.timeStart.toISOString().split('T')[0] === filterDateObj.toISOString().split('T')[0]
          );
        }

        // Sắp xếp theo thời gian mới nhất trước
        filteredData.sort((a, b) => b.timeStart.getTime() - a.timeStart.getTime());
        
        setTotalItems(filteredData.length);
        setHistoryData(filteredData);
      } catch (error) {
        console.error("Failed to fetch history data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [filterDevice, filterDate]);

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historyData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Đổi trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date để hiển thị
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const renderActionStatus = (action: string) => {
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
        ${action === 'on' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {action === 'on' ? 'BẬT' : 'TẮT'}
      </span>
    );
  };

  const renderTriggeredBy = (triggeredBy: string) => {
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
        ${triggeredBy === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
        {triggeredBy === 'user' ? 'NGƯỜI DÙNG' : 'HỆ THỐNG'}
      </span>
    );
  };

  return (
    <div className="flex">
      <div className="w-1/7 bg-gray-200">
        <Sidebar />
      </div>

      <div className="flex-grow p-3 bg-gray-100">
        <div className="grid grid-cols-12 gap-4 auto-rows-auto">
          <div className="col-span-12">
            <UserInfo name="Bach Hoang" status="available" avatar={avatar} />
          </div>

          <div className="col-span-12 bg-white p-4 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800">LỊCH SỬ HOẠT ĐỘNG THIẾT BỊ</h1>
          </div>

          <div className="col-span-12 bg-white p-4 shadow-lg rounded-lg">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Thiết bị</label>
                <select 
                  className="border p-2 rounded w-full"
                  value={filterDevice}
                  onChange={(e) => {
                    setFilterDevice(e.target.value as 'all' | 'Đèn' | 'Máy bơm');
                    setCurrentPage(1); // Reset về trang đầu khi thay đổi filter
                  }}
                >
                  <option value="all">Tất cả thiết bị</option>
                  <option value="Đèn">Đèn</option>
                  <option value="Máy bơm">Máy bơm</option>
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
                  setFilterDevice('all');
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
              <div className="text-center py-8">Đang tải dữ liệu...</div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">THỜI GIAN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">THIẾT BỊ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRẠNG THÁI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KÍCH HOẠT BỞI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LÝ DO (HỆ THỐNG)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(item.timeStart)}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{item.device}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderActionStatus(item.action)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderTriggeredBy(item.triggeredBy)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.triggeredBy === 'system' ? item.reason : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Không có dữ liệu lịch sử
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {/* Phân trang */}
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
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
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
                  Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} của {totalItems} bản ghi
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationHistory;