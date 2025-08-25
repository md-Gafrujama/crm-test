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
          icon: <Package className="h-6 w-6" />,
          change: "+5.2%",
          trend: "up",
          color: "from-blue-500 to-blue-600",
          lightColor: "bg-blue-50",
          textColor: "text-blue-600",
          subtitle: "This month"
        },
        {
          id: 2,
          title: "Qualified Leads",
          value: leadsData.qualifiedLeads.toLocaleString(),
          icon: <ShoppingCart className="h-6 w-6" />,
          change: "+12.3%",
          trend: "up",
          color: "from-emerald-500 to-emerald-600",
          lightColor: "bg-emerald-50",
          textColor: "text-emerald-600",
          subtitle: "Active pipeline"
        },
        {
          id: 3,
          title: "Pending Leads",
          value: leadsData.pendingLeads.toLocaleString(),
          icon: <Activity className="h-6 w-6" />,
          change: "+0.5%",
          trend: "up",
          color: "from-purple-500 to-purple-600",
          lightColor: "bg-purple-50",
          textColor: "text-purple-600",
          subtitle: "Awaiting follow-up"
        },
        {
          id: 4,
          title: "Loss Leads",
          value: leadsData.lossLeads.toLocaleString(),
          icon: <TrendingUp className="h-6 w-6" />,
          change: leadsData.lossLeads > 0 ? "-8.1%" : "0.0%",
          trend: leadsData.lossLeads > 0 ? "down" : "up",
          color: "from-orange-500 to-orange-600",
          lightColor: "bg-orange-50",
          textColor: "text-orange-600",
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
          title: "Total User",
          value: usersData.totalUser.toLocaleString(),
          icon: <User className="h-6 w-6" />,
          change: "+7.5%",
          trend: "up",
          color: "from-indigo-500 to-indigo-600",
          lightColor: "bg-indigo-50",
          textColor: "text-indigo-600",
          subtitle: "This year"
        },
        {
          id: 6,
          title: "Active User",
          value: usersData.activeUser.toLocaleString(),
          icon: <Users className="h-6 w-6" />,
          change: "+3.2%",
          trend: "up",
          color: "from-green-400 to-green-500",
          lightColor: "bg-green-50",
          textColor: "text-green-600",
          subtitle: "Last month"
        },
        {
          id: 7,
          title: "Conversation Rate",
          value: `${usersData.conversionRateFromActive.toFixed(1)}%`,
          icon: <MessageSquare className="h-6 w-6" />,
          change: "+1.1%",
          trend: "up",
          color: "from-pink-500 to-pink-600",
          lightColor: "bg-pink-50",
          textColor: "text-pink-600",
          subtitle: "Employee/Active ratio"
        },
        {
          id: 8,
          title: "Total Employee",
          value: usersData.totalEmployee.toLocaleString(),
          icon: <Users2 className="h-6 w-6" />,
          change: "+4.8%",
          trend: "up",
          color: "from-yellow-500 to-yellow-600",
          lightColor: "bg-yellow-50",
          textColor: "text-yellow-600",
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
          '#3B82F6', // Blue
          '#10B981', // Emerald
          '#8B5CF6', // Purple
          '#F97316', // Orange
        ],
        borderColor: [
          '#2563EB',
          '#059669',
          '#7C3AED',
          '#EA580C',
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // Doughnut Chart Data for User Analytics - ONLY 4 FIELDS
  const userDoughnutData = {
    labels: ['Total Users', 'Active Users', 'Conversation Rate', 'Total Employee'],
    datasets: [
      {
        label: 'User Analytics',
        data: [
          usersData.totalUser,                    // 3
          usersData.activeUser,                   // 3
          usersData.conversionRateFromActive,     // 133.3
          usersData.totalEmployee                 // 4
        ],
        backgroundColor: [
          '#6366F1', // Indigo for Total Users
          '#22C55E', // Green for Active Users  
          '#EC4899', // Pink for Conversation Rate
          '#EAB308', // Yellow for Total Employee
        ],
        borderColor: [
          '#4F46E5',
          '#16A34A',
          '#DB2777', 
          '#CA8A04',
        ],
        borderWidth: 2,
        cutout: '60%',
        hoverOffset: 10,
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
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
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
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    );
  }

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn(
          "transition-all duration-300 ease-in-out min-h-screen bg-slate-100 dark:bg-slate-900",
          collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
        )}>
          <div className="space-y-6 p-6">
{/* First 4 Stats Cards - Leads Data */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
  {stats.map((stat) => (
    <div
      key={stat.id}
      className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-0.5"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`${stat.lightColor} p-2 rounded-xl dark:${stat.lightColor.replace('bg-', 'bg-').replace('-50', '-900/30')}`}>
            <div className={`${stat.textColor} dark:${stat.textColor.replace('text-', 'text-').replace('-600', '-400')}`}>
              {stat.icon}
            </div>
          </div>
          
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
            stat.trend === "up"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            <TrendingUp className={`h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
            {stat.change}
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className={`w-2 h-2 rounded-full ${
            stat.trend === "up" ? "bg-emerald-500" : "bg-red-500"
          }`}></div>
          <div className={`text-xs font-medium ${
            stat.trend === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}>{stat.change}</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700">
        <div className={`h-full bg-gradient-to-r ${stat.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
      </div>
    </div>
  ))}
</div>


            {/* Chart for First 4 Cards - Pie Chart */}
            <div className=" dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Lead Distribution Analysis
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Breakdown of all leads by status and performance
                </p>
              </div>
              <div style={{ height: '400px' }}>
                <Pie data={leadsPieData} options={chartOptions} />
              </div>
            </div>

{/* Next 4 Stats Cards - Users Data */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
  {additionalStats.map(stat => (
    <div
      key={stat.id}
      className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-0.5"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`${stat.lightColor} p-2 rounded-xl dark:${stat.lightColor.replace('bg-', 'bg-').replace('-50', '-900/30')}`}>
            <div className={`${stat.textColor} dark:${stat.textColor.replace('text-', 'text-').replace('-600', '-400')}`}>{stat.icon}</div>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
            stat.trend === "up" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            <TrendingUp className={`h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
            {stat.change}
          </div>
        </div>
        <div className="space-y-2 mb-3">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className={`w-2 h-2 rounded-full ${
            stat.trend === "up" ? "bg-emerald-500" : "bg-red-500"
          }`}></div>
          <div className={`text-xs font-medium ${
            stat.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          }`}>{stat.change}</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700">
        <div className={`h-full bg-gradient-to-r ${stat.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
      </div>
    </div>
  ))}
</div>


            {/* Doughnut Chart for User Analytics - ONLY 4 FIELDS */}
            <div className=" dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  User Analytics Overview
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Distribution of Total Users, Active Users, Conversation Rate & Total Employee
                </p>
              </div>
              <div style={{ height: "400px" }}>
                <Doughnut data={userDoughnutData} options={chartOptions} />
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
