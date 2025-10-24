import React, { useState, useEffect } from "react";
import { User, Users, MessageSquare, Users2, TrendingUp } from "lucide-react";
import { Bar } from "react-chartjs-2";

const UserAnalytics = ({ usersData }) => {
  const [additionalStats, setAdditionalStats] = useState([]);

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
    </>
  );
};

export default UserAnalytics;
