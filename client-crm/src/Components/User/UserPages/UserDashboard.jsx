// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { UserHeader } from "../common/UserHeader";
// import { UserSidebar, useSidebarUser } from "../common/UserSidebar";
// import { UserFooter } from "../common/UserFooter";
// import { PersonalDetails } from "../common/PersonalDetails";
// import { Calendar, Clock, Bell, Plus, ArrowRight } from "lucide-react";
// import { toast } from "react-toastify";
// import { useTheme } from "../../../hooks/use-theme";
// import axios from "axios";
// import { API_BASE_URL } from "../../../config/api";
// import { useNavigate } from "react-router-dom";
// import CombinedAlertReminder from "../../CombinedForUser&Admin/CombinedAlertReminder";

// const UserDashboard = ({ onLogout }) => {
//   const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
//   const { user } = PersonalDetails(onLogout);
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { theme, setTheme } = useTheme();
//   const navigate = useNavigate();
//   const [showAddAlertReminderForm, setShowAddAlertReminderForm] = useState(false);

//   useEffect(() => {
//     const fetchAlerts = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const userId = localStorage.getItem("userId");

//         if (!token || !userId) {
//           throw new Error("Please login to view alerts");
//         }

//         const response = await axios.get(`${API_BASE_URL}/api/alert`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const userAlerts = response.data.data
//           .filter((alert) => alert.uid === userId)
//           .sort((a, b) => new Date(b.date) - new Date(a.date));

//         setAlerts(userAlerts);
//       } catch (err) {
//         setError(err.message);
//         toast.error(err.message || "Failed to load alerts", {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: theme === "dark" ? "dark" : "light",
//           style: { fontSize: "1.2rem" },
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAlerts();
//   }, []);

//   const stats = [
//     { title: "Total Leads", value: "24", change: "+12%", trend: "up" },
//     { title: "Qualified Leads", value: "156", change: "+5%", trend: "up" },
//     { title: "Pending Leads", value: "8", change: "-2%", trend: "down" },
//     { title: "Loss Leads", value: "14", change: "+3%", trend: "up" },
//   ];

//   const projects = [
//     {
//       id: 1,
//       name: "Website Redesign",
//       status: "Completed",
//       progress: 100,
//       dueDate: "May 15, 2023",
//     },
//     {
//       id: 2,
//       name: "Mobile App Development",
//       status: "In Progress",
//       progress: 75,
//       dueDate: "Jun 20, 2023",
//     },
//     {
//       id: 3,
//       name: "Dashboard UI",
//       status: "Not Started",
//       progress: 0,
//       dueDate: "Jul 10, 2023",
//     },
//     {
//       id: 4,
//       name: "API Integration",
//       status: "In Progress",
//       progress: 45,
//       dueDate: "Jun 5, 2023",
//     },
//   ];

//   return (
//     <>
//       <UserHeader onToggleSidebar={toggleSidebar} />
//       <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
//         <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
//           <div className="flex-1 overflow-auto">
//             <main className="p-6">
//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {stats.map((stat, index) => {
//                   const colorSchemes = [
//                     { 
//                       bg: 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/50',
//                       border: 'border-l-4 border-blue-500',
//                       valueColor: 'text-blue-700 dark:text-blue-300',
//                       changeUp: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
//                       changeDown: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
//                     },
//                     { 
//                       bg: 'bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/50',
//                       border: 'border-l-4 border-emerald-500',
//                       valueColor: 'text-emerald-700 dark:text-emerald-300',
//                       changeUp: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
//                       changeDown: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
//                     },
//                     { 
//                       bg: 'bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/50',
//                       border: 'border-l-4 border-purple-500',
//                       valueColor: 'text-purple-700 dark:text-purple-300',
//                       changeUp: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
//                       changeDown: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
//                     },
//                     { 
//                       bg: 'bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/50',
//                       border: 'border-l-4 border-orange-500',
//                       valueColor: 'text-orange-700 dark:text-orange-300',
//                       changeUp: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
//                       changeDown: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
//                     }
//                   ];
                  
//                   const scheme = colorSchemes[index % 4];
                  
//                   return (
//                     <div
//                       key={index}
//                       className={`${scheme.bg} ${scheme.border} rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
//                     >
//                       <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
//                       <div className="absolute bottom-0 left-0 -ml-2 -mb-2 w-8 h-8 rounded-full bg-white/5"></div>
                      
//                       <div className="relative">
//                         <div className="flex items-center justify-between mb-4">
//                           <h3 className="text-gray-600 dark:text-gray-300 text-sm font-semibold uppercase tracking-wider">
//                             {stat.title}
//                           </h3>
//                           <div className={`px-3 py-1 rounded-full text-xs font-bold ${
//                             stat.trend === "up" ? scheme.changeUp : scheme.changeDown
//                           }`}>
//                             {stat.change}
//                           </div>
//                         </div>
                        
//                         <div className="mb-2">
//                           <span className={`text-4xl font-extrabold ${scheme.valueColor} tracking-tight`}>
//                             {stat.value}
//                           </span>
//                         </div>
                        
//                         <div className="w-full bg-white/30 dark:bg-black/20 rounded-full h-1.5">
//                           <div 
//                             className={`h-1.5 rounded-full ${
//                               scheme.border.includes('blue') ? 'bg-blue-500' :
//                               scheme.border.includes('emerald') ? 'bg-emerald-500' :
//                               scheme.border.includes('purple') ? 'bg-purple-500' : 'bg-orange-500'
//                             } transition-all duration-1000 ease-out`}
//                             style={{ 
//                               width: stat.trend === "up" ? '75%' : '45%'
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
//                 {/* Alerts & Reminders */}
//                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//                   <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                     <div className="flex items-center justify-between">
//                       <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
//                         <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//                         Alerts & Reminders
//                       </h2>
//                       <button
//                         onClick={() => setShowAddAlertReminderForm(true)}
//                         className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs font-medium"
//                       >
//                         <Plus className="h-3 w-3" />
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                   <div className="p-6">
//                     {alerts.length > 0 ? (
//                       <div className="space-y-4">
//                         <div className="grid grid-cols-2 gap-4">
//                           {alerts.slice(0, 4).map((alert, index) => {
//                             const colors = [
//                               { bg: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30', 
//                                 iconBg: 'bg-blue-100 dark:bg-blue-800/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-700/50',
//                                 iconColor: 'text-blue-600 dark:text-blue-400' },
//                               { bg: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30',
//                                 iconBg: 'bg-emerald-100 dark:bg-emerald-800/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700/50',
//                                 iconColor: 'text-emerald-600 dark:text-emerald-400' },
//                               { bg: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30',
//                                 iconBg: 'bg-purple-100 dark:bg-purple-800/50 group-hover:bg-purple-200 dark:group-hover:bg-purple-700/50',
//                                 iconColor: 'text-purple-600 dark:text-purple-400' },
//                               { bg: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30',
//                                 iconBg: 'bg-orange-100 dark:bg-orange-800/50 group-hover:bg-orange-200 dark:group-hover:bg-orange-700/50',
//                                 iconColor: 'text-orange-600 dark:text-orange-400' }
//                             ];
//                             const colorScheme = colors[index % 4];
                            
//                             return (
//                               <div
//                                 key={alert.id}
//                                 className={`p-4 ${colorScheme.bg} rounded-lg transition-colors group cursor-pointer`}
//                               >
//                                 <div className={`w-10 h-10 ${colorScheme.iconBg} rounded-lg flex items-center justify-center mb-3 transition-colors`}>
//                                   <Bell className={`h-5 w-5 ${colorScheme.iconColor}`} />
//                                 </div>
//                                 <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
//                                   {alert.topic}
//                                 </p>
//                                 <div className="space-y-1 mb-2">
//                                   <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
//                                     <Calendar className="h-3 w-3" />
//                                     {new Date(alert.date).toLocaleDateString()}
//                                   </div>
//                                   <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
//                                     <Clock className="h-3 w-3" />
//                                     {alert.time}
//                                   </div>
//                                 </div>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
//                                   {alert.remainder}
//                                 </p>
//                               </div>
//                             );
//                           })}
//                         </div>
                        
//                         {alerts.length > 4 && (
//                           <p className="text-xs text-center text-gray-500 dark:text-gray-400">
//                             +{alerts.length - 4} more alerts
//                           </p>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8">
//                         <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
//                           <Calendar className="h-8 w-8 text-gray-400" />
//                         </div>
//                         <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No alerts yet</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">Create your first alert or reminder</p>
//                       </div>
//                     )}
//                   </div>
//                   <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 rounded-b-xl border-t border-gray-200 dark:border-gray-600">
//                     <button
//                       onClick={() => navigate("/all-alerts-reminders")}
//                       className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-2 transition-colors"
//                     >
//                       View All Alerts
//                       <ArrowRight className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Projects */}
//                 <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
//                   <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-400">
//                       Your Projects
//                     </h2>
//                     <Link
//                       to="#"
//                       className="px-4 py-2 bg-[#ff8633] hover:bg-orange-700 text-white rounded-lg text-sm transition-colors"
//                     >
//                       + New Project
//                     </Link>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead>
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Project
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Status
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Progress
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Due Date
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {projects.map((project) => (
//                           <tr key={project.id}>
//                             <td className="px-4 py-4 whitespace-nowrap text-left">
//                               <Link
//                                 to={`/projects/${project.id}`}
//                                 className="text-[#ff8633] text-left font-medium hover:text-orange-700 transition-colors"
//                               >
//                                 {project.name}
//                               </Link>
//                             </td>
//                             <td className="px-4 py-4 whitespace-nowrap">
//                               <span
//                                 className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                   project.status === "Completed"
//                                     ? "bg-green-100 text-green-800"
//                                     : project.status === "In Progress"
//                                     ? "bg-yellow-100 text-yellow-800"
//                                     : "bg-gray-100 text-gray-800"
//                                 }`}
//                               >
//                                 {project.status}
//                               </span>
//                             </td>
//                             <td className="px-4 py-4 whitespace-nowrap">
//                               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                                 <div
//                                   className={`h-2.5 rounded-full transition-all duration-300 ${
//                                     project.progress === 100
//                                       ? "bg-green-600"
//                                       : "bg-blue-600"
//                                   }`}
//                                   style={{ width: `${project.progress}%` }}
//                                 ></div>
//                               </div>
//                             </td>
//                             <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {project.dueDate}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </main>
//           </div>
//         </div>
//         <CombinedAlertReminder 
//           isOpen={showAddAlertReminderForm} 
//           onClose={() => setShowAddAlertReminderForm(false)}
//         />
//       </UserSidebar>
//       <UserFooter />
//     </>
//   );
// };

// export default UserDashboard;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserHeader } from "../common/UserHeader";
import { UserSidebar, useSidebarUser } from "../common/UserSidebar";
import { UserFooter } from "../common/UserFooter";
import { PersonalDetails } from "../common/PersonalDetails";
import { Calendar, Clock, Bell, Plus, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { useTheme } from "../../../hooks/use-theme";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { useNavigate } from "react-router-dom";
import CombinedAlertReminder from "../../CombinedForUser&Admin/CombinedAlertReminder";

const UserDashboard = ({ onLogout }) => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
  
  // Fix: Check if PersonalDetails returns an object with user property
  const personalDetailsResult = PersonalDetails(onLogout);
  const user = personalDetailsResult?.user || null;
  
  const [alerts, setAlerts] = useState([]);
  const [leadsData, setLeadsData] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    pendingLeads: 0,
    lossLeads: 0
  });
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [showAddAlertReminderForm, setShowAddAlertReminderForm] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userId) {
      toast.error("Please login to view dashboard", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
        style: { fontSize: "1.2rem" },
      });
      // Redirect to login page or call onLogout
      if (onLogout) {
        onLogout();
      } else {
        navigate('/login'); // Adjust the login route as needed
      }
      return;
    }
  }, [navigate, onLogout, theme]);

  // Fetch leads data from API
  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          throw new Error("Please login to view leads data");
        }

        const response = await axios.get(`${API_BASE_URL}/api/leads/dashboardLeads`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.data) {
          setLeadsData({
            totalLeads: response.data.totalLeads || 0,
            qualifiedLeads: response.data.qualifiedLeads || 0,
            pendingLeads: response.data.pendingLeads || 0,
            lossLeads: response.data.lossLeads || 0
          });
        }
      } catch (err) {
        console.error("Error fetching leads data:", err);
        
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme === "dark" ? "dark" : "light",
            style: { fontSize: "1.2rem" },
          });
          
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          if (onLogout) {
            onLogout();
          }
        } else {
          toast.error(err.message || "Failed to load leads data", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme === "dark" ? "dark" : "light",
            style: { fontSize: "1.2rem" },
          });
        }
      } finally {
        setLeadsLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (token && userId) {
      fetchLeadsData();
    } else {
      setLeadsLoading(false);
    }
  }, [theme, onLogout]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          throw new Error("Please login to view alerts");
        }

        const response = await axios.get(`${API_BASE_URL}/api/alert`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        // Check if response has the expected structure
        if (response.data && response.data.data) {
          const userAlerts = response.data.data
            .filter((alert) => alert.uid === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          setAlerts(userAlerts);
        } else {
          // Handle case where response structure is different
          setAlerts([]);
        }
      } catch (err) {
        console.error("Error fetching alerts:", err);
        
        // Handle different error types
        if (err.response?.status === 401) {
          setError("Authentication failed. Please login again.");
          toast.error("Session expired. Please login again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme === "dark" ? "dark" : "light",
            style: { fontSize: "1.2rem" },
          });
          
          // Clear localStorage and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          if (onLogout) {
            onLogout();
          }
        } else {
          setError(err.message || "Failed to load alerts");
          toast.error(err.message || "Failed to load alerts", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme === "dark" ? "dark" : "light",
            style: { fontSize: "1.2rem" },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch alerts if we have authentication
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (token && userId) {
      fetchAlerts();
    } else {
      setLoading(false);
    }
  }, [theme, onLogout]);

  // Calculate percentage changes for stats (you can customize this logic)
  const calculateChange = (current, previous = 0) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

  // Dynamic stats based on API data
  const stats = [
    { 
      title: "Total Leads", 
      value: leadsLoading ? "..." : leadsData.totalLeads.toString(), 
      change: leadsLoading ? "..." : calculateChange(leadsData.totalLeads), 
      trend: leadsData.totalLeads > 0 ? "up" : "down" 
    },
    { 
      title: "Qualified Leads", 
      value: leadsLoading ? "..." : leadsData.qualifiedLeads.toString(), 
      change: leadsLoading ? "..." : calculateChange(leadsData.qualifiedLeads), 
      trend: leadsData.qualifiedLeads > 0 ? "up" : "down" 
    },
    { 
      title: "Pending Leads", 
      value: leadsLoading ? "..." : leadsData.pendingLeads.toString(), 
      change: leadsLoading ? "..." : calculateChange(leadsData.pendingLeads), 
      trend: leadsData.pendingLeads > 0 ? "up" : "down" 
    },
    { 
      title: "Loss Leads", 
      value: leadsLoading ? "..." : leadsData.lossLeads.toString(), 
      change: leadsLoading ? "..." : calculateChange(leadsData.lossLeads), 
      trend: leadsData.lossLeads > 0 ? "up" : "down" 
    },
  ];

  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      status: "Completed",
      progress: 100,
      dueDate: "May 15, 2023",
    },
    {
      id: 2,
      name: "Mobile App Development",
      status: "In Progress",
      progress: 75,
      dueDate: "Jun 20, 2023",
    },
    {
      id: 3,
      name: "Dashboard UI",
      status: "Not Started",
      progress: 0,
      dueDate: "Jul 10, 2023",
    },
    {
      id: 4,
      name: "API Integration",
      status: "In Progress",
      progress: 45,
      dueDate: "Jun 5, 2023",
    },
  ];

  // Add a callback to refresh alerts when a new one is added
  const handleAlertAdded = () => {
    setShowAddAlertReminderForm(false);
    // Refresh alerts
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) return;

        const response = await axios.get(`${API_BASE_URL}/api/alert`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.data && response.data.data) {
          const userAlerts = response.data.data
            .filter((alert) => alert.uid === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          setAlerts(userAlerts);
        }
      } catch (err) {
        console.error("Error refreshing alerts:", err);
      }
    };

    fetchAlerts();
  };

  // Function to refresh both leads data and alerts
  const refreshDashboardData = async () => {
    setLeadsLoading(true);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) return;

      // Fetch leads data
      const leadsResponse = await axios.get(`${API_BASE_URL}/api/leads/dashboardLeads`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (leadsResponse.data) {
        setLeadsData({
          totalLeads: leadsResponse.data.totalLeads || 0,
          qualifiedLeads: leadsResponse.data.qualifiedLeads || 0,
          pendingLeads: leadsResponse.data.pendingLeads || 0,
          lossLeads: leadsResponse.data.lossLeads || 0
        });
      }

      // Fetch alerts data
      const alertsResponse = await axios.get(`${API_BASE_URL}/api/alert`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (alertsResponse.data && alertsResponse.data.data) {
        const userAlerts = alertsResponse.data.data
          .filter((alert) => alert.uid === userId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setAlerts(userAlerts);
      }

      toast.success("Dashboard data refreshed successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
        style: { fontSize: "1.2rem" },
      });

    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      toast.error("Failed to refresh dashboard data", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
        style: { fontSize: "1.2rem" },
      });
    } finally {
      setLeadsLoading(false);
      setLoading(false);
    }
  };

  return (
    <>
      <UserHeader onToggleSidebar={toggleSidebar} />
      <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
          <div className="flex-1 overflow-auto">
            <main className="p-6">
              {/* Header with Refresh Button */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                  <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your leads.</p>
                </div>
                <button
                  onClick={refreshDashboardData}
                  disabled={leadsLoading || loading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {(leadsLoading || loading) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                  const colorSchemes = [
                    { 
                      bg: 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/50',
                      border: 'border-l-4 border-blue-500',
                      valueColor: 'text-blue-700 dark:text-blue-300',
                      changeUp: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
                      changeDown: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
                    },
                    { 
                      bg: 'bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/50',
                      border: 'border-l-4 border-emerald-500',
                      valueColor: 'text-emerald-700 dark:text-emerald-300',
                      changeUp: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
                      changeDown: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
                    },
                    { 
                      bg: 'bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/50',
                      border: 'border-l-4 border-purple-500',
                      valueColor: 'text-purple-700 dark:text-purple-300',
                      changeUp: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
                      changeDown: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
                    },
                    { 
                      bg: 'bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/50',
                      border: 'border-l-4 border-orange-500',
                      valueColor: 'text-orange-700 dark:text-orange-300',
                      changeUp: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
                      changeDown: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
                    }
                  ];
                  
                  const scheme = colorSchemes[index % 4];
                  
                  return (
                    <div
                      key={index}
                      className={`${scheme.bg} ${scheme.border} rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${leadsLoading ? 'opacity-75' : ''}`}
                    >
                      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
                      <div className="absolute bottom-0 left-0 -ml-2 -mb-2 w-8 h-8 rounded-full bg-white/5"></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-gray-600 dark:text-gray-300 text-sm font-semibold uppercase tracking-wider">
                            {stat.title}
                          </h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            stat.trend === "up" ? scheme.changeUp : scheme.changeDown
                          }`}>
                            {stat.change}
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <span className={`text-4xl font-extrabold ${scheme.valueColor} tracking-tight`}>
                            {leadsLoading ? (
                              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded h-10 w-16"></div>
                            ) : (
                              stat.value
                            )}
                          </span>
                        </div>
                        
                        <div className="w-full bg-white/30 dark:bg-black/20 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              scheme.border.includes('blue') ? 'bg-blue-500' :
                              scheme.border.includes('emerald') ? 'bg-emerald-500' :
                              scheme.border.includes('purple') ? 'bg-purple-500' : 'bg-orange-500'
                            } transition-all duration-1000 ease-out`}
                            style={{ 
                              width: stat.trend === "up" ? '75%' : '45%'
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Loading overlay */}
                      {leadsLoading && (
                        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-xl flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {/* Alerts & Reminders - Keep this section exactly as it was */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        Alerts & Reminders
                      </h2>
                      <button
                        onClick={() => setShowAddAlertReminderForm(true)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs font-medium"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading alerts...</p>
                      </div>
                    ) : alerts.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {alerts.slice(0, 4).map((alert, index) => {
                            const colors = [
                              { bg: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30', 
                                iconBg: 'bg-blue-100 dark:bg-blue-800/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-700/50',
                                iconColor: 'text-blue-600 dark:text-blue-400' },
                              { bg: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30',
                                iconBg: 'bg-emerald-100 dark:bg-emerald-800/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700/50',
                                iconColor: 'text-emerald-600 dark:text-emerald-400' },
                              { bg: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30',
                                iconBg: 'bg-purple-100 dark:bg-purple-800/50 group-hover:bg-purple-200 dark:group-hover:bg-purple-700/50',
                                iconColor: 'text-purple-600 dark:text-purple-400' },
                              { bg: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30',
                                iconBg: 'bg-orange-100 dark:bg-orange-800/50 group-hover:bg-orange-200 dark:group-hover:bg-orange-700/50',
                                iconColor: 'text-orange-600 dark:text-orange-400' }
                            ];
                            const colorScheme = colors[index % 4];
                            
                            return (
                              <div
                                key={alert.id}
                                className={`p-4 ${colorScheme.bg} rounded-lg transition-colors group cursor-pointer`}
                              >
                                <div className={`w-10 h-10 ${colorScheme.iconBg} rounded-lg flex items-center justify-center mb-3 transition-colors`}>
                                  <Bell className={`h-5 w-5 ${colorScheme.iconColor}`} />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                                  {alert.topic}
                                </p>
                                <div className="space-y-1 mb-2">
                                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(alert.date).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    {alert.time}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                  {alert.remainder}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        
                        {alerts.length > 4 && (
                          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                            +{alerts.length - 4} more alerts
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No alerts yet</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Create your first alert or reminder</p>
                      </div>
                    )}
                  </div>
                  <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 rounded-b-xl border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => navigate("/all-alerts-reminders")}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-2 transition-colors"
                    >
                      View All Alerts
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Projects */}
                <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-400">
                      Your Projects
                    </h2>
                    <Link
                      to="#"
                      className="px-4 py-2 bg-[#ff8633] hover:bg-orange-700 text-white rounded-lg text-sm transition-colors"
                    >
                      + New Project
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {projects.map((project) => (
                          <tr key={project.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-left">
                              <Link
                                to={`/projects/${project.id}`}
                                className="text-[#ff8633] text-left font-medium hover:text-orange-700 transition-colors"
                              >
                                {project.name}
                              </Link>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  project.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : project.status === "In Progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {project.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full transition-all duration-300 ${
                                    project.progress === 100
                                      ? "bg-green-600"
                                      : "bg-blue-600"
                                  }`}
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {project.dueDate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <CombinedAlertReminder 
          isOpen={showAddAlertReminderForm} 
          onClose={() => setShowAddAlertReminderForm(false)}
          onSuccess={handleAlertAdded}
        />
      </UserSidebar>
      <UserFooter />
    </>
  );
};

export default UserDashboard;