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

  // Enhanced Pie Chart Data for Lead Distribution
  const leadsPieData = {
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
        hoverOffset: 15,
        hoverBorderWidth: 4,
      },
    ],
  };

  // Enhanced Doughnut Chart Data for User Analytics
  const userDoughnutData = {
    labels: [
      "Total Users",
      "Active Users",
      "Conversion Rate",
      "Total Employees",
    ],
    datasets: [
      {
        label: "User Analytics",
        data: [
          usersData.totalUser,
          usersData.activeUser,
          usersData.conversionRateFromActive,
          usersData.totalEmployee,
        ],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)", // Indigo
          "rgba(34, 197, 94, 0.8)", // Green
          "rgba(236, 72, 153, 0.8)", // Pink
          "rgba(234, 179, 8, 0.8)", // Yellow
        ],
        borderColor: [
          "rgb(99, 102, 241)",
          "rgb(34, 197, 94)",
          "rgb(236, 72, 153)",
          "rgb(234, 179, 8)",
        ],
        borderWidth: 3,
        cutout: "65%",
        hoverOffset: 15,
        hoverBorderWidth: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 25,
          font: {
            size: 13,
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

            {/* Enhanced Chart for Leads - Pie Chart */}
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
                <Pie data={leadsPieData} options={chartOptions} />
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

            {/* Enhanced Doughnut Chart for User Analytics */}
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
                <Doughnut data={userDoughnutData} options={chartOptions} />
              </div>
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
      `}</style>
    </>
  );
};

export default AdminAnalytics;






// import React, { useState, useEffect } from 'react';
// import { Package, ShoppingCart, Activity, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';

// const ModernLeadWaveChart = ({ leadsData }) => {
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [animationStep, setAnimationStep] = useState(0);
//   const [monthlyLeadsData, setMonthlyLeadsData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch monthly leads data from API
//   useEffect(() => {
//     const fetchMonthlyData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("Please login to view analytics");

//         // Fetch monthly leads data from your API
//         const response = await fetch(`${API_BASE_URL}/api/analytics/leads/monthly`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           // If your API returns monthly data, use it directly
//           setMonthlyLeadsData(data.monthlyData || []);
//         } else {
//           // Fallback: If monthly API doesn't exist, create data from current totals
//           console.warn("Monthly API not available, using current totals");
//           setMonthlyLeadsData(createMonthlyFromTotals());
//         }
//       } catch (error) {
//         console.error("Failed to fetch monthly data:", error);
//         // Fallback to creating data from current totals
//         setMonthlyLeadsData(createMonthlyFromTotals());
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMonthlyData();
//   }, [leadsData]);

//   // Create monthly data from current API totals as fallback
//   const createMonthlyFromTotals = () => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const currentMonth = new Date().getMonth();
    
//     return months.map((month, index) => {
//       if (index === currentMonth) {
//         // Current month uses actual API data
//         return {
//           month,
//           total: leadsData.totalLeads,
//           qualified: leadsData.qualifiedLeads,
//           pending: leadsData.pendingLeads,
//           loss: leadsData.lossLeads
//         };
//       } else {
//         // Other months get proportional data (you can adjust this logic)
//         const monthMultiplier = index < currentMonth ? 0.85 : 0.75; // Past months slightly higher
//         return {
//           month,
//           total: Math.floor(leadsData.totalLeads * monthMultiplier * (0.8 + Math.random() * 0.4)),
//           qualified: Math.floor(leadsData.qualifiedLeads * monthMultiplier * (0.8 + Math.random() * 0.4)),
//           pending: Math.floor(leadsData.pendingLeads * monthMultiplier * (0.8 + Math.random() * 0.4)),
//           loss: Math.floor(leadsData.lossLeads * monthMultiplier * (0.8 + Math.random() * 0.4))
//         };
//       }
//     });
//   };

//   const monthlyData = monthlyLeadsData;
//   const maxValue = monthlyData.length > 0 ? Math.max(...monthlyData.map(m => m.total)) : leadsData.totalLeads;

//   // Animation effect
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (animationStep < 4) {
//         setAnimationStep(animationStep + 1);
//       }
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [animationStep]);

//   // Show loading state
//   if (isLoading || monthlyData.length === 0) {
//     return (
//       <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="animate-spin h-12 w-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"></div>
//           <p className="text-white text-lg">Loading lead data...</p>
//         </div>
//       </div>
//     );
//   }

//   const navigateMonth = (direction) => {
//     if (direction === 'prev') {
//       setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
//     } else {
//       setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
//     }
//   };

//   const currentMonthData = monthlyData[currentMonth];

//   return (
//     <div className="space-y-8">
//       {/* Modern Wave Visualization */}
//       <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl">
//         {/* Animated Background Waves */}
//         <div className="absolute inset-0">
//           <svg className="w-full h-full" viewBox="0 0 1200 500" preserveAspectRatio="none">
//             <defs>
//               <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
//                 <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
//                 <stop offset="100%" stopColor="#c084fc" stopOpacity="0.6" />
//               </linearGradient>
//               <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
//                 <stop offset="50%" stopColor="#0891b2" stopOpacity="0.3" />
//                 <stop offset="100%" stopColor="#0e7490" stopOpacity="0.5" />
//               </linearGradient>
//               <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
//                 <stop offset="50%" stopColor="#059669" stopOpacity="0.2" />
//                 <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
//               </linearGradient>
//               <linearGradient id="waveGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
//                 <stop offset="50%" stopColor="#d97706" stopOpacity="0.2" />
//                 <stop offset="100%" stopColor="#b45309" stopOpacity="0.4" />
//               </linearGradient>
//             </defs>
            
//             {/* Total Leads Wave */}
//             <path
//               d="M0,400 Q300,350 600,380 T1200,360 L1200,500 L0,500 Z"
//               fill="url(#waveGradient1)"
//               style={{
//                 animation: "wave1 6s ease-in-out infinite",
//                 transform: animationStep >= 1 ? 'translateY(0)' : 'translateY(100px)',
//                 transition: 'transform 1s ease-out'
//               }}
//             />
            
//             {/* Qualified Leads Wave */}
//             <path
//               d="M0,420 Q400,370 800,400 T1200,380 L1200,500 L0,500 Z"
//               fill="url(#waveGradient3)"
//               style={{
//                 animation: "wave2 5s ease-in-out infinite",
//                 transform: animationStep >= 2 ? 'translateY(0)' : 'translateY(100px)',
//                 transition: 'transform 1.2s ease-out'
//               }}
//             />
            
//             {/* Pending Leads Wave */}
//             <path
//               d="M0,440 Q350,390 700,420 T1200,400 L1200,500 L0,500 Z"
//               fill="url(#waveGradient4)"
//               style={{
//                 animation: "wave3 7s ease-in-out infinite",
//                 transform: animationStep >= 3 ? 'translateY(0)' : 'translateY(100px)',
//                 transition: 'transform 1.4s ease-out'
//               }}
//             />
            
//             {/* Loss Leads Wave */}
//             <path
//               d="M0,460 Q450,410 900,440 T1200,420 L1200,500 L0,500 Z"
//               fill="url(#waveGradient2)"
//               style={{
//                 animation: "wave4 4s ease-in-out infinite",
//                 transform: animationStep >= 4 ? 'translateY(0)' : 'translateY(100px)',
//                 transition: 'transform 1.6s ease-out'
//               }}
//             />
//           </svg>
//         </div>

//         {/* Floating Particles */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(20)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 3}s`,
//                 animationDuration: `${2 + Math.random() * 2}s`
//               }}
//             />
//           ))}
//         </div>

//         {/* Main Content */}
//         <div className="relative z-10 p-8 h-full">
//           {/* Header with Navigation */}
//           <div className="flex items-center justify-between mb-8">
//             <div className="text-left">
//               <h3 className="text-3xl font-bold text-white mb-2">
//                 Lead Distribution Analysis
//               </h3>
//               <p className="text-purple-200">
//                 Interactive monthly breakdown of lead performance
//               </p>
//             </div>
            
//             {/* Month Navigation */}
//             <div className="flex items-center gap-4 bg-black/20 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
//               <button
//                 onClick={() => navigateMonth('prev')}
//                 className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 text-white hover:scale-110"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
              
//               <div className="text-center min-w-[120px]">
//                 <div className="text-2xl font-bold text-white">
//                   {currentMonthData.month}
//                 </div>
//                 <div className="text-sm text-purple-200">
//                   2024
//                 </div>
//               </div>
              
//               <button
//                 onClick={() => navigateMonth('next')}
//                 className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 text-white hover:scale-110"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* Total Leads */}
//             <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-3 bg-purple-500/20 rounded-xl">
//                   <Package className="w-6 h-6 text-purple-300" />
//                 </div>
//                 <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
//               </div>
              
//               <div className="space-y-2">
//                 <div className="text-3xl font-bold text-white">
//                   {currentMonthData.total.toLocaleString()}
//                 </div>
//                 <div className="text-sm text-purple-200 font-medium">
//                   Total Leads
//                 </div>
                
//                 {/* Progress Wave */}
//                 <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden mt-3">
//                   <div 
//                     className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-2000 ease-out"
//                     style={{ 
//                       width: `${(currentMonthData.total / maxValue) * 100}%`,
//                       animation: "expandWidth 2s ease-out"
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Qualified Leads */}
//             <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:transform hover:scale-105">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-3 bg-emerald-500/20 rounded-xl">
//                   <ShoppingCart className="w-6 h-6 text-emerald-300" />
//                 </div>
//                 <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
//               </div>
              
//               <div className="space-y-2">
//                 <div className="text-3xl font-bold text-white">
//                   {currentMonthData.qualified.toLocaleString()}
//                 </div>
//                 <div className="text-sm text-emerald-200 font-medium">
//                   Qualified Leads
//                 </div>
                
//                 <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden mt-3">
//                   <div 
//                     className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-2000 ease-out"
//                     style={{ 
//                       width: `${(currentMonthData.qualified / maxValue) * 100}%`,
//                       animation: "expandWidth 2.2s ease-out"
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Pending Leads */}
//             <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 hover:transform hover:scale-105">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-3 bg-amber-500/20 rounded-xl">
//                   <Activity className="w-6 h-6 text-amber-300" />
//                 </div>
//                 <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
//               </div>
              
//               <div className="space-y-2">
//                 <div className="text-3xl font-bold text-white">
//                   {currentMonthData.pending.toLocaleString()}
//                 </div>
//                 <div className="text-sm text-amber-200 font-medium">
//                   Pending Leads
//                 </div>
                
//                 <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden mt-3">
//                   <div 
//                     className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-2000 ease-out"
//                     style={{ 
//                       width: `${(currentMonthData.pending / maxValue) * 100}%`,
//                       animation: "expandWidth 2.4s ease-out"
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Loss Leads */}
//             <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:transform hover:scale-105">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-3 bg-red-500/20 rounded-xl">
//                   <TrendingDown className="w-6 h-6 text-red-300" />
//                 </div>
//                 <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
//               </div>
              
//               <div className="space-y-2">
//                 <div className="text-3xl font-bold text-white">
//                   {currentMonthData.loss.toLocaleString()}
//                 </div>
//                 <div className="text-sm text-red-200 font-medium">
//                   Loss Leads
//                 </div>
                
//                 <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden mt-3">
//                   <div 
//                     className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-2000 ease-out"
//                     style={{ 
//                       width: `${(currentMonthData.loss / maxValue) * 100}%`,
//                       animation: "expandWidth 2.6s ease-out"
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Summary Stats */}
//           <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-white mb-1">
//                   {((currentMonthData.qualified / currentMonthData.total) * 100).toFixed(1)}%
//                 </div>
//                 <div className="text-sm text-gray-300">Qualification Rate</div>
//               </div>
//             </div>
            
//             <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-white mb-1">
//                   {((currentMonthData.loss / currentMonthData.total) * 100).toFixed(1)}%
//                 </div>
//                 <div className="text-sm text-gray-300">Loss Rate</div>
//               </div>
//             </div>
            
//             <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-white mb-1">
//                   {((currentMonthData.pending / currentMonthData.total) * 100).toFixed(1)}%
//                 </div>
//                 <div className="text-sm text-gray-300">Pending Rate</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Custom CSS for wave animations */}
//         <style jsx>{`
//           @keyframes wave1 {
//             0%, 100% { transform: translateX(0) translateY(0); }
//             25% { transform: translateX(-20px) translateY(-10px); }
//             50% { transform: translateX(15px) translateY(5px); }
//             75% { transform: translateX(-10px) translateY(-5px); }
//           }
          
//           @keyframes wave2 {
//             0%, 100% { transform: translateX(0) translateY(0); }
//             33% { transform: translateX(15px) translateY(-8px); }
//             66% { transform: translateX(-12px) translateY(6px); }
//           }
          
//           @keyframes wave3 {
//             0%, 100% { transform: translateX(0) translateY(0); }
//             40% { transform: translateX(-18px) translateY(-6px); }
//             80% { transform: translateX(10px) translateY(8px); }
//           }
          
//           @keyframes wave4 {
//             0%, 100% { transform: translateX(0) translateY(0); }
//             30% { transform: translateX(12px) translateY(-12px); }
//             60% { transform: translateX(-15px) translateY(4px); }
//           }
          
//           @keyframes expandWidth {
//             from { width: 0%; }
//             to { width: var(--target-width, 100%); }
//           }
//         `}</style>
//       </div>

//       {/* 12-Month Overview */}
//       <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 rounded-3xl p-6 border border-blue-200/50 dark:border-blue-700/50">
//         <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
//           12-Month Lead Overview
//         </h4>
        
//         <div className="grid grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 gap-3">
//           {monthlyData.map((month, index) => (
//             <div
//               key={month.month}
//               className={`relative p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
//                 index === currentMonth
//                   ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
//                   : 'bg-white/80 dark:bg-gray-700/80 hover:bg-blue-100 dark:hover:bg-blue-800/50'
//               }`}
//               onClick={() => setCurrentMonth(index)}
//             >
//               <div className="text-center">
//                 <div className="text-xs font-medium mb-1">{month.month}</div>
//                 <div className="text-sm font-bold">
//                   {(month.total / 1000).toFixed(1)}k
//                 </div>
                
//                 {/* Mini progress bars */}
//                 <div className="mt-2 space-y-1">
//                   <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
//                     <div 
//                       className="h-1 bg-emerald-500 rounded-full transition-all duration-1000"
//                       style={{ width: `${(month.qualified / month.total) * 100}%` }}
//                     />
//                   </div>
//                   <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
//                     <div 
//                       className="h-1 bg-red-500 rounded-full transition-all duration-1000"
//                       style={{ width: `${(month.loss / month.total) * 100}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         <div className="mt-4 flex justify-center gap-6 text-sm">
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
//             <span className="text-gray-600 dark:text-gray-400">Qualified Rate</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//             <span className="text-gray-600 dark:text-gray-400">Loss Rate</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Demo component with real API integration
// const App = () => {
//   const [leadsData, setLeadsData] = useState({
//     totalLeads: 0,
//     qualifiedLeads: 0,
//     pendingLeads: 0,
//     lossLeads: 0,
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch real data from your API
//   useEffect(() => {
//     const fetchLeadsData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.warn("No token found, using demo data");
//           // Use demo data if no token
//           setLeadsData({
//             totalLeads: 48750,
//             qualifiedLeads: 18500,
//             pendingLeads: 12200,
//             lossLeads: 8950
//           });
//           setIsLoading(false);
//           return;
//         }

//         // Replace with your actual API URL
//         const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
        
//         const response = await fetch(`${API_BASE_URL}/api/analytics/leads`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setLeadsData({
//             totalLeads: data.totalLeads || 0,
//             qualifiedLeads: data.qualifiedLeads || 0,
//             pendingLeads: data.pendingLeads || 0,
//             lossLeads: data.lossLeads || 0,
//           });
//         } else {
//           throw new Error("Failed to fetch leads data");
//         }
//       } catch (error) {
//         console.error("Error fetching leads data:", error);
//         // Use demo data as fallback
//         setLeadsData({
//           totalLeads: 48750,
//           qualifiedLeads: 18500,
//           pendingLeads: 12200,
//           lossLeads: 8950
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchLeadsData();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
//           <p className="text-gray-600 dark:text-gray-400 text-xl">Loading Analytics...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 p-6">
//       <div className="max-w-7xl mx-auto">
//         <ModernLeadWaveChart leadsData={leadsData} />
//       </div>
//     </div>
//   );
// };

// export default App;