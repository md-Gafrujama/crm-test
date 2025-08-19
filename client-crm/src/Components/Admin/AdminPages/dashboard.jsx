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
  Calendar,
  TrendingUp,
  Plus,
  ArrowRight,
  BarChart3,
  Eye,
  Settings,
  Clock,
  Bell,
} from "lucide-react";
import { Header } from "../common/Header";
import { Sidebar, useSidebar } from "../common/sidebar";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../hooks/use-theme";
import Footer from "../common/Footer";
import CombinedAlertReminder from "../../CombinedForUser&Admin/CombinedAlertReminder";

const Dashboard = ({ collapsed }) => {
  const { theme } = useTheme();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [showAddAlertReminderForm, setShowAddAlertReminderForm] = useState(false);
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
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

  useEffect(() => {
    const fetchRecentAlerts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login to view alerts");
        
        const response = await axios.get(`${API_BASE_URL}/api/alert`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const recentAlerts = response.data.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setAlerts(recentAlerts);
      } catch (error) {
        toast.error(
          error.response?.data?.message || error.message || "Failed to load alerts",
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
  }, [theme]);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login to view activities");
        
        const response = await axios.get(`${API_BASE_URL}/api/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allActivities = [];

        // Process Users
        if (response.data.userData && Array.isArray(response.data.userData)) {
          response.data.userData.forEach(user => {
            const firstName = user.firstName || "";
            const lastName = user.lastName || "";
            const avatar = firstName.charAt(0) + lastName.charAt(0);
            
            allActivities.push({
              id: user.id,
              type: "user",
              user: firstName + " " + lastName,
              action: "registered new account",
              time: formatTimeAgo(new Date(user.createdAt)),
              status: user.locked ? "locked" : "completed",
              avatar: avatar.toUpperCase(),
              timestamp: new Date(user.createdAt)
            });
          });
        }

        // Process Employees
        if (response.data.lastCreatedEmployee && Array.isArray(response.data.lastCreatedEmployee)) {
          response.data.lastCreatedEmployee.forEach(emp => {
            const firstName = emp.firstName || "";
            const lastName = emp.lastName || "";
            const avatar = firstName.charAt(0) + lastName.charAt(0);
            
            allActivities.push({
              id: emp.id,
              type: "employee",
              user: firstName + " " + lastName,
              action: "joined the company",
              time: formatTimeAgo(new Date(emp.createdAt)),
              status: emp.status || "active",
              avatar: avatar.toUpperCase(),
              timestamp: new Date(emp.createdAt)
            });
          });
        }

        // Process Leads
        if (response.data.leads && Array.isArray(response.data.leads)) {
          response.data.leads.forEach(lead => {
            const firstName = lead.customerFirstName || "";
            const lastName = lead.customerLastName || "";
            const avatar = firstName.charAt(0) + lastName.charAt(0);
            
            allActivities.push({
              id: lead.id,
              type: "lead",
              user: firstName + " " + lastName,
              action: "created new lead",
              time: formatTimeAgo(new Date(lead.createdAt)),
              status: lead.status || "pending",
              avatar: avatar.toUpperCase(),
              timestamp: new Date(lead.createdAt)
            });
          });
        }

        // Sort by timestamp (newest first) and take first 8
        allActivities.sort((a, b) => b.timestamp - a.timestamp);
        setRecentActivities(allActivities.slice(0, 4));

      } catch (error) {
        toast.error(
          error.response?.data?.message || error.message || "Failed to load recent activities",
          {
            position: "top-right",
            autoClose: 5000,
            theme: theme === "dark" ? "dark" : "light",
            style: { fontSize: "1.2rem" },
          }
        );
      }
    };

    fetchRecentActivities();
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats([
        {
          id: 1,
          title: "Total Leads",
          value: "1,248",
          icon: React.createElement(Package, { className: "h-6 w-6" }),
          change: "+5.2%",
          trend: "up",
          color: "from-blue-500 to-blue-600",
          lightColor: "bg-blue-50",
          textColor: "text-blue-600",
          subtitle: "This month",
        },
        {
          id: 2,
          title: "Qualified Leads",
          value: "342",
          icon: React.createElement(ShoppingCart, { className: "h-6 w-6" }),
          change: "+12.3%",
          trend: "up",
          color: "from-emerald-500 to-emerald-600",
          lightColor: "bg-emerald-50",
          textColor: "text-emerald-600",
          subtitle: "Active pipeline",
        },
        {
          id: 3,
          title: "Pending Leads",
          value: "24.8%",
          icon: React.createElement(Activity, { className: "h-6 w-6" }),
          change: "+0.5%",
          trend: "up",
          color: "from-purple-500 to-purple-600",
          lightColor: "bg-purple-50",
          textColor: "text-purple-600",
          subtitle: "Last 30 days",
        },
        {
          id: 4,
          title: "Loss Leads",
          value: "$45.2k",
          icon: React.createElement(TrendingUp, { className: "h-6 w-6" }),
          change: "+8.1%",
          trend: "up",
          color: "from-orange-500 to-orange-600",
          lightColor: "bg-orange-50",
          textColor: "text-orange-600",
          subtitle: "This quarter",
        },
      ]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return minutes + " mins ago";
    } else if (hours < 24) {
      return hours + " hours ago";
    } else {
      return days + " days ago";
    }
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getActivityStatusColor = (status) => {
    if (status === "pending") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    } else if (status === "completed") {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    } else if (status === "warning") {
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    } else if (status === "cancelled") {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    } else if (status === "locked") {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    } else if (status === "active") {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    } else if (status === "Contacted" || status === "Engaged") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    } else {
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div
          className={cn(
            "transition-all duration-300 ease-in-out min-h-screen dark:from-gray-900 dark:to-gray-800",
            collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
          )}
        >
          <main className="p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  {/* Background Gradient Overlay */}
                  <div className={"absolute inset-0 bg-gradient-to-br " + stat.color + " opacity-5 group-hover:opacity-10 transition-opacity duration-300"} />
                  
                  {/* Main Content */}
                  <div className="relative p-6">
                    {/* Header with Icon and Change */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={"p-3 rounded-xl " + stat.lightColor + " dark:" + stat.lightColor.replace("bg-", "bg-").replace("-50", "-900/30") + " group-hover:scale-110 transition-transform duration-300"}>
                        <div className={stat.textColor + " dark:" + stat.textColor.replace("text-", "text-").replace("-600", "-400")}>
                          {stat.icon}
                        </div>
                      </div>
                      
                      <div className={"flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold " + (stat.trend === "up" 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400") + " group-hover:scale-105 transition-transform duration-300"}>
                        <TrendingUp className={"h-3 w-3 " + (stat.trend === "down" ? "rotate-180" : "")} />
                        {stat.change}
                      </div>
                    </div>

                    {/* Stats Value */}
                    <div className="space-y-2 mb-4">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {stat.value}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className={"w-2 h-2 rounded-full " + (stat.trend === "up" ? "bg-emerald-500" : "bg-red-500")} />
                        {stat.subtitle}
                      </div>
                      <div className={"text-xs font-medium " + (stat.trend === "up" 
                          ? "text-emerald-600 dark:text-emerald-400" 
                          : "text-red-600 dark:text-red-400")}>
                        {stat.change}
                      </div>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700">
                    <div className={"h-full bg-gradient-to-r " + stat.color + " transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"} />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activities */}
            <div className="mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Recent Activities
                    </h2>
                    <button
                      onClick={() => navigate("/all-activities")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {recentActivities.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Activity className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mb-2">No recent activities</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Activities will appear here as they happen</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex flex-col gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors max-w-xs mx-auto w-full"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                              {activity.avatar || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {activity.user}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {activity.time}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{activity.action}</p>
                          <span className={"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit " + getActivityStatusColor(activity.status)}>
                            {activity.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Alerts & Reminders */}
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
                    <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    Quick Actions
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors group">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-700/50">
                        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">View Reports</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Generate detailed analytics</p>
                    </button>
                    
                    <button className="p-4 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 rounded-lg transition-colors group">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700/50">
                        <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Manage Users</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Add or edit user accounts</p>
                    </button>
                    
                    <button className="p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-lg transition-colors group">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-700/50">
                        <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Inventory</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage product stock</p>
                    </button>
                    
                    <button className="p-4 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 rounded-lg transition-colors group">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 dark:group-hover:bg-orange-700/50">
                        <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Settings</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Configure system preferences</p>
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
