// import { useState, useEffect } from "react";
// import type { AlertData } from "@/types/Alert";
// import type { AutoS } from "@/types/AutoSchedule";
// // import websocketService from "@/api/autoscheduleAPI";
// import type { Uitt } from "@/types/UIToast";
// import Sidebar from "../component/sidebar";
// import UserInfo from "../component/toolBar";
// import avatar from "../assets/avt.jpg";
// import { Button } from "@/components/ui/button";
// import { AlertComponent } from "@/component/Alert";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { fetchSchedules } from "@/api/autoscheduleAPI";

// /*************  ✨ Windsurf Command ⭐  *************/
// /**
//  * AutoSchedulePage is a React component that provides an interface

// /*******  99fc65bc-6ad6-4166-882f-29413308f4cf  *******/
// const AutoSchedulePage = () => {
//   const [schedules, setSchedules] = useState<AutoS[]>([]);
//   const [alerts, setAlerts] = useState<Uitt[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isInputActive, setIsInputActive] = useState(false);
//   const [tempSchedules, setTempSchedules] = useState<AutoS[]>([]);

//   useEffect(() => {
//     const initData = async () => {
//       try {
//         const fetchedSchedules:AutoS[] = 
//         await fetchSchedules(); 
//     //     [{
//     //       "deviceName": "den",
//     //       "status": "INACTIVE",
//     //       "startTime": "21:00:00",
//     //       "intervalTime": "PT1H",
//     //       "duration": "PT50M"
//     //   },{
//     //     "deviceName": "maybom",
//     //     "status": "INACTIVE",
//     //     "startTime": "21:00:00",
//     //     "intervalTime": "PT1H",
//     //     "duration": "PT50M"
//     // }]
//         setSchedules(fetchedSchedules);  
//         setTempSchedules(fetchedSchedules);
//         // Thiết lập WebSocket listeners
//         // websocketService.onSchedules(handleScheduleUpdates);
//       } catch (error) {
//         console.error("❌ Lỗi khi kết nối:", error);
//         showAlert("Không thể tải lịch trình", "ERROR");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initData();

//     return () => {
//       // websocketService.onSchedules(undefined);
//     };
//   }, []);

//   const handleScheduleUpdates = (updatedSchedules: AutoS[]) => {
//     setSchedules(updatedSchedules);
//   };

  

// const showAlert = (message: string, type: "SUCCESS" | "ERROR") => {
//   const newAlert: Uitt = {
//     id: crypto.randomUUID(),
//     type,
//     message,
//     createdAt: new Date(),
//   };
//   setAlerts(prev => [...prev, newAlert]);
// };


// const handleScheduleChange = <K extends keyof AutoS>(
//   index: number,
//   field: K,
//   value: AutoS[K]
// ) => {
//   const updatedSchedules = [...tempSchedules];
//   updatedSchedules[index] = {
//     ...updatedSchedules[index],
//     [field]: value
//   };
//   setTempSchedules(updatedSchedules);
// };

//   const handleSaveSchedule = async (index: number) => {
//     const scheduleToUpdate = tempSchedules[index];
//     try {
//       // await websocketService.updateSchedule(scheduleToUpdate); // Giả lập API call
//       setSchedules(prev => prev.map((item, i) => i === index ? scheduleToUpdate : item));
//       showAlert("Lưu lịch trình thành công", "SUCCESS");
//     } catch (error) {
//       showAlert("Lỗi khi lưu lịch trình", "ERROR");
//     }
//   };



//   const parseDuration = (duration: string) => {
//     return parseInt(duration.replace("PT", "").replace("M", ""));
//   };

//   const formatDuration = (minutes: number) => {
//     return `PT${minutes}M`;
//   };

//   if (isLoading) {
//     return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
//   }

//   return (
//     <div className="flex h-screen">
//       <div className="w-1/4 bg-gray-200">
//         <Sidebar />
//       </div>
      
//       <div className="flex-grow p-5 bg-gray-100">
//         <div className="grid grid-cols-12 gap-4 auto-rows-auto">
//           <div className="col-span-12">
//             <UserInfo name="Bach Hoang" status="available" avatar={avatar} />
//           </div>
// {/* 
//           <div className="col-span-12 space-y-2">
//   {alerts.map((alert) => (
//     <div
//       key={alert.id}
//       className={`p-4 rounded-md text-white font-semibold shadow-md transition-all
//         ${alert.type === "SUCCESS" ? "bg-green-500" : "bg-red-500"}`}
//     >
//       {alert.type === "SUCCESS" ? "✅" : "❌"} {alert.message}
//     </div>
//   ))}
// </div> */}

//           <div className="col-span-12">
//             <h1 className="text-2xl font-bold mb-4">Cài Đặt Tự Động</h1>
//           </div>

//           {tempSchedules.map((schedule, index) => (

//             <div key={index} className="col-span-6">
//               <Card className="h-full">
//                 <CardHeader>
//                   <CardTitle className="flex justify-between items-center">
//                     <span>{schedule.deviceName === "den" ? "Đèn" : "Máy Bơm"}</span>
//                     <label className="flex items-center cursor-pointer">
//                       <div className="relative">
//                         <input
//                           type="checkbox"
//                           className="sr-only"
//                           checked={schedule.status === "ACTIVE"}
//                           onChange={(e) => handleScheduleChange(index, "status", e.target.checked ? "ACTIVE" : "INACTIVE")}
//                         />
//                         <div className={`block w-14 h-8 rounded-full ${schedule.status === "ACTIVE" ? "bg-green-500" : "bg-gray-600"}`}></div>
//                         <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${schedule.status === "ACTIVE" ? "transform translate-x-6" : ""}`}></div>
//                       </div>
//                     </label>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu</label>
//                     <input
//                       type="time"
//                       className="w-full p-2 border rounded"
//                       value={schedule.startTime}
//                       onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
//                       step="1"
//                     />
//                   </div>

//                   {/* <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Chu kỳ (ngày)</label>
//                     <input
//                       type="number"
//                       className="w-full p-2 border rounded"
//                       value={schedule.cycle}
//                       onChange={(e) => handleScheduleChange(index, "cycle", parseInt(e.target.value))}
//                       placeholder="Nhập số ngày"
//                       min={1}
//                     />
//                   </div> */}

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng hoạt động (phút)</label>
//                     <input
//                       type="number"
//                       className="w-full p-2 border rounded"
//                       value={parseDuration(schedule.duration)}
//                       onChange={(e) => handleScheduleChange(index, "duration", formatDuration(parseInt(e.target.value)))}
//                       min="1"
//                     />
//                   </div>

//                   <Button
//                     className="w-full mt-4"
//                     onClick={() => handleSaveSchedule(index)}
//                   >
//                     Lưu Cài Đặt
//                   </Button>

//                   {/* {schedule.status === "ACTIVE" && (
//                     <div className="mt-3 p-3 bg-green-50 rounded-md text-sm">
//                       <p className="text-green-700">
//                         ⏰ Tự động bật lúc {schedule.startTime} mỗi {schedule.cycle} ngày, hoạt động trong {parseDuration(schedule.duration)} phút
//                       </p>
//                     </div>
//                   )} */}
//                 </div>
//                 </CardContent>
//               </Card>
//             </div>
//           ))}
//         </div>
//       </div>

     
//     </div>
//   );
// };

// export default AutoSchedulePage;
import { useState, useEffect } from "react";
import type { AutoS } from "@/types/AutoSchedule";
import type { Uitt } from "@/types/UIToast";
import Sidebar from "../component/sidebar";
import UserInfo from "../component/toolBar";
import avatar from "../assets/avt.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchSchedules, updateSchedule } from "@/api/autoscheduleAPI";

const AutoSchedulePage = () => {
  const [schedules, setSchedules] = useState<AutoS[]>([]);
  const [alerts, setAlerts] = useState<Uitt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tempSchedules, setTempSchedules] = useState<AutoS[]>([]);

  useEffect(() => {
    const initData = async () => {
      try {
        const fetchedSchedules = await fetchSchedules();
        setSchedules(fetchedSchedules);
        setTempSchedules(fetchedSchedules);
      } catch (error) {
        console.error("❌ Lỗi khi tải lịch:", error);
        showAlert("Không thể tải lịch trình", "ERROR");
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  const showAlert = (message: string, type: "SUCCESS" | "ERROR") => {
    const newAlert: Uitt = {
      id: crypto.randomUUID(),
      type,
      message,
      createdAt: new Date(),
    };
    setAlerts((prev) => [...prev, newAlert]);
  };

  const handleScheduleChange = <K extends keyof AutoS>(
    index: number,
    field: K,
    value: AutoS[K]
  ) => {
    const updated = [...tempSchedules];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setTempSchedules(updated);
  };

  const handleSaveSchedule = async (index: number) => {
    const schedule = tempSchedules[index];
    try {
      const updated = await updateSchedule(schedule.id, schedule); // dùng `id` từ `schedule`
      if (updated) {
        setSchedules((prev) =>
          prev.map((item, i) => (i === index ? updated : item))
        );
        showAlert("Lưu lịch trình thành công", "SUCCESS");
      } else {
        throw new Error("Update API trả về null");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      showAlert("Lỗi khi lưu lịch trình", "ERROR");
    }
  };

  const parseDuration = (duration: string) => {
    return parseInt(duration.replace("PT", "").replace("M", ""));
  };

  const formatDuration = (minutes: number) => {
    return `PT${minutes}M`;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

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

          <div className="col-span-12">
            <h1 className="text-2xl font-bold mb-4">Cài Đặt Tự Động</h1>
          </div>

          {tempSchedules.map((schedule, index) => (
            <div key={index} className="col-span-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{schedule.deviceName === "den" ? "Đèn" : "Máy Bơm"}</span>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={schedule.status === "ACTIVE"}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "status",
                              e.target.checked ? "ACTIVE" : "INACTIVE"
                            )
                          }
                        />
                        <div
                          className={`block w-14 h-8 rounded-full ${
                            schedule.status === "ACTIVE"
                              ? "bg-green-500"
                              : "bg-gray-600"
                          }`}
                        ></div>
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                            schedule.status === "ACTIVE"
                              ? "transform translate-x-6"
                              : ""
                          }`}
                        ></div>
                      </div>
                    </label>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian bắt đầu
                      </label>
                      <input
                        type="time"
                        className="w-full p-2 border rounded"
                        value={schedule.startTime}
                        onChange={(e) =>
                          handleScheduleChange(index, "startTime", e.target.value)
                        }
                        step="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời lượng hoạt động (phút)
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={parseDuration(schedule.duration)}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "duration",
                            formatDuration(parseInt(e.target.value))
                          )
                        }
                        min="1"
                      />
                    </div>

                    <Button className="w-full mt-4" onClick={() => handleSaveSchedule(index)}>
                      Lưu Cài Đặt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoSchedulePage;
