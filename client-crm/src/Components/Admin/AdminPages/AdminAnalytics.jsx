import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../common/Footer";
import { Header } from "../common/Header";
import { Sidebar, useSidebar } from "../common/sidebar";
import { cn } from "../../../utils/cn";
import { API_BASE_URL } from "../../../config/api";
import { Package, ShoppingCart, Activity, TrendingUp } from "lucide-react";
import { User, Users, MessageSquare, Users2 } from "lucide-react";

// Chart.js imports for Bar charts
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
import { Bar } from "react-chartjs-2";

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
            conversionRateFromActive:
              userResponse.data.conversionRateFromActive || 0,
            conversionRateFromTotal:
              userResponse.data.conversionRateFromTotal || 0,
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
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load analytics data",
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
  }, []);

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
          "rgba(139, 92, 246, 0.8)", // Purple
          "rgba(16, 185, 129, 0.8)", // Emerald
          "rgba(245, 158, 11, 0.8)", // Amber
          "rgba(239, 68, 68, 0.8)", // Red
        ],
        borderColor: [
          "rgb(139, 92, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 3,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: [
          "rgba(139, 92, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        hoverBorderColor: [
          "rgb(139, 92, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
        ],
        hoverBorderWidth: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: "bold",
          },
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
        padding: 15,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          lineWidth: 1,
        },
        ticks: {
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
    },
  };

  // Wave Design Component for User Analytics
  const WaveDesignChart = ({ data }) => {
    const maxValue = Math.max(data.totalUser, data.activeUser, data.totalEmployee, data.conversionRateFromActive * 10);
    
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-3xl overflow-hidden border border-indigo-200/50 dark:border-indigo-700/50">
        {/* Animated Wave Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            
            {/* Animated Wave Paths */}
            <path
              d="M0,200 Q300,150 600,180 T1200,160 L1200,400 L0,400 Z"
              fill="url(#waveGradient1)"
              className="animate-pulse"
            />
            <path
              d="M0,220 Q400,170 800,200 T1200,180 L1200,400 L0,400 Z"
              fill="url(#waveGradient2)"
              style={{
                animation: "wave 4s ease-in-out infinite alternate",
              }}
            />
          </svg>
        </div>

        {/* User Analytics Content */}
        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-8 h-full">
            {/* Total Users - Wave Bar */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Total Users</h4>
              </div>
              <div className="relative">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {data.totalUser.toLocaleString()}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-2000 ease-out animate-pulse"
                    style={{ 
                      width: `${(data.totalUser / maxValue) * 100}%`,
                      animation: "expandWidth 2s ease-out"
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Active Users - Wave Bar */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Active Users</h4>
              </div>
              <div className="relative">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {data.activeUser.toLocaleString()}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-2000 ease-out animate-pulse"
                    style={{ 
                      width: `${(data.activeUser / maxValue) * 100}%`,
                      animation: "expandWidth 2.5s ease-out"
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Total Employees - Wave Bar */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Employees</h4>
              </div>
              <div className="relative">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {data.totalEmployee.toLocaleString()}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-2000 ease-out animate-pulse"
                    style={{ 
                      width: `${(data.totalEmployee / maxValue) * 100}%`,
                      animation: "expandWidth 3s ease-out"
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Conversion Rate - Wave Bar */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Conversion Rate</h4>
              </div>
              <div className="relative">
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                  {data.conversionRateFromActive.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-2000 ease-out animate-pulse"
                    style={{ 
                      width: `${(data.conversionRateFromActive / 100) * 100}%`,
                      animation: "expandWidth 3.5s ease-out"
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute bottom-8 left-8 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/2 right-8 w-4 h-4 bg-emerald-400 rounded-full animate-pulse opacity-60"></div>
      </div>
    );
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

            {/* Enhanced Bar Chart for Leads */}
            <div className="mb-12">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Lead Distribution Analysis
                  </h3>
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Comprehensive breakdown of all leads by status and performance metrics
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-8 shadow-xl">
                <div style={{ height: "450px" }} className="relative">
                  <Bar data={leadsBarData} options={barChartOptions} />
                </div>
              </div>
            </div>

            {/* Next 4 Stats Cards - Users Data */}
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

            {/* Enhanced Wave Design Chart for User Analytics */}
            <div className="mb-8">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    User Analytics Wave Overview
                  </h3>
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Interactive wave visualization of user engagement and conversion metrics
                </p>
              </div>
              <WaveDesignChart data={usersData} />
            </div>
          </div>
        </div>
      </Sidebar>
      <Footer />

      {/* Custom CSS for animations */}
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

        @keyframes wave {
          0% {
            transform: translateX(-10px) translateY(5px);
          }
          100% {
            transform: translateX(10px) translateY(-5px);
          }
        }

        @keyframes expandWidth {
          from {
            width: 0%;
          }
          to {
            width: var(--target-width, 100%);
          }
        }

        .animate-expandWidth {
          animation: expandWidth 2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default AdminAnalytics;