import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from '../common/Footer';
import { Header } from '../common/Header';
import { Sidebar, useSidebar } from '../common/sidebar';
import { cn } from '../../../utils/cn';
import { API_BASE_URL } from "../../../config/api";
import { Package, ShoppingCart, Activity, TrendingUp } from 'lucide-react';
import { User, Users, MessageSquare, Users2 } from 'lucide-react';

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
} from 'chart.js';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';

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
    lossLeads: 0
  });

  // State for users data
  const [usersData, setUsersData] = useState({
    totalUser: 0,
    activeUser: 0,
    totalEmployee: 0,
    conversionRateFromActive: 0,
    conversionRateFromTotal: 0
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
        const userResponse = await axios.get(`${API_BASE_URL}/api/analytics/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch leads analytics
        const leadsResponse = await axios.get(`${API_BASE_URL}/api/analytics/leads`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.data) {
          setUsersData({
            totalUser: userResponse.data.totalUser || 0,
            activeUser: userResponse.data.activeUser || 0,
            totalEmployee: userResponse.data.totalEmployee || 0,
            conversionRateFromActive: userResponse.data.conversionRateFromActive || 0,
            conversionRateFromTotal: userResponse.data.conversionRateFromTotal || 0
          });
        }

        if (leadsResponse.data) {
          setLeadsData({
            totalLeads: leadsResponse.data.totalLeads || 0,
            qualifiedLeads: leadsResponse.data.qualifiedLeads || 0,
            pendingLeads: leadsResponse.data.pendingLeads || 0,
            lossLeads: leadsResponse.data.lossLeads || 0
          });
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
        setIsLoading(false);
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
          icon: <Package className="h-5 w-5" />,
          change: "+5.2%",
          trend: "up",
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          trendColor: "text-blue-700",
          subtitle: "This month"
        },
        {
          id: 2,
          title: "Qualified Leads",
          value: leadsData.qualifiedLeads.toLocaleString(),
          icon: <ShoppingCart className="h-5 w-5" />,
          change: "+12.3%",
          trend: "up",
          color: "from-emerald-500 to-emerald-600",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600",
          trendColor: "text-emerald-700",
          subtitle: "Active pipeline"
        },
        {
          id: 3,
          title: "Pending Leads",
          value: leadsData.pendingLeads.toLocaleString(),
          icon: <Activity className="h-5 w-5" />,
          change: "+0.5%",
          trend: "up",
          color: "from-purple-500 to-purple-600",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
          trendColor: "text-purple-700",
          subtitle: "Awaiting follow-up"
        },
        {
          id: 4,
          title: "Loss Leads",
          value: leadsData.lossLeads.toLocaleString(),
          icon: <TrendingUp className="h-5 w-5" />,
          change: leadsData.lossLeads > 0 ? "-8.1%" : "0.0%",
          trend: leadsData.lossLeads > 0 ? "down" : "up",
          color: "from-orange-500 to-orange-600",
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600",
          trendColor: "text-orange-700",
          subtitle: "Lost opportunities"
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
          icon: <User className="h-5 w-5" />,
          change: "+7.5%",
          trend: "up",
          color: "from-indigo-500 to-indigo-600",
          bgColor: "bg-indigo-50",
          iconColor: "text-indigo-600",
          trendColor: "text-indigo-700",
          subtitle: "This year"
        },
        {
          id: 6,
          title: "Active Users",
          value: usersData.activeUser.toLocaleString(),
          icon: <Users className="h-5 w-5" />,
          change: "+3.2%",
          trend: "up",
          color: "from-green-400 to-green-500",
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          trendColor: "text-green-700",
          subtitle: "Last month"
        },
        {
          id: 7,
          title: "Conversation Rate",
          value: `${usersData.conversionRateFromActive.toFixed(1)}%`,
          icon: <MessageSquare className="h-5 w-5" />,
          change: "+1.1%",
          trend: "up",
          color: "from-pink-500 to-pink-600",
          bgColor: "bg-pink-50",
          iconColor: "text-pink-600",
          trendColor: "text-pink-700",
          subtitle: "Employee/Active ratio"
        },
        {
          id: 8,
          title: "Employees",
          value: usersData.totalEmployee.toLocaleString(),
          icon: <Users2 className="h-5 w-5" />,
          change: "+4.8%",
          trend: "up",
          color: "from-yellow-500 to-yellow-600",
          bgColor: "bg-yellow-50",
          iconColor: "text-yellow-600",
          trendColor: "text-yellow-700",
          subtitle: "This quarter"
        }
      ]);
    }
  }, [usersData]);

  // Pie Chart Data for Lead Distribution (using real data)
  const leadsPieData = {
    labels: ['Total Leads', 'Qualified Leads', 'Pending Leads', 'Lost Leads'],
    datasets: [
      {
        label: 'Lead Distribution',
        data: [
          leadsData.totalLeads,
          leadsData.qualifiedLeads,
          leadsData.pendingLeads,
          leadsData.lossLeads
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(16, 185, 129, 0.8)', // Emerald
          'rgba(139, 92, 246, 0.8)', // Purple
          'rgba(249, 115, 22, 0.8)', // Orange
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)',
          'rgb(249, 115, 22)',
        ],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  // Doughnut Chart Data for User Analytics
  const userDoughnutData = {
    labels: ['Total Users', 'Active Users', 'Conversation Rate', 'Total Employee'],
    datasets: [
      {
        label: 'User Analytics',
        data: [
          usersData.totalUser,
          usersData.activeUser,
          usersData.conversionRateFromActive,
          usersData.totalEmployee
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)', // Indigo
          'rgba(34, 197, 94, 0.8)', // Green  
          'rgba(236, 72, 153, 0.8)', // Pink
          'rgba(234, 179, 8, 0.8)', // Yellow
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(34, 197, 94)',
          'rgb(236, 72, 153)', 
          'rgb(234, 179, 8)',
        ],
        borderWidth: 3,
        cutout: '65%',
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          font: {
            size: 11,
            weight: '500'
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(75, 85, 99, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            
            // Format conversation rate as percentage
            if (label.includes('Conversation Rate')) {
              return `${label}: ${value.toFixed(1)}%`;
            }
            
            // Format other values as regular numbers
            return `${label}: ${value}`;
          }
        }
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  const StatCard = ({ stat }) => (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-[1.02]">
      {/* Gradient background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative p-4">
        {/* Header with icon and trend */}
        <div className="flex items-center justify-between mb-3">
          <div className={`${stat.bgColor} dark:bg-gray-700 p-2.5 rounded-lg transition-all duration-300 group-hover:scale-110`}>
            <div className={`${stat.iconColor} dark:text-gray-300`}>
              {stat.icon}
            </div>
          </div>
          
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            stat.trend === "up"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            <TrendingUp className={`h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
            {stat.change}
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {stat.value}
          </h3>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {stat.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {stat.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-700">
        <div className={`h-full bg-gradient-to-r ${stat.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out`}></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#ff8633] border-t-transparent absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading analytics...</p>
      </div>
    );
  }

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn(
          "transition-all duration-300 ease-in-out min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
          collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
        )}>
          {/* Main content container */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Header section */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your leads and user analytics performance
              </p>
            </div>

            {/* Leads Analytics Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Lead Analytics
                </h2>
              </div>
              
              {/* Leads Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat) => (
                  <StatCard key={stat.id} stat={stat} />
                ))}
              </div>

              {/* Leads Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Lead Distribution
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visual breakdown of all leads by status
                  </p>
                </div>
                <div className="h-80 lg:h-96">
                  <Pie data={leadsPieData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* User Analytics Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-blue-600 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  User Analytics
                </h2>
              </div>
              
              {/* User Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {additionalStats.map((stat) => (
                  <StatCard key={stat.id} stat={stat} />
                ))}
              </div>

              {/* User Analytics Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    User Analytics Overview
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Distribution of users, active users, conversion rate & employees
                  </p>
                </div>
                <div className="h-80 lg:h-96">
                  <Doughnut data={userDoughnutData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
      <Footer />
    </>
  );
};

export default AdminAnalytics;