import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserHeader } from "../common/UserHeader";
import { UserSidebar, useSidebarUser } from "../common/UserSidebar";
import { UserFooter } from "../common/UserFooter";
import { Calendar, Clock, Bell, Plus, ArrowRight, TrendingUp, TrendingDown, BarChart3, Users, Target, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useTheme } from "../../../hooks/use-theme";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { useNavigate } from "react-router-dom";
import CombinedAlertReminder from "../../CombinedForUser&Admin/CombinedAlertReminder";

const UserDashboard = ({ onLogout }) => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          throw new Error("Please login to view user data");
        }

        const response = await axios.get(`${API_BASE_URL}/api/usersData`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.data && response.data.success && response.data.data.user) {
          // Access user data directly from response.data.data.user
          const user = response.data.data.user;

          setCurrentUser({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            phoneNumber: user.phoneNumber,
            role: user.role,
            photo: user.photo,
            assignedWork: user.assignedWork || "No work assigned",
            statusOfWork: user.statusOfWork,
            about: user.about,
            skills: user.skills || []
          });
        } else {
          throw new Error("User data not found in response");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        
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
          toast.error(err.message || "Failed to load user data", {
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
        setUserLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (token && userId) {
      fetchCurrentUser();
    } else {
      setUserLoading(false);
    }
  }, [theme, onLogout]);

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

  const refreshDashboardData = async () => {
    setLeadsLoading(true);
    setLoading(true);
    setUserLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) return;

      const userResponse = await axios.get(`${API_BASE_URL}/api/usersData`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (userResponse.data && userResponse.data.success && userResponse.data.data.user) {
        const user = userResponse.data.data.user;
        setCurrentUser({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          phoneNumber: user.phoneNumber,
          role: user.role,
          photo: user.photo,
          assignedWork: user.assignedWork || "No work assigned",
          statusOfWork: user.statusOfWork,
          about: user.about,
          skills: user.skills || []
        });
      }

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
      setUserLoading(false);
    }
  };

  const displayUser = currentUser || {};

  return (
    <>
      <UserHeader onToggleSidebar={toggleSidebar} />
      <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className="min-h-screen">
          <div className="flex-1 overflow-auto">
            <main className="p-3 sm:p-4 lg:p-6">
              {/* Responsive Welcome Header */}
              <div className="flex flex-col sm:flex-row justify-between rounded-lg py-3 sm:py-4 px-3 sm:px-5 mb-4 items-start sm:items-center bg-[#ff8633] gap-3 sm:gap-0">
                <div className="bg-[#ff8633] rounded-lg text-white w-full sm:w-auto">
                  {userLoading ? (
                    <div className="animate-pulse">
                      <div className="h-6 sm:h-8 bg-white/20 rounded mb-2 w-48 sm:w-64"></div>
                      <div className="h-4 sm:h-6 bg-white/20 rounded w-64 sm:w-80"></div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
                        Welcome back, {displayUser.name || displayUser.firstName || 'User'}!
                      </h1>
                      <p className="opacity-90 text-sm sm:text-base">
                        <span className="block sm:inline">Your Assigned Work: {displayUser.assignedWork || "No work assigned"}.</span>
                        {displayUser.statusOfWork && (
                          <span className={`ml-0 sm:ml-2 mt-1 sm:mt-0 inline-block px-2 py-1 text-xs rounded-full ${
                            displayUser.statusOfWork === 'active' 
                              ? 'bg-green-500/20 text-green-100' 
                              : 'bg-red-500/20 text-red-100'
                          }`}>
                            {displayUser.statusOfWork}
                          </span>
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Responsive Enhanced Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4 lg:gap-0">
                <div className="space-y-2 w-full lg:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#ff8633] to-[#e07429] rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 lg:flex-none">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Dashboard
                      </h1>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                        Welcome back, {displayUser?.name || displayUser?.firstName || 'User'}! Here's your lead overview.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={refreshDashboardData}
                  disabled={leadsLoading || loading || userLoading}
                  className="group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#ff8633] to-[#e07429] hover:from-[#e07429] hover:to-[#cc6422] disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-sm sm:text-base w-full sm:w-auto justify-center lg:justify-start"
                >
                  {(leadsLoading || loading || userLoading) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                      <span className="font-medium">Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="font-medium">Refresh</span>
                    </>
                  )}
                </button>
              </div>

              {/* Responsive Enhanced Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {stats.map((stat, index) => {
                  const colorSchemes = [
                    { 
                      gradient: 'from-[#ff8633] via-[#ff8633] to-[#e07429]',
                      bg: 'bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-orange-900/20 dark:via-slate-800 dark:to-orange-800/30',
                      border: 'border-[#ff8633]/30 dark:border-[#ff8633]/50',
                      shadow: 'shadow-[#ff8633]/20',
                      iconBg: 'bg-[#ff8633]/10 dark:bg-[#ff8633]/20'
                    },
                    { 
                      gradient: 'from-[#ff8633] via-[#ff8633] to-[#e07429]',
                      bg: 'bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-orange-900/20 dark:via-slate-800 dark:to-orange-800/30',
                      border: 'border-[#ff8633]/30 dark:border-[#ff8633]/50',
                      shadow: 'shadow-[#ff8633]/20',
                      iconBg: 'bg-[#ff8633]/10 dark:bg-[#ff8633]/20'
                    },
                    { 
                      gradient: 'from-[#ff8633] via-[#ff8633] to-[#e07429]',
                      bg: 'bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-orange-900/20 dark:via-slate-800 dark:to-orange-800/30',
                      border: 'border-[#ff8633]/30 dark:border-[#ff8633]/50',
                      shadow: 'shadow-[#ff8633]/20',
                      iconBg: 'bg-[#ff8633]/10 dark:bg-[#ff8633]/20'
                    },
                    { 
                      gradient: 'from-[#ff8633] via-[#ff8633] to-[#e07429]',
                      bg: 'bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-orange-900/20 dark:via-slate-800 dark:to-orange-800/30',
                      border: 'border-[#ff8633]/30 dark:border-[#ff8633]/50',
                      shadow: 'shadow-[#ff8633]/20',
                      iconBg: 'bg-[#ff8633]/10 dark:bg-[#ff8633]/20'
                    }
                  ];
                  
                  const scheme = colorSchemes[index % 4];
                  const IconComponent = stat.icon;
                  
                  return (
                    <div
                      key={index}
                      className={`${scheme.bg} ${scheme.border} rounded-2xl p-4 sm:p-6 shadow-lg ${scheme.shadow} hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden border backdrop-blur-sm ${leadsLoading ? 'opacity-75' : ''}`}
                    >
                      {/* Background decorative elements */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#ff8633]/5 blur-2xl"></div>
                      <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-[#ff8633]/10"></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${scheme.iconBg} rounded-xl flex items-center justify-center border border-[#ff8633]/20`}>
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff8633]" />
                          </div>
                          <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                            stat.trend === "up" 
                              ? 'text-white bg-[#ff8633] shadow-md' 
                              : 'text-[#ff8633] bg-gray-100 dark:bg-gray-700 border border-[#ff8633]/30'
                          }`}>
                            {stat.trend === "up" ? <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2 h-2 sm:w-3 sm:h-3" />}
                            <span className="hidden sm:inline">{stat.change}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 sm:space-y-2">
                          <h3 className="text-[#ff8633] dark:text-[#ff8633] text-xs sm:text-sm font-semibold uppercase tracking-wider">
                            {stat.title}
                          </h3>
                          <div className="mb-1 sm:mb-2">
                            {leadsLoading ? (
                              <div className="animate-pulse bg-[#ff8633]/20 rounded-lg h-8 sm:h-10 w-16 sm:w-20"></div>
                            ) : (
                              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {stat.value}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                            {stat.description}
                          </p>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-3 sm:mt-4 w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-1.5 sm:h-2">
                          <div 
                            className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${scheme.gradient} transition-all duration-1000 ease-out shadow-sm`}
                            style={{ 
                              width: stat.trend === "up" ? '75%' : '45%'
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Loading overlay */}
                      {leadsLoading && (
                        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-[#ff8633] border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Responsive Two Column Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 w-full">
                {/* Enhanced Alerts & Reminders - Responsive */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
                  <div className="p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#ff8633] to-[#e07429] rounded-xl flex items-center justify-center">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        Alerts & Reminders
                      </h2>
                      <button
                        onClick={() => setShowAddAlertReminderForm(true)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#ff8633] to-[#e07429] hover:from-[#e07429] hover:to-[#cc6422] text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        Add New
                      </button>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    {loading ? (
                      <div className="text-center py-8 sm:py-12">
                        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 border-[#ff8633] border-t-transparent mx-auto mb-4"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading alerts...</p>
                      </div>
                    ) : alerts.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          {alerts.slice(0, 4).map((alert, index) => {
                            const colors = [
                              { bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30', 
                                border: 'border-[#ff8633]/30 dark:border-[#ff8633]/50',
                                iconBg: 'bg-[#ff8633]', iconColor: 'text-white' },
                              { bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30',
                                border: 'border-[#ff8633]/30 dark:border-[#ff8633]/50',
                                iconBg: 'bg-[#e07429]', iconColor: 'text-white' },
                              { bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30',
                                border: 'border-[#ff8633]/30 dark:border-[#ff8633]/50',
                                iconBg: 'bg-[#ff8633]', iconColor: 'text-white' },
                              { bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30',
                                border: 'border-[#ff8633]/30 dark:border-[#ff8633]/50',
                                iconBg: 'bg-[#e07429]', iconColor: 'text-white' }
                            ];
                            const colorScheme = colors[index % 4];
                            
                            return (
                              <div
                                key={alert.id}
                                className={`p-3 sm:p-4 ${colorScheme.bg} ${colorScheme.border} rounded-xl transition-all duration-300 group cursor-pointer border hover:shadow-lg transform hover:-translate-y-1`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colorScheme.iconBg} rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0`}>
                                    <Bell className={`h-4 w-4 sm:h-5 sm:w-5 ${colorScheme.iconColor}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-2 truncate">
                                      {alert.topic}
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
                                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                        <Calendar className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">{new Date(alert.date).toLocaleDateString()}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                        <Clock className="h-3 w-3 flex-shrink-0" />
                                        <span>{alert.time}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                      {alert.remainder}
                                    </p>
                                  </div>
                                </div>
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
                      <div className="text-center py-8 sm:py-12">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                        </div>
                        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">No alerts yet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Create your first alert or reminder to get started</p>
                      </div>
                    )}
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-b-2xl border-t border-gray-200/50 dark:border-gray-600/50">
                    <button
                      onClick={() => navigate("/all-alerts-reminders")}
                      className="text-base sm:text-lg font-bold text-[#ff8633] hover:text-[#e07429] dark:text-[#ff8633] dark:hover:text-[#e07429] flex items-center gap-2 transition-all duration-300 group"
                    >
                      View All Alerts
                      <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Projects - Responsive */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
                  <div className="p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#ff8633] to-[#e07429] rounded-xl flex items-center justify-center">
                          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        Your Projects
                      </h2>
                      <Link
                        to="#"
                        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#ff8633] to-[#e07429] hover:from-[#e07429] hover:to-[#cc6422] text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
                      >
                        + New Project
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="overflow-hidden">
                      <div className="space-y-3 sm:space-y-4">
                        {projects.map((project) => (
                          <div key={project.id} className="group p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                              <Link
                                to={`/projects/${project.id}`}
                                className="text-base sm:text-lg font-bold text-gray-900 dark:text-white hover:text-[#ff8633] dark:hover:text-[#ff8633] transition-colors flex items-center gap-2 group truncate min-w-0 flex-1"
                              >
                                <span className="truncate">{project.name}</span>
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                              </Link>
                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span
                                  className={`px-2 sm:px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${
                                    project.priority === "High"
                                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                      : project.priority === "Medium"
                                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  }`}
                                >
                                  {project.priority}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                              <span
                                className={`px-2 sm:px-3 py-1.5 text-xs font-bold rounded-lg ${
                                  project.status === "Completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : project.status === "In Progress"
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {project.status}
                              </span>
                              <div className="text-left sm:text-right">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Due Date</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{project.dueDate}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Progress</span>
                                <span className="text-xs font-bold text-gray-900 dark:text-white">{project.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
                                <div
                                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 ${
                                    project.progress === 100
                                      ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                      : project.progress > 50
                                      ? "bg-gradient-to-r from-[#ff8633] to-[#e07429]"
                                      : "bg-gradient-to-r from-[#ff8633] to-[#e07429]"
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
