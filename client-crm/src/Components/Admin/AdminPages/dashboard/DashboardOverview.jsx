import React from "react";
import { RefreshCw, TrendingUp } from "lucide-react";
import { cn } from "../../../../utils/cn";

// Loading skeleton component
const StatCardSkeleton = () => (
  <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
);

const DashboardOverview = ({ 
  stats, 
  loadingStates, 
  isRefreshing, 
  onRefresh 
}) => {
  return (
    <>
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Monitor your business performance and key metrics
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Stats Grid with Loading States */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingStates.stats ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          stats.map((stat, index) => (
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
                    <div className={cn(
                      "text-2xl font-bold transition-all duration-300",
                      "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r",
                      `group-hover:${stat.gradientText}`,
                      "text-gray-900 dark:text-white"
                    )}>
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
          ))
        )}
      </div>
    </>
  );
};

export default DashboardOverview;
