import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../../config/api";
import {
  Users,
  Package,
  BarChart3,
  Settings,
  Target,
  Award,
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Header } from "../../common/Header";
import { Sidebar, useSidebar } from "../../common/sidebar";
import { cn } from "../../../../utils/cn";
import { useTheme } from "../../../../hooks/use-theme";
import Footer from "../../common/Footer";
import CombinedAlertReminder from "../../../CombinedForUser&Admin/CombinedAlertReminder";

// Import modular components
import DashboardOverview from "./DashboardOverview";
import RecentActivities from "./RecentActivities";
import QuickActions from "./QuickActions";

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

  const handleAddAlertReminder = useCallback(() => {
    setShowAddAlertReminderForm(true);
  }, []);

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
            {/* Dashboard Overview Section */}
            <DashboardOverview 
              stats={stats}
              loadingStates={loadingStates}
              isRefreshing={isRefreshing}
              onRefresh={refreshAllData}
            />

            {/* Recent Activities Section */}
            <RecentActivities 
              recentActivities={recentActivities}
              loadingStates={loadingStates}
              getActivityStatusColor={getActivityStatusColor}
            />

            {/* Quick Actions Section */}
            <QuickActions 
              alerts={alerts}
              loadingStates={loadingStates}
              quickActions={quickActions}
              onAddAlertReminder={handleAddAlertReminder}
            />

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
