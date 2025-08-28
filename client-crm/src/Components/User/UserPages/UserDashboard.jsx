
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserHeader } from "../common/UserHeader";
import { UserSidebar, useSidebarUser } from "../common/UserSidebar";
import { UserFooter } from "../common/UserFooter";
import { PersonalDetails } from "../common/PersonalDetails";
import { Calendar, Clock, Bell, Plus, ArrowRight, TrendingUp, TrendingDown, BarChart3, Users, Target, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useTheme } from "../../../hooks/use-theme";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { useNavigate } from "react-router-dom";
import CombinedAlertReminder from "../../CombinedForUser&Admin/CombinedAlertReminder";

const UserDashboard = ({ onLogout }) => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
  
  // Fix: Use PersonalDetails as a hook, not a function call
  // const { user, loading: userLoading } = PersonalDetails(onLogout) || {};
  
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
  const { theme } = useTheme();
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
      
      if (onLogout) {
        onLogout();
      } else {
        navigate('/login');
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

        if (response.data && response.data.data) {
          const userAlerts = response.data.data
            .filter((alert) => alert.uid === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          setAlerts(userAlerts);
        } else {
          setAlerts([]);
        }
      } catch (err) {
        console.error("Error fetching alerts:", err);
        
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

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (token && userId) {
      fetchAlerts();
    } else {
      setLoading(false);
    }
  }, [theme, onLogout]);

  // Calculate percentage changes for stats
  const calculateChange = (current, previous = 0) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

  // Dynamic stats based on API data with icons
  const stats = [
    { 
      title: "Total Leads", 
      value: leadsLoading ? "..." : leadsData.totalLeads.toString(), 
      change: leadsLoading ? "..." : calculateChange(leadsData.totalLeads), 
      trend: leadsData.totalLeads > 0 ? "up" : "down",
      icon: BarChart3,
      description: "All leads in your pipeline"
    },
    { 
      title: "Qualified Leads", 
      value: leadsLoading ? "..." : leadsData.qualifiedLeads.toString(), 
      change: leadsLoading ? "..." : calculateChange(leadsData.qualifiedLeads), 
      trend: leadsData.qualifiedLeads > 0 ? "up" : "down",
      icon: Target,
      description: "Leads ready for conversion"
    },
    { 
      title: "Pending Leads", 
      value: leadsLoading ? "..." : leadsData.pendingLeads.toString(), 
      change: leadsLoading ? "..." : calculateChange(leadsData.pendingLeads), 
      trend: leadsData.pendingLeads > 0 ? "up" : "down",
      icon: Clock,
      description: "Awaiting follow-up"
    },
    { 
      title: "Loss Leads", 
      value: leadsLoading ? "..." : leadsData.lossLeads.toString(), 
      change: leadsLoading ? "..." : calculateChange(leadsData.lossLeads), 
      trend: leadsData.lossLeads > 0 ? "up" : "down",
      icon: AlertCircle,
      description: "Leads that didn't convert"
    },
  ];

  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      status: "Completed",
      progress: 100,
      dueDate: "May 15, 2024",
      priority: "High"
    },
    {
      id: 2,
      name: "Mobile App Development",
      status: "In Progress",
      progress: 75,
      dueDate: "Jun 20, 2024",
      priority: "Medium"
    },
    {
      id: 3,
      name: "Dashboard UI",
      status: "Not Started",
      progress: 0,
      dueDate: "Jul 10, 2024",
      priority: "Low"
    },
    {
      id: 4,
      name: "API Integration",
      status: "In Progress",
      progress: 45,
      dueDate: "Jun 5, 2024",
      priority: "High"
    },
  ];

  // Enhanced callback to refresh alerts when a new one is added
  const handleAlertAdded = async () => {
    setShowAddAlertReminderForm(false);
    
    // Show success toast
    toast.success("Alert added successfully! 🎉", {
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

    // Refresh alerts
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
      toast.error("Failed to refresh alerts", {
        position: "top-right",
        autoClose: 3000,
        theme: theme === "dark" ? "dark" : "light",
      });
    }
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

      toast.success("Dashboard refreshed successfully! ✨", {
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
        <div className="">
         <div className="flex-1 overflow-auto">
            <main className="p-6">
              <div className="flex flex-row justify-between rounded-lg py-4 p-5 mb-4 items-center bg-[#ff8633]">
                <div className="bg-[#ff8633] rounded-lg p-6 mb-6 text-white">
                  <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {user.name} !
                  </h1>
                  <p className="opacity-90">
                    Your Assigned Work:{" "}
                    {user.assignedWork || "Nothing is assigned to you."}.
                  </p>
                </div>
                <div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white p-5 justify-center hover:bg-gray-100 text-[#ff8633] rounded-md transition-colors shadow-md">
                    Upload Data
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                        transform="rotate(180 10 10)"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm"
                  >
                    <h3 className="text-gray-500 text-sm font-medium">
                      {stat.title}
                    </h3>
                    <div className="flex items-end mt-2">
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-400 ">
                        {stat.value}
                      </span>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-row justify-between">
                    <h2 className="text-lg dark:text-gray-400 font-semibold flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-red-500" />
                      Alerts and Reminders
                    </h2>
                     <button onClick={() => setShowAddAlertReminderForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#ff8633] hover:bg-orange-500 text-white rounded-md transition-colors">
          Add Alerts and Reminder
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
                  </div>
                  <div className="p-6">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded shadow-sm flex items-center gap-4 overflow-x-auto"
                      >
                        <span className="font-medium text-gray-900 text-left dark:text-white min-w-[100px]">
                          {alert.topic}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          📅 {new Date(alert.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          ⏰ {alert.time}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          🔔 {alert.remainder}
                        </span>
                        {alert.description && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            📝 {alert.description}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right">
                    <button
                      onClick={() => navigate("/all-alerts-reminders")}
                      className="text-sm font-medium text-[#ff8633]"
                    >
                      View All Events →
                    </button>
                  </div>
                </div>

                <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-400">
                      Your Projects
                    </h2>
                    <Link
                      to="#"
                      className="px-4 py-2 bg-[#ff8633] text-white rounded-lg  text-sm"
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
                                className="text-[#ff8633] text-left font-medium"
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
                                  className={`h-2.5 rounded-full ${
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
          <div className="flex-1 overflow-auto">
            <main className="p-6">
              {/* Enhanced Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    {/* <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Dashboard
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Welcome back, {user?.name || 'User'}! Here's your lead overview.
                      </p>
                    </div> */}
                  </div>
                </div>
                <button
                  onClick={refreshDashboardData}
                  disabled={leadsLoading || loading}
                  className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {(leadsLoading || loading) ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span className="font-medium">Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="font-medium">Refresh</span>
                    </>
                  )}
                </button>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                  const colorSchemes = [
                    { 
                      gradient: 'from-blue-500 via-blue-600 to-blue-700',
                      bg: 'bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900/20 dark:via-slate-800 dark:to-blue-800/30',
                      border: 'border-blue-200 dark:border-blue-700/50',
                      shadow: 'shadow-blue-500/20',
                      iconBg: 'bg-blue-100 dark:bg-blue-800/30'
                    },
                    { 
                      gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
                      bg: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-900/20 dark:via-slate-800 dark:to-emerald-800/30',
                      border: 'border-emerald-200 dark:border-emerald-700/50',
                      shadow: 'shadow-emerald-500/20',
                      iconBg: 'bg-emerald-100 dark:bg-emerald-800/30'
                    },
                    { 
                      gradient: 'from-purple-500 via-purple-600 to-purple-700',
                      bg: 'bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-purple-900/20 dark:via-slate-800 dark:to-purple-800/30',
                      border: 'border-purple-200 dark:border-purple-700/50',
                      shadow: 'shadow-purple-500/20',
                      iconBg: 'bg-purple-100 dark:bg-purple-800/30'
                    },
                    { 
                      gradient: 'from-orange-500 via-orange-600 to-orange-700',
                      bg: 'bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-orange-900/20 dark:via-slate-800 dark:to-orange-800/30',
                      border: 'border-orange-200 dark:border-orange-700/50',
                      shadow: 'shadow-orange-500/20',
                      iconBg: 'bg-orange-100 dark:bg-orange-800/30'
                    }
                  ];
                  
                  const scheme = colorSchemes[index % 4];
                  const IconComponent = stat.icon;
                  
                  return (
                    <div
                      key={index}
                      className={`${scheme.bg} ${scheme.border} rounded-2xl p-6 shadow-lg ${scheme.shadow} hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden border backdrop-blur-sm ${leadsLoading ? 'opacity-75' : ''}`}
                    >
                      {/* Background decorative elements */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
                      <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-white/5"></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${scheme.iconBg} rounded-xl flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                          </div>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            stat.trend === "up" 
                              ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' 
                              : 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {stat.change}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                            {stat.title}
                          </h3>
                          <div className="mb-2">
                            {leadsLoading ? (
                              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded-lg h-10 w-20"></div>
                            ) : (
                              <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {stat.value}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {stat.description}
                          </p>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-4 w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full bg-gradient-to-r ${scheme.gradient} transition-all duration-1000 ease-out`}
                            style={{ 
                              width: stat.trend === "up" ? '75%' : '45%'
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Loading overlay */}
                      {leadsLoading && (
                        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {/* Enhanced Alerts & Reminders */}
                <div className="">
                  <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        Alerts & Reminders
                      </h2>
                      <button
                        onClick={() => setShowAddAlertReminderForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Plus className="h-4 w-4" />
                        Add New
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading alerts...</p>
                      </div>
                    ) : alerts.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {alerts.slice(0, 4).map((alert, index) => {
                            const colors = [
                              { bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30', 
                                border: 'border-blue-200 dark:border-blue-700/50',
                                iconBg: 'bg-blue-500', iconColor: 'text-white' },
                              { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/30',
                                border: 'border-emerald-200 dark:border-emerald-700/50',
                                iconBg: 'bg-emerald-500', iconColor: 'text-white' },
                              { bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30',
                                border: 'border-purple-200 dark:border-purple-700/50',
                                iconBg: 'bg-purple-500', iconColor: 'text-white' },
                              { bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30',
                                border: 'border-orange-200 dark:border-orange-700/50',
                                iconBg: 'bg-orange-500', iconColor: 'text-white' }
                            ];
                            const colorScheme = colors[index % 4];
                            
                            return (
                              <div
                                key={alert.id}
                                className={`p-4 ${colorScheme.bg} ${colorScheme.border} rounded-xl transition-all duration-300 group cursor-pointer border hover:shadow-lg transform hover:-translate-y-1`}
                              >
                                <div className={`w-10 h-10 ${colorScheme.iconBg} rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110`}>
                                  <Bell className={`h-5 w-5 ${colorScheme.iconColor}`} />
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                  {alert.topic}
                                </p>
                                <div className="space-y-1 mb-2">
                                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(alert.date).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    {alert.time}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                  {alert.remainder}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        
                        {alerts.length > 4 && (
                          <div className="text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              +{alerts.length - 4} more alerts
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Calendar className="h-10 w-10 text-gray-400" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No alerts yet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Create your first alert or reminder to get started</p>
                      </div>
                    )}
                  </div>
                  <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-b-2xl border-t border-gray-200/50 dark:border-gray-600/50">
                    <button
                      onClick={() => navigate("/all-alerts-reminders")}
                      className="text-lg font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-2 transition-all duration-300 group"
                    >
                      View All Alerts
                      <ArrowRight className="h-8 w-8 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Projects */}
                <div className="">
                  <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        Your Projects
                      </h2>
                      <Link
                        to="#"
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        + New Project
                      </Link>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="overflow-hidden">
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div key={project.id} className="group p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3">
                              <Link
                                to={`/projects/${project.id}`}
                                className="text-lg font-bold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-2 group"
                              >
                                {project.name}
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                              </Link>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                                    project.priority === "High"
                                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                      : project.priority === "Medium"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  }`}
                                >
                                  {project.priority}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                                  project.status === "Completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : project.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {project.status}
                              </span>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Due Date</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{project.dueDate}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Progress</span>
                                <span className="text-xs font-bold text-gray-900 dark:text-white">{project.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full transition-all duration-500 ${
                                    project.progress === 100
                                      ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                      : project.progress > 50
                                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                                      : "bg-gradient-to-r from-orange-500 to-red-500"
                                  }`}
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Enhanced Alert/Reminder Form Modal */}
        {showAddAlertReminderForm && (
          <CombinedAlertReminder 
            isOpen={showAddAlertReminderForm} 
            onClose={() => setShowAddAlertReminderForm(false)}
            onSuccess={handleAlertAdded}
          />
        )}
      </UserSidebar>
      <UserFooter />
    </>
  );
};

export default UserDashboard;


