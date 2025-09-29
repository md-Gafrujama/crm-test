import React, { useState, useEffect } from "react";
import { UserHeader } from "../common/UserHeader";
import { UserSidebar, useSidebarUser } from "../common/UserSidebar";
import { UserFooter } from "../common/UserFooter";
import { Calendar, Clock, Bell, Plus, ArrowRight, TrendingUp, TrendingDown, BarChart3, Users, Target, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useTheme } from "../../../hooks/use-theme";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { useNavigate } from "react-router-dom";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserAnalytics = ({ onLogout }) => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
  const [leadsData, setLeadsData] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    pendingLeads: 0,
    lossLeads: 0
  });
  const [leadsLoading, setLeadsLoading] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Your existing useEffect hooks...
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

  const calculateChange = (current, previous = 0) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

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

  // Updated Bar Chart with clean modern styling
  const LeadsBarChart = () => {
    const data = {
      labels: ['Total Leads', 'Qualified Leads', 'Pending Leads', 'Lost Leads'],
      datasets: [
        {
          label: 'Number of Leads',
          data: [leadsData.totalLeads, leadsData.qualifiedLeads, leadsData.pendingLeads, leadsData.lossLeads],
          backgroundColor: [
            '#8B5CF6', // Purple for Total Leads
            '#10B981', // Green for Qualified Leads
            '#F59E0B', // Amber for Pending Leads
            '#EF4444', // Red for Lost Leads
          ],
          borderColor: [
            '#8B5CF6',
            '#10B981',
            '#F59E0B',
            '#EF4444',
          ],
          borderWidth: 0,
          borderRadius: 0,
          maxBarThickness: 60,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
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
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
              weight: "500",
            },
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
          border: {
            display: true,
            color: "#D1D5DB",
            width: 1,
          },
          ticks: {
            font: {
              size: 11,
              weight: "400",
            },
            color: "#6B7280",
            padding: 10,
            stepSize: 1,
          },
        },
      },
      elements: {
        bar: {
          borderRadius: 4,
          borderSkipped: false,
        },
      },
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      },
    };

    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Leads Distribution Analysis
            </h3>
           
          </div>
        
        </div>
        <div style={{ height: "450px" }} className="relative">
          {leadsLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ff8633] border-t-transparent mx-auto mb-4"></div>
                <p className="text-[#ff8633] font-semibold">Loading chart data...</p>
              </div>
            </div>
          ) : (
            <Bar data={data} options={options} />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <UserHeader onToggleSidebar={toggleSidebar} />
      <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className="">
          <div className="flex-1 overflow-auto">
            <main className="p-6">
              {/* Enhanced Stats Cards with #ff8633 theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                      className={`${scheme.bg} ${scheme.border} rounded-2xl p-6 shadow-lg ${scheme.shadow} hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden border backdrop-blur-sm ${leadsLoading ? 'opacity-75' : ''}`}
                    >
                      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#ff8633]/5 blur-2xl"></div>
                      <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-[#ff8633]/10"></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${scheme.iconBg} rounded-xl flex items-center justify-center border border-[#ff8633]/20`}>
                            <IconComponent className="w-6 h-6 text-[#ff8633]" />
                          </div>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            stat.trend === "up" 
                              ? 'text-white bg-[#ff8633] shadow-md' 
                              : 'text-[#ff8633] bg-gray-100 dark:bg-gray-700 border border-[#ff8633]/30'
                          }`}>
                            {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {stat.change}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-[#ff8633] dark:text-[#ff8633] text-sm font-semibold uppercase tracking-wider">
                            {stat.title}
                          </h3>
                          <div className="mb-2">
                            {leadsLoading ? (
                              <div className="animate-pulse bg-[#ff8633]/20 rounded-lg h-10 w-20"></div>
                            ) : (
                              <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {stat.value}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                            {stat.description}
                          </p>
                        </div>
                        
                        <div className="mt-4 w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${scheme.gradient} transition-all duration-1000 ease-out shadow-sm`}
                            style={{ 
                              width: stat.trend === "up" ? '75%' : '45%'
                            }}
                          />
                        </div>
                      </div>
                      
                      {leadsLoading && (
                        <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <div className="animate-spin rounded-full h-8 w-8 border-3 border-[#ff8633] border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bar Chart Section with #ff8633 theme */}
              <div className="mb-8">
                <LeadsBarChart />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {/* Additional content can go here */}
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
