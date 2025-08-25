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
//   Calendar,
//   TrendingUp,
//   Plus,
//   ArrowRight,
//   BarChart3,
//   Eye,
//   Settings,
//   Clock,
//   Bell,
// } from "lucide-react";
// import { Header } from "../common/Header";
// import { Sidebar, useSidebar } from "../common/sidebar";
// import { cn } from "../../../utils/cn";
// import { useTheme } from "../../../hooks/use-theme";
// import Footer from "../common/Footer";
// import CombinedAlertReminder from "../../CombinedForUser&Admin/CombinedAlertReminder";

// const Dashboard = ({ collapsed }) => {
//   const { theme } = useTheme();
//   const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
//   const [showAddAlertReminderForm, setShowAddAlertReminderForm] = useState(false);
//   const navigate = useNavigate();
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState([]);
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [leadsData, setLeadsData] = useState({
//     totalLeads: 0,
//     qualifiedLeads: 0,
//     pendingLeads: 0,
//     lossLeads: 0
//   });
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

//   // Fetch leads analytics data
//   useEffect(() => {
//     const fetchLeadsAnalytics = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("Please login to view analytics");
        
//         const response = await axios.get(`${API_BASE_URL}/api/analytics/leads`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         if (response.data) {
//           setLeadsData({
//             totalLeads: response.data.totalLeads || 0,
//             qualifiedLeads: response.data.qualifiedLeads || 0,
//             pendingLeads: response.data.pendingLeads || 0,
//             lossLeads: response.data.lossLeads || 0
//           });
//         }
//       } catch (error) {
//         console.error("Failed to fetch leads analytics:", error);
//         toast.error(
//           error.response?.data?.message || error.message || "Failed to load leads analytics",
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
//       }
//     };

//     fetchLeadsAnalytics();
//   }, [theme]);

//   useEffect(() => {
//     const fetchRecentAlerts = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("Please login to view alerts");
        
//         const response = await axios.get(`${API_BASE_URL}/api/alert`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         const recentAlerts = response.data.data
//           .sort((a, b) => new Date(b.date) - new Date(a.date))
//           .slice(0, 5);
//         setAlerts(recentAlerts);
//       } catch (error) {
//         toast.error(
//           error.response?.data?.message || error.message || "Failed to load alerts",
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
//   }, [theme]);

//   useEffect(() => {
//     const fetchRecentActivities = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("Please login to view activities");
        
//         const response = await axios.get(`${API_BASE_URL}/api/recent`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const allActivities = [];

//         // Process Users
//         if (response.data.userData && Array.isArray(response.data.userData)) {
//           response.data.userData.forEach(user => {
//             const firstName = user.firstName || "";
//             const lastName = user.lastName || "";
//             const avatar = firstName.charAt(0) + lastName.charAt(0);
            
//             allActivities.push({
//               id: user.id,
//               type: "user",
//               user: firstName + " " + lastName,
//               action: "registered new account",
//               time: formatTimeAgo(new Date(user.createdAt)),
//               status: user.locked ? "locked" : "completed",
//               avatar: avatar.toUpperCase(),
//               timestamp: new Date(user.createdAt)
//             });
//           });
//         }

//         // Process Employees
//         if (response.data.lastCreatedEmployee && Array.isArray(response.data.lastCreatedEmployee)) {
//           response.data.lastCreatedEmployee.forEach(emp => {
//             const firstName = emp.firstName || "";
//             const lastName = emp.lastName || "";
//             const avatar = firstName.charAt(0) + lastName.charAt(0);
            
//             allActivities.push({
//               id: emp.id,
//               type: "employee",
//               user: firstName + " " + lastName,
//               action: "joined the company",
//               time: formatTimeAgo(new Date(emp.createdAt)),
//               status: emp.status || "active",
//               avatar: avatar.toUpperCase(),
//               timestamp: new Date(emp.createdAt)
//             });
//           });
//         }

//         // Process Leads
//         if (response.data.leads && Array.isArray(response.data.leads)) {
//           response.data.leads.forEach(lead => {
//             const firstName = lead.customerFirstName || "";
//             const lastName = lead.customerLastName || "";
//             const avatar = firstName.charAt(0) + lastName.charAt(0);
            
//             allActivities.push({
//               id: lead.id,
//               type: "lead",
//               user: firstName + " " + lastName,
//               action: "created new lead",
//               time: formatTimeAgo(new Date(lead.createdAt)),
//               status: lead.status || "pending",
//               avatar: avatar.toUpperCase(),
//               timestamp: new Date(lead.createdAt)
//             });
//           });
//         }

//         // Sort by timestamp (newest first) and take first 4
//         allActivities.sort((a, b) => b.timestamp - a.timestamp);
//         setRecentActivities(allActivities.slice(0, 4));

//       } catch (error) {
//         toast.error(
//           error.response?.data?.message || error.message || "Failed to load recent activities",
//           {
//             position: "top-right",
//             autoClose: 5000,
//             theme: theme === "dark" ? "dark" : "light",
//             style: { fontSize: "1.2rem" },
//           }
//         );
//       }
//     };

//     fetchRecentActivities();
//   }, [theme]);

// // Update stats with real data from API
// useEffect(() => {
//   if (leadsData) {
//     // Calculate conversion rate (qualified leads / total leads * 100)
//     const conversionRate = leadsData.totalLeads > 0 
//       ? ((leadsData.qualifiedLeads / leadsData.totalLeads) * 100).toFixed(1) 
//       : "0.0";

//     setStats([
//       {
//         id: 1,
//         title: "Total Leads",
//         value: leadsData.totalLeads.toLocaleString(),
//         icon: React.createElement(Package, { className: "h-6 w-6" }),
//         change: "+5.2%",
//         trend: "up",
//         color: "from-blue-500 to-blue-600",
//         lightColor: "bg-blue-50",
//         textColor: "text-blue-600",
//         subtitle: "This month",
//       },
//       {
//         id: 2,
//         title: "Qualified Leads",
//         value: leadsData.qualifiedLeads.toLocaleString(),
//         icon: React.createElement(ShoppingCart, { className: "h-6 w-6" }),
//         change: "+12.3%",
//         trend: "up",
//         color: "from-emerald-500 to-emerald-600",
//         lightColor: "bg-emerald-50",
//         textColor: "text-emerald-600",
//         subtitle: "Active pipeline",
//       },
//       {
//         id: 3,
//         title: "Pending Leads",
//         value: leadsData.pendingLeads.toLocaleString(),
//         icon: React.createElement(Activity, { className: "h-6 w-6" }),
//         change: "+0.5%",
//         trend: "up",
//         color: "from-purple-500 to-purple-600",
//         lightColor: "bg-purple-50",
//         textColor: "text-purple-600",
//         subtitle: "Awaiting follow-up",
//       },
//       {
//         id: 4,
//         title: "Loss Leads",
//         value: leadsData.lossLeads.toLocaleString(),
//         icon: React.createElement(TrendingUp, { className: "h-6 w-6" }),
//         change: leadsData.lossLeads > 0 ? "-8.1%" : "0.0%",
//         trend: leadsData.lossLeads > 0 ? "down" : "up",
//         color: "from-orange-500 to-orange-600",
//         lightColor: "bg-orange-50",
//         textColor: "text-orange-600",
//         subtitle: "Lost opportunities",
//       },
//     ]);
//   }
// }, [leadsData]);


//   const formatTimeAgo = (timestamp) => {
//     const now = new Date();
//     const diff = now - timestamp;
//     const minutes = Math.floor(diff / 60000);
//     const hours = Math.floor(diff / 3600000);
//     const days = Math.floor(diff / 86400000);

//     if (minutes < 60) {
//       return minutes + " mins ago";
//     } else if (hours < 24) {
//       return hours + " hours ago";
//     } else {
//       return days + " days ago";
//     }
//   };

//   const markAsRead = (id) => {
//     setNotifications(
//       notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   };

//   const getActivityStatusColor = (status) => {
//     if (status === "pending") {
//       return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
//     } else if (status === "completed") {
//       return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
//     } else if (status === "warning") {
//       return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
//     } else if (status === "cancelled") {
//       return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
//     } else if (status === "locked") {
//       return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
//     } else if (status === "active") {
//       return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
//     } else if (status === "Contacted" || status === "Engaged") {
//       return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
//     } else {
//       return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
//     }
//   };

//   return (
//     <>
//       <Header onToggleSidebar={toggleSidebar} />
//       <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
//         <div
//           className={cn(
//             "transition-all duration-300 ease-in-out min-h-screen dark:from-gray-900 dark:to-gray-800",
//             collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
//           )}
//         >
//           <main className="p-6">

// {/* Stats Grid */}
// <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
//   {stats.map((stat) => (
//     <div
//       key={stat.id}
//       className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-0.5"
//     >
//       {/* Background Gradient Overlay */}
//       <div className={"absolute inset-0 bg-gradient-to-br " + stat.color + " opacity-5 group-hover:opacity-10 transition-opacity duration-300"} />
      
//       {/* Main Content */}
//       <div className="relative p-4">
//         {/* Header with Icon and Change */}
//         <div className="flex items-start justify-between mb-3">
//           <div className={"p-2 rounded-xl " + stat.lightColor + " dark:" + stat.lightColor.replace("bg-", "bg-").replace("-50", "-900/30") + " group-hover:scale-110 transition-transform duration-300"}>
//             <div className={stat.textColor + " dark:" + stat.textColor.replace("text-", "text-").replace("-600", "-400")}>
//               {stat.icon}
//             </div>
//           </div>
          
//           <div className={"flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold " + (stat.trend === "up" 
//               ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
//               : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400") + " group-hover:scale-105 transition-transform duration-300"}>
//             <TrendingUp className={"h-3 w-3 " + (stat.trend === "down" ? "rotate-180" : "")} />
//             {stat.change}
//           </div>
//         </div>

//         {/* Stats Value */}
//         <div className="space-y-2 mb-3">
//           <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
//             {stat.value}
//           </h3>
//           <div className="space-y-1">
//             <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.title}</p>
//             <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
//           <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
//             <div className={"w-2 h-2 rounded-full " + (stat.trend === "up" ? "bg-emerald-500" : "bg-red-500")} />
//             {stat.subtitle}
//           </div>
//           <div className={"text-xs font-medium " + (stat.trend === "up" 
//               ? "text-emerald-600 dark:text-emerald-400" 
//               : "text-red-600 dark:text-red-400")}>
//             {stat.change}
//           </div>
//         </div>
//       </div>

//       {/* Animated Progress Bar */}
//       <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700">
//         <div className={"h-full bg-gradient-to-r " + stat.color + " transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"} />
//       </div>
//     </div>
//   ))}
// </div>



//             {/* Recent Activities */}
//             <div className="mb-8">
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
//                       <Activity className="h-5 w-5 text-blue-600" />
//                       Recent Activities
//                     </h2>
//                     <button
//                       onClick={() => navigate("/all-activities")}
//                       className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
//                     >
//                       <Eye className="h-4 w-4" />
//                       View All
//                     </button>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   {recentActivities.length === 0 ? (
//                     <div className="text-center py-8">
//                       <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
//                         <Activity className="h-8 w-8 text-gray-400" />
//                       </div>
//                       <p className="text-gray-500 dark:text-gray-400 mb-2">No recent activities</p>
//                       <p className="text-sm text-gray-400 dark:text-gray-500">Activities will appear here as they happen</p>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                       {recentActivities.map((activity) => (
//                         <div
//                           key={activity.id}
//                           className="flex flex-col gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors max-w-xs mx-auto w-full"
//                         >
//                           <div className="flex items-center gap-3">
//                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
//                               {activity.avatar || "?"}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//                                 {activity.user}
//                               </p>
//                               <span className="text-xs text-gray-500 dark:text-gray-400">
//                                 {activity.time}
//                               </span>
//                             </div>
//                           </div>
//                           <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{activity.action}</p>
//                           <span className={"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit " + getActivityStatusColor(activity.status)}>
//                             {activity.status}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Section */}
//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
// {/* Alerts & Reminders */}
// <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//   <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//     <div className="flex items-center justify-between">
//       <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
//         <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//         Alerts & Reminders
//       </h2>
//       <button
//         onClick={() => setShowAddAlertReminderForm(true)}
//         className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs font-medium"
//       >
//         <Plus className="h-3 w-3" />
//         Add
//       </button>
//     </div>
//   </div>
//   <div className="p-6">
//     {alerts.length > 0 ? (
//       <div className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           {alerts.slice(0, 4).map((alert, index) => {
//             // Color variations for different cards
//             const colors = [
//               { bg: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30', 
//                 iconBg: 'bg-blue-100 dark:bg-blue-800/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-700/50',
//                 iconColor: 'text-blue-600 dark:text-blue-400' },
//               { bg: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30',
//                 iconBg: 'bg-emerald-100 dark:bg-emerald-800/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700/50',
//                 iconColor: 'text-emerald-600 dark:text-emerald-400' },
//               { bg: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30',
//                 iconBg: 'bg-purple-100 dark:bg-purple-800/50 group-hover:bg-purple-200 dark:group-hover:bg-purple-700/50',
//                 iconColor: 'text-purple-600 dark:text-purple-400' },
//               { bg: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30',
//                 iconBg: 'bg-orange-100 dark:bg-orange-800/50 group-hover:bg-orange-200 dark:group-hover:bg-orange-700/50',
//                 iconColor: 'text-orange-600 dark:text-orange-400' }
//             ];
//             const colorScheme = colors[index % 4];
            
//             return (
//               <div
//                 key={alert.id}
//                 className={`p-4 ${colorScheme.bg} rounded-lg transition-colors group cursor-pointer`}
//               >
//                 <div className={`w-10 h-10 ${colorScheme.iconBg} rounded-lg flex items-center justify-center mb-3 transition-colors`}>
//                   <Bell className={`h-5 w-5 ${colorScheme.iconColor}`} />
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
//                   {alert.topic}
//                 </p>
//                 <div className="space-y-1 mb-2">
//                   <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
//                     <Calendar className="h-3 w-3" />
//                     {new Date(alert.date).toLocaleDateString()}
//                   </div>
//                   <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
//                     <Clock className="h-3 w-3" />
//                     {alert.time}
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
//                   {alert.remainder}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
        
//         {alerts.length > 4 && (
//           <p className="text-xs text-center text-gray-500 dark:text-gray-400">
//             +{alerts.length - 4} more alerts
//           </p>
//         )}
//       </div>
//     ) : (
//       <div className="text-center py-8">
//         <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
//           <Calendar className="h-8 w-8 text-gray-400" />
//         </div>
//         <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No alerts yet</p>
//         <p className="text-xs text-gray-500 dark:text-gray-400">Create your first alert or reminder</p>
//       </div>
//     )}
//   </div>
//   <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 rounded-b-xl border-t border-gray-200 dark:border-gray-600">
//     <button
//       onClick={() => navigate("/all-alerts-reminders")}
//       className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-2 transition-colors"
//     >
//       View All Alerts
//       <ArrowRight className="h-4 w-4" />
//     </button>
//   </div>
// </div>



//               {/* Quick Actions */}
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                   <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
//                     <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//                     Quick Actions
//                   </h2>
//                 </div>
//                 <div className="p-6">
//                   <div className="grid grid-cols-2 gap-4">
//                     <button className="p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors group">
//                       <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-700/50">
//                         <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                       </div>
//                       <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">View Reports</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Generate detailed analytics</p>
//                     </button>
                    
//                     <button className="p-4 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 rounded-lg transition-colors group">
//                       <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700/50">
//                         <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
//                       </div>
//                       <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Manage Users</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Add or edit user accounts</p>
//                     </button>
                    
//                     <button className="p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-lg transition-colors group">
//                       <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-700/50">
//                         <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
//                       </div>
//                       <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Inventory</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Manage product stock</p>
//                     </button>
                    
//                     <button className="p-4 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 rounded-lg transition-colors group">
//                       <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 dark:group-hover:bg-orange-700/50">
//                         <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
//                       </div>
//                       <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Settings</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Configure system preferences</p>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
        
//         <CombinedAlertReminder
//           isOpen={showAddAlertReminderForm}
//           onClose={() => setShowAddAlertReminderForm(false)}
//         />
//       </Sidebar>
//       <Footer />
//     </>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../config/api";
import {
  Users,
  ShoppingCart,
  Package,
  Activity,
  Calendar,
  TrendingUp,
  Plus,
  ArrowRight,
  BarChart3,
  Eye,
  Settings,
  Clock,
  Bell,
  Loader2,
  RefreshCw,
  ChevronRight,
  Zap,
  Target,
  Award,
  AlertCircle
} from "lucide-react";
import { Header } from "../common/Header";
import { Sidebar, useSidebar } from "../common/sidebar";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../hooks/use-theme";
import Footer from "../common/Footer";
import CombinedAlertReminder from "../../CombinedForUser&Admin/CombinedAlertReminder";

// Loading skeleton components
const StatCardSkeleton = () => (
  <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
);

const ActivityCardSkeleton = () => (
  <div className="flex flex-col gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      <div className="flex-1 space-y-1">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
    <div className="h-3 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
    <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
  </div>
);

const AlertCardSkeleton = () => (
  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg mb-3"></div>
    <div className="space-y-2">
      <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  </div>
);

const Dashboard = ({ collapsed }) => {
  const { theme } = useTheme();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [showAddAlertReminderForm, setShowAddAlertReminderForm] = useState(false);
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    stats: true,
    alerts: true,
    activities: true,
    overall: true
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [leadsData, setLeadsData] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    pendingLeads: 0,
    lossLeads: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoized stats configuration with improved icons and colors
  const statsConfig = useMemo(() => [
    {
      key: 'totalLeads',
      title: "Total Leads",
      icon: Target,
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
      subtitle: "This month",
      gradientText: "from-blue-500 to-blue-700"
    },
    {
      key: 'qualifiedLeads',
      title: "Qualified Leads",
      icon: Award,
      color: "from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
      subtitle: "Active pipeline",
      gradientText: "from-emerald-500 to-emerald-700"
    },
    {
      key: 'pendingLeads',
      title: "Pending Leads",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      lightColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
      subtitle: "Awaiting follow-up",
      gradientText: "from-amber-500 to-amber-700"
    },
    {
      key: 'lossLeads',
      title: "Lost Leads",
      icon: AlertCircle,
      color: "from-red-500 to-red-600",
      lightColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
      subtitle: "Lost opportunities",
      gradientText: "from-red-500 to-red-700"
    },
  ], []);

  // Calculate stats with improved logic
  const stats = useMemo(() => {
    if (!leadsData) return [];
    
    const conversionRate = leadsData.totalLeads > 0 
      ? ((leadsData.qualifiedLeads / leadsData.totalLeads) * 100).toFixed(1) 
      : "0.0";
    
    const lossRate = leadsData.totalLeads > 0 
      ? ((leadsData.lossLeads / leadsData.totalLeads) * 100).toFixed(1) 
      : "0.0";

    return statsConfig.map(config => {
      const value = leadsData[config.key];
      let change, trend;
      
      switch (config.key) {
        case 'totalLeads':
          change = "+5.2%";
          trend = "up";
          break;
        case 'qualifiedLeads':
          change = "+12.3%";
          trend = "up";
          break;
        case 'pendingLeads':
          change = "+0.5%";
          trend = "up";
          break;
        case 'lossLeads':
          change = value > 0 ? `-${lossRate}%` : "0.0%";
          trend = value > 0 ? "down" : "up";
          break;
        default:
          change = "0.0%";
          trend = "up";
      }

      return {
        id: config.key,
        value: value.toLocaleString(),
        change,
        trend,
        ...config
      };
    });
  }, [leadsData, statsConfig]);

  // Optimized API calls with better error handling
  const fetchLeadsAnalytics = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, stats: true }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");
      
      const response = await axios.get(`${API_BASE_URL}/api/analytics/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data) {
        setLeadsData({
          totalLeads: response.data.totalLeads || 0,
          qualifiedLeads: response.data.qualifiedLeads || 0,
          pendingLeads: response.data.pendingLeads || 0,
          lossLeads: response.data.lossLeads || 0
        });
      }
    } catch (error) {
      console.error("Failed to fetch leads analytics:", error);
      toast.error("Failed to load analytics data", {
        position: "top-right",
        theme: theme === "dark" ? "dark" : "light",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, stats: false }));
    }
  }, [theme]);

  const fetchRecentAlerts = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, alerts: true }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");
      
      const response = await axios.get(`${API_BASE_URL}/api/alert`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const recentAlerts = response.data.data
        ?.sort((a, b) => new Date(b.date) - new Date(a.date))
        ?.slice(0, 6) || [];
      setAlerts(recentAlerts);
    } catch (error) {
      toast.error("Failed to load alerts", {
        position: "top-right",
        theme: theme === "dark" ? "dark" : "light",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, alerts: false }));
    }
  }, [theme]);

  const fetchRecentActivities = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, activities: true }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");
      
      const response = await axios.get(`${API_BASE_URL}/api/recent`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allActivities = [];

      // Process Users
      if (response.data.userData && Array.isArray(response.data.userData)) {
        response.data.userData.forEach(user => {
          const firstName = user.firstName || "";
          const lastName = user.lastName || "";
          const avatar = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "??";
          
          allActivities.push({
            id: `user-${user.id}`,
            type: "user",
            user: `${firstName} ${lastName}`.trim() || "Unknown User",
            action: "registered new account",
            time: formatTimeAgo(new Date(user.createdAt)),
            status: user.locked ? "locked" : "completed",
            avatar,
            timestamp: new Date(user.createdAt)
          });
        });
      }

      // Process Employees
      if (response.data.lastCreatedEmployee && Array.isArray(response.data.lastCreatedEmployee)) {
        response.data.lastCreatedEmployee.forEach(emp => {
          const firstName = emp.firstName || "";
          const lastName = emp.lastName || "";
          const avatar = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "??";
          
          allActivities.push({
            id: `emp-${emp.id}`,
            type: "employee",
            user: `${firstName} ${lastName}`.trim() || "Unknown Employee",
            action: "joined the company",
            time: formatTimeAgo(new Date(emp.createdAt)),
            status: emp.status || "active",
            avatar,
            timestamp: new Date(emp.createdAt)
          });
        });
      }

      // Process Leads
      if (response.data.leads && Array.isArray(response.data.leads)) {
        response.data.leads.forEach(lead => {
          const firstName = lead.customerFirstName || "";
          const lastName = lead.customerLastName || "";
          const avatar = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "??";
          
          allActivities.push({
            id: `lead-${lead.id}`,
            type: "lead",
            user: `${firstName} ${lastName}`.trim() || "Unknown Lead",
            action: "created new lead",
            time: formatTimeAgo(new Date(lead.createdAt)),
            status: lead.status || "pending",
            avatar,
            timestamp: new Date(lead.createdAt)
          });
        });
      }

      // Sort by timestamp and take first 6
      allActivities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivities(allActivities.slice(0, 6));

    } catch (error) {
      toast.error("Failed to load recent activities", {
        position: "top-right",
        theme: theme === "dark" ? "dark" : "light",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, activities: false }));
    }
  }, [theme]);

  // Optimized time formatting
  const formatTimeAgo = useCallback((timestamp) => {
    if (!timestamp) return "Unknown";
    
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  }, []);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    setIsRefreshing(true);
    setLoadingStates({
      stats: true,
      alerts: true,
      activities: true,
      overall: true
    });

    try {
      await Promise.all([
        fetchLeadsAnalytics(),
        fetchRecentAlerts(),
        fetchRecentActivities()
      ]);
      toast.success("Dashboard refreshed successfully!", {
        position: "top-right",
        theme: theme === "dark" ? "dark" : "light",
      });
    } catch (error) {
      toast.error("Failed to refresh dashboard", {
        position: "top-right",
        theme: theme === "dark" ? "dark" : "light",
      });
    } finally {
      setIsRefreshing(false);
      setLoadingStates({
        stats: false,
        alerts: false,
        activities: false,
        overall: false
      });
    }
  }, [fetchLeadsAnalytics, fetchRecentAlerts, fetchRecentActivities, theme]);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchLeadsAnalytics(),
        fetchRecentAlerts(),
        fetchRecentActivities()
      ]);
      
      setLoadingStates({
        stats: false,
        alerts: false,
        activities: false,
        overall: false
      });
    };

    loadInitialData();
  }, [fetchLeadsAnalytics, fetchRecentAlerts, fetchRecentActivities]);

  const getActivityStatusColor = useCallback((status) => {
    const statusColors = {
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      warning: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      locked: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      contacted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      engaged: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    };
    
    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }, []);

  // Quick actions configuration
  const quickActions = useMemo(() => [
    {
      title: "Analytics",
      description: "View detailed reports",
      icon: BarChart3,
      color: "blue",
      onClick: () => navigate("/analytics")
    },
    {
      title: "Users",
      description: "Manage user accounts",
      icon: Users,
      color: "emerald",
      onClick: () => navigate("/users")
    },
    {
      title: "Inventory",
      description: "Track product stock",
      icon: Package,
      color: "purple",
      onClick: () => navigate("/inventory")
    },
    {
      title: "Settings",
      description: "System configuration",
      icon: Settings,
      color: "orange",
      onClick: () => navigate("/settings")
    }
  ], [navigate]);

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div
          className={cn(
            "",
            collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
          )}
        >
          <main className="p-6 space-y-8">
            {/* Header with Refresh Button */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Monitor your business performance and key metrics
                </p>
              </div>
              <button
                onClick={refreshAllData}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>

            {/* Stats Grid with Loading States */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loadingStates.stats ? (
                Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
              ) : (
                stats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-all duration-300`} />
                    
                    <div className="relative p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.lightColor} group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                        </div>
                        
                        <div className={cn(
                          "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 group-hover:scale-105",
                          stat.trend === "up" 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          <TrendingUp className={cn("h-3 w-3", stat.trend === "down" && "rotate-180")} />
                          {stat.change}
                        </div>
                      </div>

                      {/* Value and Title */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className={cn(
                            "text-2xl font-bold transition-all duration-300",
                            "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r",
                            `group-hover:${stat.gradientText}`,
                            "text-gray-900 dark:text-white"
                          )}>
                            {stat.value}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {stat.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {stat.subtitle}
                          </div>
                        </div>
                      </div>

                      {/* Progress indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700 rounded-b-xl">
                        <div className={cn(
                          "h-full bg-gradient-to-r rounded-b-xl transition-all duration-500 transform origin-left",
                          stat.color,
                          "scale-x-0 group-hover:scale-x-100"
                        )} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Recent Activities */}
            <div className="">
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Recent Activities
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Latest updates across your system
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/all-activities")}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    <Eye className="h-4 w-4" />
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {loadingStates.activities ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <ActivityCardSkeleton key={i} />)}
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                      <Activity className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">No recent activities</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Activities will appear here as they happen</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="group flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-blue-200 dark:hover:border-gray-500 hover:shadow-md hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                              {activity.avatar}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {activity.user}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {activity.time}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {activity.action}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105",
                            getActivityStatusColor(activity.status)
                          )}>
                            {activity.status}
                          </span>
                          <Zap className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Alerts & Reminders */}
              <div className="">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Alerts & Reminders
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Stay on top of important tasks
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddAlertReminderForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md hover:scale-105"
                    >
                      <Plus className="h-4 w-4" />
                      Add New
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {loadingStates.alerts ? (
                    <div className="grid grid-cols-2 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => <AlertCardSkeleton key={i} />)}
                    </div>
                  ) : alerts.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {alerts.slice(0, 4).map((alert, index) => {
                          const colors = [
                            { 
                              bg: 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/30 dark:hover:from-blue-800/30 dark:hover:to-blue-700/40', 
                              iconBg: 'bg-blue-500',
                              iconColor: 'text-white'
                            },
                            { 
                              bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/30 dark:hover:from-emerald-800/30 dark:hover:to-emerald-700/40',
                              iconBg: 'bg-emerald-500',
                              iconColor: 'text-white'
                            },
                            { 
                              bg: 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 dark:from-purple-900/20 dark:to-purple-800/30 dark:hover:from-purple-800/30 dark:hover:to-purple-700/40',
                              iconBg: 'bg-purple-500',
                              iconColor: 'text-white'
                            },
                            { 
                              bg: 'bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 dark:from-orange-900/20 dark:to-orange-800/30 dark:hover:from-orange-800/30 dark:hover:to-orange-700/40',
                              iconBg: 'bg-orange-500',
                              iconColor: 'text-white'
                            }
                          ];
                          const colorScheme = colors[index % 4];
                          
                          return (
                            <div
                              key={alert.id}
                              className={`group p-4 ${colorScheme.bg} rounded-xl transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-white/20`}
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <div className={`w-12 h-12 ${colorScheme.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Bell className={`h-6 w-6 ${colorScheme.iconColor}`} />
                              </div>
                              <div className="space-y-3">
                                <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {alert.topic}
                                </p>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(alert.date).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                    <Clock className="h-3 w-3" />
                                    {alert.time}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                  {alert.remainder}
                                </p>
                              </div>
                              
                              {/* Hover effect indicator */}
                              <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {alerts.length > 4 && (
                        <div className="text-center py-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            +{alerts.length - 4} more alerts
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <Calendar className="h-10 w-10 text-purple-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">No alerts yet</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Create your first alert or reminder</p>
                      <button
                        onClick={() => setShowAddAlertReminderForm(true)}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
                      >
                        Create Alert
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => navigate("/all-alerts-reminders")}
                    className="w-full flex items-center justify-center gap-2 text-xl font-medium text-purple-600 hover:text-purple-700 dark:text-purple-500 dark:hover:text-purple-600 transition-colors py-1"
                  >
                    View All Alerts
                    <ArrowRight className="h-8 w-8" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="">
                <div className="">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Quick Actions
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Fast access to key features
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={action.title}
                        onClick={action.onClick}
                        className={cn(
                          "group p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left",
                          action.color === 'blue' && "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/30",
                          action.color === 'emerald' && "bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/30",
                          action.color === 'purple' && "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 dark:from-purple-900/20 dark:to-purple-800/30",
                          action.color === 'orange' && "bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 dark:from-orange-900/20 dark:to-orange-800/30"
                        )}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300",
                          action.color === 'blue' && "bg-blue-500",
                          action.color === 'emerald' && "bg-emerald-500",
                          action.color === 'purple' && "bg-purple-500",
                          action.color === 'orange' && "bg-orange-500"
                        )}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {action.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                        
                        {/* Hover indicator */}
                        <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Overlay */}
            {loadingStates.overall && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      Loading Dashboard...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
        
        {/* Alert/Reminder Form Modal */}
        <CombinedAlertReminder
          isOpen={showAddAlertReminderForm}
          onClose={() => setShowAddAlertReminderForm(false)}
          onSuccess={() => {
            setShowAddAlertReminderForm(false);
            fetchRecentAlerts();
          }}
        />
      </Sidebar>
      <Footer />
    </>
  );
};

export default Dashboard;