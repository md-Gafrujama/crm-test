import React, { useState } from "react";
import { TrendingUp, Target, Award, Clock, AlertCircle } from "lucide-react";
import { Header } from "../common/Header";
import { Sidebar, useSidebar } from "../common/sidebar";
import { cn } from "../../../utils/cn";
import Footer from "../common/Footer";

const Dashboard = ({ collapsed }) => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  // Static data for the four cards
  const stats = [
    {
      id: 'totalLeads',
      title: "Total Leads",
      value: "152",
      change: "+12%",
      trend: "up",
      icon: Target,
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
      subtitle: "This month"
    },
    {
      id: 'qualifiedLeads',
      title: "Qualified Leads",
      value: "89",
      change: "+8%",
      trend: "up",
      icon: Award,
      color: "from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
      subtitle: "Active pipeline"
    },
    {
      id: 'pendingLeads',
      title: "Pending Leads",
      value: "48",
      change: "+15%",
      trend: "up",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      lightColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
      subtitle: "Awaiting follow-up"
    },
    {
      id: 'lossLeads',
      title: "Lost Leads",
      value: "22",
      change: "-3%",
      trend: "down",
      icon: AlertCircle,
      color: "from-red-500 to-red-600",
      lightColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
      subtitle: "Lost opportunities"
    }
  ];

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn("", collapsed ? "md:ml-[70px]" : "md:ml-[0px]")}>
          <main className="p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Monitor your business performance and key metrics
                </p>
              </div>
            </div>

            {/* Four Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.id}
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-all duration-300`} />
                  
                  <div className="relative p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.lightColor} group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                      </div>
                      
                      <div className={cn(
                        "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 group-hover:scale-105",
                        stat.trend === "up" 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        <TrendingUp className={cn("h-3 w-3", stat.trend === "down" && "rotate-180")} />
                        {stat.change}
                      </div>
                    </div>

                    {/* Value and Title */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {stat.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {stat.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700 rounded-b-xl">
                      <div className={cn(
                        "h-full bg-gradient-to-r rounded-b-xl transition-all duration-500 transform origin-left",
                        stat.color,
                        "scale-x-0 group-hover:scale-x-100"
                      )} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </Sidebar>
      <Footer />
    </>
  );
};

export default Dashboard;

