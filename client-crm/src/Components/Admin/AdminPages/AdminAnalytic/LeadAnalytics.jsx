import React, { useState, useEffect } from "react";
import { Package, ShoppingCart, Activity, TrendingUp } from "lucide-react";
import { Bar } from "react-chartjs-2";

const LeadAnalytics = ({ leadsData }) => {
  // State for lead stats cards
  const [stats, setStats] = useState([]);
  

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

  return (
    <>
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
    </>
  );
};

export default LeadAnalytics;
