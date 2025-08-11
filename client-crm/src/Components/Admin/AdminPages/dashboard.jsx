
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../../../config/api";
// import {
//   Users,
//   ShoppingCart,
//   Package,
//   Activity,
//   AlertCircle,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Server,
//   Database,
//   HardDrive,
//   Bell,
//   MessageSquare,
//   Calendar,
//   User,
//   TrendingUp,
// } from "lucide-react";
// import { Header } from "../common/Header";
// import { Sidebar, useSidebar } from "../common/sidebar";
// import { cn } from "../../../utils/cn";
// import { useTheme } from "../../../hooks/use-theme";
// import Footer from "../common/Footer";
// import CombinedAlertReminder from "../../CombinedForUser&Admin/CombinedAlertReminder";

// const Dashboard = ({ collapsed }) => {
//   const { theme, setTheme } = useTheme();
//   const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
//   const [showAddAlertReminderForm, setShowAddAlertReminderForm] = useState(false);
//   const navigate = useNavigate();
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRecentAlerts = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           throw new Error("Please login to view alerts");
//         }

//         const response = await axios.get(`${API_BASE_URL}/api/alert`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const recentAlerts = response.data.data
//           .sort((a, b) => new Date(b.date) - new Date(a.date))
//           .slice(0, 5);

//         setAlerts(recentAlerts);
//       } catch (error) {
//         toast.error(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to load alerts",
//           {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: theme === "dark" ? "dark" : "light",
//             style: { fontSize: "1.2rem" },
//           }
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecentAlerts();
//   }, []);

//   // Sample data
//   const [stats, setStats] = useState([
//     {
//       id: 1,
//       title: "Total Leads",
//       value: "1,248",
//       icon: <Package className="h-5 w-5" />,
//       change: "+5.2%",
//       trend: "up",
//     },
//     {
//       id: 2,
//       title: "Qualified Leads",
//       value: "42",
//       icon: <ShoppingCart className="h-5 w-5" />,
//       change: "-12%",
//       trend: "down",
//     },
//     {
//       id: 3,
//       title: "Pending Leads",
//       value: "98%",
//       icon: <Activity className="h-5 w-5" />,
//       change: "+0.5%",
//       trend: "up",
//     },
//     {
//       id: 4,
//       title: "Loss Leads",
//       value: "156",
//       icon: <Users className="h-5 w-5" />,
//       change: "+8.1%",
//       trend: "up",
//     },
//   ]);

//   const [recentActivities, setRecentActivities] = useState([
//     {
//       id: 1,
//       type: "order",
//       user: "John Smith",
//       action: "placed a new order",
//       time: "2 mins ago",
//       status: "pending",
//     },
//     {
//       id: 2,
//       type: "user",
//       user: "Sarah Johnson",
//       action: "registered new account",
//       time: "15 mins ago",
//       status: "completed",
//     },
//     {
//       id: 3,
//       type: "system",
//       user: "System",
//       action: "completed nightly backup",
//       time: "1 hour ago",
//       status: "completed",
//     },
//     {
//       id: 4,
//       type: "alert",
//       user: "System",
//       action: "high memory usage detected",
//       time: "3 hours ago",
//       status: "warning",
//     },
//   ]);

//   const [systemStatus, setSystemStatus] = useState([
//     {
//       id: 1,
//       component: "Web Server",
//       status: "operational",
//       icon: <Server className="h-4 w-4" />,
//     },
//     {
//       id: 2,
//       component: "Database",
//       status: "operational",
//       icon: <Database className="h-4 w-4" />,
//     },
//     {
//       id: 3,
//       component: "Storage",
//       status: "warning",
//       icon: <HardDrive className="h-4 w-4" />,
//     },
//     {
//       id: 4,
//       component: "API",
//       status: "operational",
//       icon: <MessageSquare className="h-4 w-4" />,
//     },
//   ]);

//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       title: "New feature request",
//       content: "Customer requested bulk export functionality",
//       time: "Today, 10:30 AM",
//       read: false,
//     },
//     {
//       id: 2,
//       title: "System update available",
//       content: "Version 2.3.5 is ready to install",
//       time: "Yesterday, 4:15 PM",
//       read: true,
//     },
//     {
//       id: 3,
//       title: "Payment received",
//       content: "Invoice #3245 has been paid",
//       time: "Yesterday, 11:20 AM",
//       read: true,
//     },
//   ]);

//   // Simulate loading data
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       // In a real app, you would fetch this data from an API
//       setStats([
//         {
//           id: 1,
//           title: "Total Products",
//           value: "1,248",
//           icon: <Package className="h-5 w-5" />,
//           change: "+5.2%",
//           trend: "up",
//         },
//         {
//           id: 2,
//           title: "Pending Orders",
//           value: "42",
//           icon: <ShoppingCart className="h-5 w-5" />,
//           change: "-12%",
//           trend: "down",
//         },
//         {
//           id: 3,
//           title: "System Health",
//           value: "98%",
//           icon: <Activity className="h-5 w-5" />,
//           change: "+0.5%",
//           trend: "up",
//         },
//         {
//           id: 4,
//           title: "Active Sessions",
//           value: "156",
//           icon: <Users className="h-5 w-5" />,
//           change: "+8.1%",
//           trend: "up",
//         },
//       ]);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "operational":
//         return "text-green-500";
//       case "warning":
//         return "text-yellow-500";
//       case "critical":
//         return "text-red-500";
//       default:
//         return "text-gray-500";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status.toLowerCase()) {
//       case "operational":
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case "warning":
//         return <AlertCircle className="h-4 w-4 text-yellow-500" />;
//       case "critical":
//         return <XCircle className="h-4 w-4 text-red-500" />;
//       default:
//         return <Clock className="h-4 w-4 text-gray-500" />;
//     }
//   };

//   const markAsRead = (id) => {
//     setNotifications(
//       notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   };

//   return (
//     <>
//       <Header onToggleSidebar={toggleSidebar} />
//       <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
//         <div
//           className={cn(
//             "transition-all duration-300 ease-in-out min-h-screen bg-gray-50 dark:bg-gray-900",
//             collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
//           )}
//         >
//           <main className="p-6">
//             {/* Welcome Banner */}
//             <div className="flex flex-row justify-between rounded-lg py-4 p-5 mb-4 items-center bg-[#ff8633]">
//               <div className="bg-[#ff8633] rounded-lg p-6 mb-6 text-white">
//                 <h1 className="text-2xl font-bold mb-2">
//                   Welcome back, Admin!
//                 </h1>
//                 <p className="opacity-90">
//                   Here's what's happening with your store today.
//                 </p>
//               </div>
//               <div>
//                 <button className="flex items-center gap-2 px-4 py-2 bg-white p-5 justify-center hover:bg-gray-100 text-[#ff8633] rounded-md transition-colors shadow-md">
//                   Upload Data
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                       transform="rotate(180 10 10)"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//               {stats.map((stat) => (
//                 <div
//                   key={stat.id}
//                   className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
//                 >
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                       {stat.title}
//                     </h3>
//                     <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
//                       {stat.icon}
//                     </div>
//                   </div>
//                   <div className="flex items-end justify-between">
//                     <span className="text-2xl font-bold text-gray-900 dark:text-gray-200">
//                       {stat.value}
//                     </span>
//                     <span
//                       className={`flex items-center text-sm ${
//                         stat.trend === "up" ? "text-green-500" : "text-red-500"
//                       }`}
//                     >
//                       {stat.change}
//                       {stat.trend === "up" ? (
//                         <TrendingUp className="h-4 w-4 ml-1" />
//                       ) : (
//                         <TrendingUp className="h-4 w-4 ml-1 transform rotate-180" />
//                       )}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Main Content */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//               {/* Recent Activities */}
//               <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                   <h2 className="text-lg dark:text-gray-400 font-semibold flex items-center">
//                     <Activity className="h-5 w-5 mr-2 text-blue-500" />
//                     Recent Activities
//                   </h2>
//                 </div>
//                 <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {recentActivities.map((activity) => (
//                     <div
//                       key={activity.id}
//                       className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                     >
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 pt-1">
//                           {activity.type === "order" && (
//                             <ShoppingCart className="h-5 w-5 text-blue-500" />
//                           )}
//                           {activity.type === "user" && (
//                             <User className="h-5 w-5 text-green-500" />
//                           )}
//                           {activity.type === "system" && (
//                             <Server className="h-5 w-5 text-purple-500" />
//                           )}
//                           {activity.type === "alert" && (
//                             <AlertCircle className="h-5 w-5 text-yellow-500" />
//                           )}
//                         </div>
//                         <div className="ml-3 flex-1">
//                           <div className="flex items-center justify-between">
//                             <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
//                               {activity.user}{" "}
//                               <span className="text-gray-500 dark:text-gray-400 font-normal">
//                                 {activity.action}
//                               </span>
//                             </p>
//                             <span className="text-xs text-gray-500 dark:text-gray-400">
//                               {activity.time}
//                             </span>
//                           </div>
//                           <div className="mt-1 flex items-center">
//                             <span
//                               className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
//                                 activity.status === "pending"
//                                   ? "bg-yellow-100 text-yellow-800"
//                                   : activity.status === "completed"
//                                   ? "bg-green-100 text-green-800"
//                                   : activity.status === "warning"
//                                   ? "bg-orange-100 text-orange-800"
//                                   : "bg-gray-100 text-gray-800"
//                               }`}
//                             >
//                               {activity.status}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right">
//                   <button
//                     onClick={() => navigate("/admin/activities")}
//                     className="text-sm font-medium text-[#ff8633] "
//                   >
//                     View all activities →
//                   </button>
//                 </div>
//               </div>

//               {/* System Status */}
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                   <h2 className="text-lg dark:text-gray-400 font-semibold flex items-center">
//                     <Server className="h-5 w-5 mr-2 text-green-500" />
//                     System Status
//                   </h2>
//                 </div>
//                 <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {systemStatus.map((item) => (
//                     <div key={item.id} className="p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mr-3">
//                             {item.icon}
//                           </div>
//                           <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
//                             {item.component}
//                           </span>
//                         </div>
//                         <div className="flex items-center">
//                           <span
//                             className={`text-xs font-medium mr-2 ${getStatusColor(
//                               item.status
//                             )}`}
//                           >
//                             {item.status}
//                           </span>
//                           {getStatusIcon(item.status)}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="p-4 bg-gray-50 dark:bg-gray-700">
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     Last updated: {new Date().toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Row */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Notifications */}
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                   <h2 className="text-lg dark:text-gray-400 font-semibold flex items-center">
//                     <Bell className="h-5 w-5 mr-2 text-yellow-500" />
//                     Notifications
//                   </h2>
//                 </div>
//                 <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {notifications.map((notification) => (
//                     <div
//                       key={notification.id}
//                       className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
//                         !notification.read
//                           ? "bg-blue-50 dark:bg-blue-900/30"
//                           : ""
//                       }`}
//                       onClick={() => markAsRead(notification.id)}
//                     >
//                       <div className="flex justify-between">
//                         <h3
//                           className={`text-sm font-medium ${
//                             !notification.read
//                               ? "text-blue-800 dark:text-blue-200"
//                               : "text-gray-800 dark:text-gray-200"
//                           }`}
//                         >
//                           {notification.title}
//                         </h3>
//                         {!notification.read && (
//                           <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                             New
//                           </span>
//                         )}
//                       </div>
//                       <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 text-left">
//                         {notification.content}
//                       </p>
//                       <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-left ">
//                         {notification.time}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right">
//                   <button
//                     onClick={() => navigate("/admin/notifications")}
//                     className="text-sm font-medium text-[#ff8633]"
//                   >
//                     View all notifications →
//                   </button>
//                 </div>
//               </div>

//               {/* Upcoming Events */}
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-row justify-between">
//                   <h2 className="text-lg dark:text-gray-400 font-semibold flex items-center">
//                     <Calendar className="h-5 w-5 mr-2 text-red-500" />
//                     Alerts and Reminders
//                   </h2>
//                   <button onClick={() => setShowAddAlertReminderForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#ff8633] hover:bg-orange-500 text-white rounded-md transition-colors">
//           Add Alerts and Reminder
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//           </svg>
//         </button>
//                 </div>
//                 <div className="p-6">
//                   {alerts.map((alert) => (
//                     <div
//                       key={alert.id}
//                       className="dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded shadow-sm flex items-center gap-4 overflow-x-auto"
//                     >
//                       <span className="font-medium text-gray-900 dark:text-white min-w-[100px]">
//                         {alert.topic}
//                       </span>
//                       <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
//                         📅 {new Date(alert.date).toLocaleDateString()}
//                       </span>
//                       <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
//                         ⏰ {alert.time}
//                       </span>
//                       <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
//                         🔔 {alert.remainder}
//                       </span>
//                       {alert.description && (
//                         <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
//                           📝 {alert.description}
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right">
//                   <button
//                     onClick={() => navigate("/all-alerts-reminders")}
//                     className="text-sm font-medium text-[#ff8633]"
//                   >
//                     View All Events →
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
//          <CombinedAlertReminder 
//                       isOpen={showAddAlertReminderForm} 
//                       onClose={() => setShowAddAlertReminderForm(false)}
//                     />
//       </Sidebar>
//       <Footer />
//     </>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../config/api";
import {
  Users,
  ShoppingCart,
  Package,
  Activity,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Server,
  Database,
  HardDrive,
  Bell,
  MessageSquare,
  Calendar,
  User,
  TrendingUp,
  Upload,
  Plus,
  ArrowRight,
  BarChart3,
  Eye,
  Settings,
  Filter,
} from "lucide-react";
import { Header } from "../common/Header";
import { Sidebar, useSidebar } from "../common/sidebar";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../hooks/use-theme";
import Footer from "../common/Footer";
import CombinedAlertReminder from "../../CombinedForUser&Admin/CombinedAlertReminder";

const Dashboard = ({ collapsed }) => {
  const { theme, setTheme } = useTheme();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [showAddAlertReminderForm, setShowAddAlertReminderForm] = useState(false);
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAlerts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login to view alerts");
        }

        const response = await axios.get(`${API_BASE_URL}/api/alert`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const recentAlerts = response.data.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setAlerts(recentAlerts);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load alerts",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme === "dark" ? "dark" : "light",
            style: { fontSize: "1.2rem" },
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAlerts();
  }, []);

  // Sample data with enhanced metrics
  const [stats, setStats] = useState([
    {
      id: 1,
      title: "Total Leads",
      value: "1,248",
      icon: <Package className="h-6 w-6" />,
      change: "+5.2%",
      trend: "up",
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      subtitle: "This month"
    },
    {
      id: 2,
      title: "Qualified Leads",
      value: "342",
      icon: <ShoppingCart className="h-6 w-6" />,
      change: "+12.3%",
      trend: "up",
      color: "from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      subtitle: "Active pipeline"
    },
    {
      id: 3,
      title: "Conversion Rate",
      value: "24.8%",
      icon: <Activity className="h-6 w-6" />,
      change: "+0.5%",
      trend: "up",
      color: "from-purple-500 to-purple-600",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      subtitle: "Last 30 days"
    },
    {
      id: 4,
      title: "Revenue",
      value: "$45.2k",
      icon: <TrendingUp className="h-6 w-6" />,
      change: "+8.1%",
      trend: "up",
      color: "from-orange-500 to-orange-600",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
      subtitle: "This quarter"
    },
  ]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "order",
      user: "John Smith",
      action: "placed a new order",
      time: "2 mins ago",
      status: "pending",
      avatar: "JS"
    },
    {
      id: 2,
      type: "user",
      user: "Sarah Johnson",
      action: "registered new account",
      time: "15 mins ago",
      status: "completed",
      avatar: "SJ"
    },
    {
      id: 3,
      type: "system",
      user: "System",
      action: "completed nightly backup",
      time: "1 hour ago",
      status: "completed",
      avatar: "SY"
    },
    {
      id: 4,
      type: "alert",
      user: "System",
      action: "high memory usage detected",
      time: "3 hours ago",
      status: "warning",
      avatar: "AL"
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New feature request",
      content: "Customer requested bulk export functionality",
      time: "Today, 10:30 AM",
      read: false,
    },
    {
      id: 2,
      title: "System update available",
      content: "Version 2.3.5 is ready to install",
      time: "Yesterday, 4:15 PM",
      read: true,
    },
    {
      id: 3,
      title: "Payment received",
      content: "Invoice #3245 has been paid",
      time: "Yesterday, 11:20 AM",
      read: true,
    },
  ]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats([
        {
          id: 1,
          title: "Total Leads",
          value: "1,248",
          icon: <Package className="h-6 w-6" />,
          change: "+5.2%",
          trend: "up",
          color: "from-blue-500 to-blue-600",
          lightColor: "bg-blue-50",
          textColor: "text-blue-600",
          subtitle: "This month"
        },
        {
          id: 2,
          title: "Qualified Leads",
          value: "342",
          icon: <ShoppingCart className="h-6 w-6" />,
          change: "+12.3%",
          trend: "up",
          color: "from-emerald-500 to-emerald-600",
          lightColor: "bg-emerald-50",
          textColor: "text-emerald-600",
          subtitle: "Active pipeline"
        },
        {
          id: 3,
          title: "Conversion Rate",
          value: "24.8%",
          icon: <Activity className="h-6 w-6" />,
          change: "+0.5%",
          trend: "up",
          color: "from-purple-500 to-purple-600",
          lightColor: "bg-purple-50",
          textColor: "text-purple-600",
          subtitle: "Last 30 days"
        },
        {
          id: 4,
          title: "Revenue",
          value: "$45.2k",
          icon: <TrendingUp className="h-6 w-6" />,
          change: "+8.1%",
          trend: "up",
          color: "from-orange-500 to-orange-600",
          lightColor: "bg-orange-50",
          textColor: "text-orange-600",
          subtitle: "This quarter"
        },
      ]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div
          className={cn(
            "transition-all duration-300 ease-in-out min-h-screen bg-slate-50 dark:from-gray-900 dark:to-gray-800",
            collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
          )}
        >
          <main className="p-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome back! Here's what's happening with your business today.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-4 lg:mt-0">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  <Upload className="h-4 w-4" />
                  Upload Data
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.lightColor}`}>
                        <div className={stat.textColor}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        stat.trend === "up" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        <TrendingUp className={`h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                        {stat.change}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {stat.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                </div>
              ))}
            </div>

            {/* Main Grid - Now Recent Activities takes full width */}
            <div className="mb-8">
              {/* Recent Activities - Full Width */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Recent Activities
                    </h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                          {activity.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {activity.user}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                              {activity.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {activity.action}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              activity.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : activity.status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : activity.status === "warning"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Alerts and Reminders */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Alerts & Reminders
                    </h2>
                    <button 
                      onClick={() => setShowAddAlertReminderForm(true)} 
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Add New
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {alerts.length > 0 ? (
                    <div className="space-y-4">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-purple-100 dark:border-gray-600"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {alert.topic}
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Calendar className="h-3 w-3" />
                              {new Date(alert.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Clock className="h-3 w-3" />
                              {alert.time}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 col-span-2">
                              <Bell className="h-3 w-3" />
                              {alert.remainder}
                            </div>
                          </div>
                          {alert.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                              {alert.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mb-2">No alerts or reminders</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Create your first alert to get started</p>
                    </div>
                  )}
                </div>
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
                  <button
                    onClick={() => navigate("/all-alerts-reminders")}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-2"
                  >
                    View All Events
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                    <Settings className="h-5 w-5 text-gray-600" />
                    Quick Actions
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">View Reports</p>
                      <p className="text-xs text-gray-500">Generate detailed analytics</p>
                    </button>
                    <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors group">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-200">
                        <Users className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Manage Users</p>
                      <p className="text-xs text-gray-500">Add or edit user accounts</p>
                    </button>
                    <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Inventory</p>
                      <p className="text-xs text-gray-500">Manage product stock</p>
                    </button>
                    <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200">
                        <Settings className="h-5 w-5 text-orange-600" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Settings</p>
                      <p className="text-xs text-gray-500">Configure system preferences</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <CombinedAlertReminder 
          isOpen={showAddAlertReminderForm} 
          onClose={() => setShowAddAlertReminderForm(false)}
        />
      </Sidebar>
      <Footer />
    </>
  );
};

export default Dashboard;

