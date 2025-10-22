import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../common/Footer";
import { Header } from "../common/Header";
import { Sidebar, useSidebar } from "../common/sidebar";
import { cn } from "../../../utils/cn";
import { API_BASE_URL } from "../../../config/api";
import { Package, ShoppingCart, Activity, TrendingUp } from "lucide-react";
import { User, Users, MessageSquare, Users2 } from "lucide-react";
import GoogleAnalyticsDashboard from "../../Analytics/GoogleAnalyticsDashboard";
import { getCompanyIdFromToken } from "../../../utils/auth";

// Chart.js imports for Pie and Doughnut charts
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Doughnut, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminAnalytics = ({ collapsed }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  // State for leads data
  const [leadsData, setLeadsData] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    pendingLeads: 0,
    lossLeads: 0,
  });

  // State for users data
  const [usersData, setUsersData] = useState({
    totalUser: 0,
    activeUser: 0,
    totalEmployee: 0,
    conversionRateFromActive: 0,
    conversionRateFromTotal: 0,
  });

  // State for lead stats cards
  const [stats, setStats] = useState([]);
  // State for user stats cards
  const [additionalStats, setAdditionalStats] = useState([]);

  // Site Traffic: average time per page
  const [avgTimePages, setAvgTimePages] = useState([]);
  // Users for per-user site traffic filtering
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // { id, name }
  // Recent page-time events (to show device type and IP)
  const [recentEvents, setRecentEvents] = useState([]);

  // Map userId -> display name for quick lookup in events table
  const userNameById = useMemo(() => {
    const map = new Map();
    (allUsers || []).forEach((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
      const display = fullName || u.username || u.email || u.id;
      if (u.id) map.set(u.id, display);
    });
    return map;
  }, [allUsers]);

  // Fetch both APIs data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login to view analytics");

        // Fetch users analytics
        const userResponse = await axios.get(
          `${API_BASE_URL}/api/analytics/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch leads analytics
        const leadsResponse = await axios.get(
          `${API_BASE_URL}/api/analytics/leads`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (userResponse.data) {
          setUsersData({
            totalUser: userResponse.data.totalUser || 0,
            activeUser: userResponse.data.activeUser || 0,
            totalEmployee: userResponse.data.totalEmployee || 0,
            conversionRateFromActive: userResponse.data.conversionRateFromActive || 0,
            conversionRateFromTotal: userResponse.data.conversionRateFromTotal || 0,
          });
        }

        if (leadsResponse.data) {
          setLeadsData({
            totalLeads: leadsResponse.data.totalLeads || 0,
            qualifiedLeads: leadsResponse.data.qualifiedLeads || 0,
            pendingLeads: leadsResponse.data.pendingLeads || 0,
            lossLeads: leadsResponse.data.lossLeads || 0,
          });
        }

        // Fetch average time per page for Site Traffic section
        await fetchAvgTimePerPage(token, selectedUser?.id);
        // Fetch recent events (device & IP)
        await fetchRecentEvents(token, selectedUser?.id);

        // Fetch all users for search dropdown (admin-only API)
        try {
          const usersRes = await axios.get(`${API_BASE_URL}/api/allUser`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const list = Array.isArray(usersRes.data)
            ? usersRes.data
            : usersRes.data?.users || [];
          setAllUsers(list);
        } catch (e) {
          console.warn("Users list API:", e?.response?.data?.message || e.message);
          setAllUsers([]);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        toast.error(
          error.response?.data?.message || error.message || "Failed to load analytics data",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 800); // Smooth loading transition
      }
    };

    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to fetch averages with optional userId
  const fetchAvgTimePerPage = async (token, userId) => {
    try {
      const url = new URL(`${API_BASE_URL}/api/analytics/page-time/averages`);
      if (userId) url.searchParams.set("userId", userId);
      const avgRes = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (avgRes?.data?.data) {
        setAvgTimePages(Array.isArray(avgRes.data.data) ? avgRes.data.data : []);
      }
    } catch (e) {
      console.warn("Site Traffic API:", e?.response?.data?.message || e.message);
      setAvgTimePages([]);
    }
  };

  // Helper to fetch recent events with optional userId
  const fetchRecentEvents = async (token, userId) => {
    try {
      const url = new URL(`${API_BASE_URL}/api/analytics/page-time/events`);
      url.searchParams.set("limit", "10");
      if (userId) url.searchParams.set("userId", userId);
      const res = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      setRecentEvents(list);
    } catch (e) {
      console.warn("Site Events API:", e?.response?.data?.message || e.message);
      setRecentEvents([]);
    }
  };

  // Refetch averages when selected user changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchAvgTimePerPage(token, selectedUser?.id);
    fetchRecentEvents(token, selectedUser?.id);
  }, [selectedUser]);

  // Update stats with real leads data
  useEffect(() => {
    if (leadsData) {
      setStats([
        {
          id: 1,
          title: "Total Leads",
          value: leadsData.totalLeads.toLocaleString(),
          icon: <Package className="h-6 w-6" />,
          change: "+5.2%",
          trend: "up",
          gradient: "from-violet-500 via-purple-500 to-purple-600",
          bgGradient: "from-violet-50 to-purple-50",
          iconBg: "bg-gradient-to-br from-violet-100 to-purple-100",
          textColor: "text-violet-700",
          subtitle: "This month",
          shadowColor: "shadow-violet-500/20",
        },
        {
          id: 2,
          title: "Qualified Leads",
          value: leadsData.qualifiedLeads.toLocaleString(),
          icon: <ShoppingCart className="h-6 w-6" />,
          change: "+12.3%",
          trend: "up",
          gradient: "from-emerald-500 via-teal-500 to-cyan-500",
          bgGradient: "from-emerald-50 to-cyan-50",
          iconBg: "bg-gradient-to-br from-emerald-100 to-cyan-100",
          textColor: "text-emerald-700",
          subtitle: "Active pipeline",
          shadowColor: "shadow-emerald-500/20",
        },
        {
          id: 3,
          title: "Pending Leads",
          value: leadsData.pendingLeads.toLocaleString(),
          icon: <Activity className="h-6 w-6" />,
          change: "+0.5%",
          trend: "up",
          gradient: "from-amber-500 via-orange-500 to-red-500",
          bgGradient: "from-amber-50 to-orange-50",
          iconBg: "bg-gradient-to-br from-amber-100 to-orange-100",
          textColor: "text-orange-700",
          subtitle: "Awaiting follow-up",
          shadowColor: "shadow-amber-500/20",
        },
        {
          id: 4,
          title: "Loss Leads",
          value: leadsData.lossLeads.toLocaleString(),
          icon: <TrendingUp className="h-6 w-6" />,
          change: leadsData.lossLeads > 0 ? "-8.1%" : "0.0%",
          trend: leadsData.lossLeads > 0 ? "down" : "up",
          gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
          bgGradient: "from-rose-50 to-pink-50",
          iconBg: "bg-gradient-to-br from-rose-100 to-pink-100",
          textColor: "text-rose-700",
          subtitle: "Lost opportunities",
          shadowColor: "shadow-rose-500/20",
        },
      ]);
    }
  }, [leadsData]);

  // Update additional stats with real users data
  useEffect(() => {
    if (usersData) {
      setAdditionalStats([
        {
          id: 5,
          title: "Total Users",
          value: usersData.totalUser.toLocaleString(),
          icon: <User className="h-6 w-6" />,
          change: "+7.5%",
          trend: "up",
          gradient: "from-indigo-500 via-blue-500 to-cyan-500",
          bgGradient: "from-indigo-50 to-blue-50",
          iconBg: "bg-gradient-to-br from-indigo-100 to-blue-100",
          textColor: "text-indigo-700",
          subtitle: "This year",
          shadowColor: "shadow-indigo-500/20",
        },
        {
          id: 6,
          title: "Active Users",
          value: usersData.activeUser.toLocaleString(),
          icon: <Users className="h-6 w-6" />,
          change: "+3.2%",
          trend: "up",
          gradient: "from-green-400 via-emerald-500 to-teal-500",
          bgGradient: "from-green-50 to-emerald-50",
          iconBg: "bg-gradient-to-br from-green-100 to-emerald-100",
          textColor: "text-green-700",
          subtitle: "Last month",
          shadowColor: "shadow-green-500/20",
        },
        {
          id: 7,
          title: "Conversion Rate",
          value: `${usersData.conversionRateFromActive.toFixed(1)}%`,
          icon: <MessageSquare className="h-6 w-6" />,
          change: "+1.1%",
          trend: "up",
          gradient: "from-pink-500 via-rose-500 to-red-500",
          bgGradient: "from-pink-50 to-rose-50",
          iconBg: "bg-gradient-to-br from-pink-100 to-rose-100",
          textColor: "text-pink-700",
          subtitle: "Employee/Active ratio",
          shadowColor: "shadow-pink-500/20",
        },
        {
          id: 8,
          title: "Total Employees",
          value: usersData.totalEmployee.toLocaleString(),
          icon: <Users2 className="h-6 w-6" />,
          change: "+4.8%",
          trend: "up",
          gradient: "from-yellow-400 via-amber-500 to-orange-500",
          bgGradient: "from-yellow-50 to-amber-50",
          iconBg: "bg-gradient-to-br from-yellow-100 to-amber-100",
          textColor: "text-yellow-700",
          subtitle: "This quarter",
          shadowColor: "shadow-yellow-500/20",
        },
      ]);
    }
  }, [usersData]);

  // Enhanced Bar Chart Data for Lead Distribution
  const leadsBarData = {
    labels: ["Total Leads", "Qualified Leads", "Pending Leads", "Lost Leads"],
    datasets: [
      {
        label: "Lead Distribution",
        data: [
          leadsData.totalLeads,
          leadsData.qualifiedLeads,
          leadsData.pendingLeads,
          leadsData.lossLeads,
        ],
        backgroundColor: [
          "#8B5CF6", // Purple
          "#10B981", // Emerald
          "#F59E0B", // Amber
          "#EF4444", // Red
        ],
        borderColor: ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 0,
        borderRadius: 0,
        maxBarThickness: 60,
      },
    ],
  };

  // Enhanced Bar Chart Data for User Analytics
  const userBarData = {
    labels: ["Total Users", "Active Users", "Conversion Rate", "Total Employees"],
    datasets: [
      {
        label: "User Analytics",
        data: [
          usersData.totalUser,
          usersData.activeUser,
          usersData.conversionRateFromActive,
          usersData.totalEmployee,
        ],
        backgroundColor: ["#6366F1", "#22C55E", "#EC4899", "#EAB308"],
        borderColor: ["#6366F1", "#22C55E", "#EC4899", "#EAB308"],
        borderWidth: 0,
        borderRadius: 0,
        maxBarThickness: 60,
      },
    ],
  };

  // Site Traffic - Average time per page chart data (seconds)
  const avgTimeBarData = {
    labels: avgTimePages.map((d) => d.page.replace(/^\//, "") || "Home"),
    datasets: [
      {
        label: "Avg Time (seconds)",
        data: avgTimePages.map((d) =>
          Number((d.averageMs / 1000).toFixed(1))
        ),
        backgroundColor: "#0EA5E9",
        borderColor: "#0284C7",
        borderWidth: 0,
        borderRadius: 0,
        maxBarThickness: 60,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            return `${context.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { size: 12, weight: "500" },
          color: "#6B7280",
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(229, 231, 235, 0.8)",
          drawBorder: false,
          lineWidth: 1,
        },
        border: { display: true, color: "#D1D5DB", width: 1 },
        ticks: {
          font: { size: 11, weight: "400" },
          color: "#6B7280",
          padding: 10,
          stepSize: 1,
        },
      },
    },
    elements: { bar: { borderRadius: 4, borderSkipped: false } },
    animation: { duration: 800, easing: "easeOutQuart" },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 25,
          font: { size: 13, weight: "bold" },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            if (label.includes("Conversion Rate")) {
              return `${label}: ${value.toFixed(1)}%`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  // Enhanced Loading Component
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin h-16 w-16 border-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div
              className="h-16 w-16 border-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 rounded-full absolute top-0 left-0"
              style={{ animation: "spin 1s linear reverse infinite" }}
            ></div>
            <div className="absolute top-2 left-2 animate-spin h-12 w-12 border-4 border-white rounded-full"></div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Loading Analytics
            </h3>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn("")}>
          <div className="space-y-8 p-6">
            {/* Analytics Header */}
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Comprehensive insights into your leads performance and user
                engagement metrics
              </p>
            </div>

            {/* First 4 Stats Cards - Leads Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.id}
                  className={`group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl ${stat.shadowColor} transition-all duration-500 hover:-translate-y-2 hover:scale-105`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "slideInUp 0.6s ease-out forwards",
                  }}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
                  ></div>

                  {/* Animated Border */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl`}
                  ></div>

                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`${stat.iconBg} p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div
                          className={`${stat.textColor} group-hover:scale-110 transition-transform duration-300`}
                        >
                          {stat.icon}
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold shadow-sm ${
                          stat.trend === "up"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                        }`}
                      >
                        <TrendingUp
                          className={`h-3 w-3 ${
                            stat.trend === "down" ? "rotate-180" : ""
                          } group-hover:scale-110 transition-transform duration-300`}
                        />
                        {stat.change}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                          {stat.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          stat.trend === "up" ? "bg-emerald-500" : "bg-red-500"
                        } shadow-lg group-hover:scale-125 transition-transform duration-300`}
                      ></div>
                      <div
                        className={`text-sm font-bold ${
                          stat.trend === "up"
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-red-700 dark:text-red-400"
                        }`}
                      >
                        {stat.change}
                      </div>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50 dark:bg-gray-700/50 rounded-b-2xl overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lead Distribution */}
            <div className="">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Lead Distribution Analysis
                  </h3>
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Comprehensive breakdown of all leads by status and performance
                  metrics
                </p>
              </div>
              <div style={{ height: "450px" }} className="relative">
                <Bar data={leadsBarData} options={barChartOptions} />
              </div>
            </div>

            {/* Users Data Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {additionalStats.map((stat, index) => (
                <div
                  key={stat.id}
                  className={`group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl ${stat.shadowColor} transition-all duration-500 hover:-translate-y-2 hover:scale-105`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "slideInUp 0.6s ease-out forwards",
                  }}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
                  ></div>

                  {/* Animated Border */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl`}
                  ></div>

                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`${stat.iconBg} p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div
                          className={`${stat.textColor} group-hover:scale-110 transition-transform duration-300`}
                        >
                          {stat.icon}
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold shadow-sm ${
                          stat.trend === "up"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                        }`}
                      >
                        <TrendingUp
                          className={`h-3 w-3 ${
                            stat.trend === "down" ? "rotate-180" : ""
                          } group-hover:scale-110 transition-transform duration-300`}
                        />
                        {stat.change}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                          {stat.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          stat.trend === "up" ? "bg-emerald-500" : "bg-red-500"
                        } shadow-lg group-hover:scale-125 transition-transform duration-300`}
                      ></div>
                      <div
                        className={`text-sm font-bold ${
                          stat.trend === "up"
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-red-700 dark:text-red-400"
                        }`}
                      >
                        {stat.change}
                      </div>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50 dark:bg-gray-700/50 rounded-b-2xl overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* User Analytics Overview */}
            <div className="">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    User Analytics Overview
                  </h3>
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Distribution of Total Users, Active Users, Conversion Rate &
                  Total Employees
                </p>
              </div>
              <div style={{ height: "450px" }} className="relative">
                <Bar data={userBarData} options={barChartOptions} />
              </div>
            </div>

            {/* SITE TRAFFIC SECTION - Average Time Per Page with user search */}
            <div className="">
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full animate-pulse"></div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                      Site Traffic - Average Time Spent Per Page
                    </h3>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    User engagement metrics showing average time spent on each
                    page
                  </p>
                </div>

                {/* User search and selection */}
                <div className="max-w-3xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search user by name, email, or username"
                      className="w-full pl-4 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white"
                    />
                    {/* Suggestions */}
                    {userSearch.trim() && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-56 overflow-auto text-left">
                        {allUsers
                          .filter((u) => {
                            const q = userSearch.toLowerCase().trim();
                            return [
                              u.firstName,
                              u.lastName,
                              u.email,
                              u.username,
                            ]
                              .filter(Boolean)
                              .some((v) => v.toString().toLowerCase().includes(q));
                          })
                          .slice(0, 10)
                          .map((u) => (
                            <button
                              key={u.id}
                              className="w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                              onClick={() => {
                                setSelectedUser({
                                  id: u.id,
                                  name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username || u.email,
                                });
                                setUserSearch("");
                              }}
                            >
                              {(u.firstName || u.lastName) ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : (u.username || u.email)}
                            </button>
                          ))}
                        {allUsers.length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500">No users</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Selected:</span>{" "}
                      {selectedUser?.name ? selectedUser.name : "All users"}
                    </div>
                    {selectedUser && (
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {avgTimePages.length > 0 ? (
                  <div style={{ height: "450px" }} className="relative">
                    <Bar data={avgTimeBarData} options={barChartOptions} />
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                    No data to display for the current selection.
                  </div>
                )}
            </div>

            {/* RECENT EVENTS - shows device type and IP */}
            <div className="mt-10">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                    Recent Page Events (Device & IP)
                  </h3>
                  <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Latest 100 events for {selectedUser?.name ? selectedUser.name : "all users"}
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/60">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Time</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">User ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Page</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Duration (s)</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Device</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                    {recentEvents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No recent events.</td>
                      </tr>
                    )}
                    {recentEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{new Date(ev.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{(ev.userId && userNameById.get(ev.userId)) || "-"}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{ev.page}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{(ev.durationMs / 1000).toFixed(1)}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200 capitalize">{ev.deviceType || "desktop"}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{ev.ip || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Google Analytics Integration */}
            <div className="mt-10">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Google Analytics Integration
                  </h3>
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Real-time website analytics and user behavior insights
                </p>
              </div>
              <GoogleAnalyticsDashboard companyId={getCompanyIdFromToken()} />
            </div>

          </div>
        </div>
      </Sidebar>
      <Footer />

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default AdminAnalytics;
