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

const UserAnalytics = ({ onLogout }) => {
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
        <div className="">
          <div className="flex-1 overflow-auto">
            <main className="p-6">



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



              </div>
            </main>
          </div>
        </div>
      

      </UserSidebar>
      <UserFooter />
    </>
  );
};

export default UserAnalytics;