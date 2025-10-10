import React from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Eye, ChevronRight, Clock, Zap } from "lucide-react";
import { cn } from "../../../../utils/cn";

// Loading skeleton component
const ActivityCardSkeleton = () => (
  <div className="flex flex-col gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      <div className="flex-1 space-y-1">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
    <div className="h-3 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
    <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
  </div>
);

const RecentActivities = ({ 
  recentActivities, 
  loadingStates, 
  getActivityStatusColor 
}) => {
  const navigate = useNavigate();

  return (
    <div className="">
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activities
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Latest updates across your system
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/all-activities")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Eye className="h-4 w-4" />
            View All
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {loadingStates.activities ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <ActivityCardSkeleton key={i} />)}
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Activity className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">No recent activities</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Activities will appear here as they happen</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="group flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-blue-200 dark:hover:border-gray-500 hover:shadow-md hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {activity.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {activity.user}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {activity.action}
                </p>
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105",
                    getActivityStatusColor(activity.status)
                  )}>
                    {activity.status}
                  </span>
                  <Zap className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
