import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Plus, 
  ArrowRight, 
  Bell, 
  Clock, 
  ChevronRight, 
  Zap 
} from "lucide-react";
import { cn } from "../../../../utils/cn";

// Loading skeleton component
const AlertCardSkeleton = () => (
  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg mb-3"></div>
    <div className="space-y-2">
      <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  </div>
);

const QuickActions = ({ 
  alerts, 
  loadingStates, 
  quickActions, 
  onAddAlertReminder 
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Alerts & Reminders */}
      <div className="">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Alerts & Reminders
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Stay on top of important tasks
                </p>
              </div>
            </div>
            <button
              onClick={onAddAlertReminder}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              Add New
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {loadingStates.alerts ? (
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <AlertCardSkeleton key={i} />)}
            </div>
          ) : alerts.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alerts.slice(0, 4).map((alert, index) => {
                  const colors = [
                    { 
                      bg: 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/30 dark:hover:from-blue-800/30 dark:hover:to-blue-700/40', 
                      iconBg: 'bg-blue-500',
                      iconColor: 'text-white'
                    },
                    { 
                      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/30 dark:hover:from-emerald-800/30 dark:hover:to-emerald-700/40',
                      iconBg: 'bg-emerald-500',
                      iconColor: 'text-white'
                    },
                    { 
                      bg: 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 dark:from-purple-900/20 dark:to-purple-800/30 dark:hover:from-purple-800/30 dark:hover:to-purple-700/40',
                      iconBg: 'bg-purple-500',
                      iconColor: 'text-white'
                    },
                    { 
                      bg: 'bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 dark:from-orange-900/20 dark:to-orange-800/30 dark:hover:from-orange-800/30 dark:hover:to-orange-700/40',
                      iconBg: 'bg-orange-500',
                      iconColor: 'text-white'
                    }
                  ];
                  const colorScheme = colors[index % 4];
                  
                  return (
                    <div
                      key={alert.id}
                      className={`group p-4 ${colorScheme.bg} rounded-xl transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-white/20`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-12 h-12 ${colorScheme.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Bell className={`h-6 w-6 ${colorScheme.iconColor}`} />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {alert.topic}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                            <Calendar className="h-3 w-3" />
                            {new Date(alert.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                            <Clock className="h-3 w-3" />
                            {alert.time}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {alert.remainder}
                        </p>
                      </div>
                      
                      {/* Hover effect indicator */}
                      <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {alerts.length > 4 && (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    +{alerts.length - 4} more alerts
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Calendar className="h-10 w-10 text-purple-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">No alerts yet</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Create your first alert or reminder</p>
              <button
                onClick={onAddAlertReminder}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
              >
                Create Alert
              </button>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => navigate("/all-alerts-reminders")}
            className="w-full flex items-center justify-center gap-2 text-xl font-medium text-purple-600 hover:text-purple-700 dark:text-purple-500 dark:hover:text-purple-600 transition-colors py-1"
          >
            View All Alerts
            <ArrowRight className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="">
        <div className="">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fast access to key features
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={action.title}
                onClick={action.onClick}
                className={cn(
                  "group p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left",
                  action.color === 'blue' && "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/30",
                  action.color === 'emerald' && "bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/30",
                  action.color === 'purple' && "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 dark:from-purple-900/20 dark:to-purple-800/30",
                  action.color === 'orange' && "bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 dark:from-orange-900/20 dark:to-orange-800/30"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300",
                  action.color === 'blue' && "bg-blue-500",
                  action.color === 'emerald' && "bg-emerald-500",
                  action.color === 'purple' && "bg-purple-500",
                  action.color === 'orange' && "bg-orange-500"
                )}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {action.description}
                  </p>
                </div>
                
                {/* Hover indicator */}
                <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
