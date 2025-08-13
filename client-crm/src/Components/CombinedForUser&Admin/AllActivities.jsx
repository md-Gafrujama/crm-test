import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";
import { cn } from "../../utils/cn";
import { useTheme } from "../../hooks/use-theme";
import { 
  Activity, 
  ArrowLeft, 
  Filter, 
  Search, 
  User, 
  ShoppingCart, 
  Settings, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Trash2
} from "lucide-react";

const AllActivities = ({ collapsed }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [expandedActivityId, setExpandedActivityId] = useState(null);

  // Sample activities data (replace with API call if you have backend for activities)
  const sampleActivities = [
    {
      id: 1,
      type: "order",
      user: "John Smith",
      action: "placed a new order",
      time: "2 mins ago",
      status: "pending",
      avatar: "JS",
      details: "Order #12345 for $299.99",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      description: "Customer placed a new order for electronic items including headphones and charging cables."
    },
    {
      id: 2,
      type: "user",
      user: "Sarah Johnson",
      action: "registered new account",
      time: "15 mins ago",
      status: "completed",
      avatar: "SJ",
      details: "New user registration from mobile app",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      description: "New user successfully registered through the mobile application with email verification completed."
    },
    {
      id: 3,
      type: "system",
      user: "System",
      action: "completed nightly backup",
      time: "1 hour ago",
      status: "completed",
      avatar: "SY",
      details: "Database backup completed successfully",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      description: "Automated nightly backup process completed successfully. All data backed up to secure cloud storage."
    },
    {
      id: 4,
      type: "alert",
      user: "System",
      action: "high memory usage detected",
      time: "3 hours ago",
      status: "warning",
      avatar: "AL",
      details: "Memory usage at 85% - consider optimization",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      description: "System monitoring detected high memory usage. Performance optimization may be required."
    },
    {
      id: 5,
      type: "order",
      user: "Mike Wilson",
      action: "updated order details",
      time: "4 hours ago",
      status: "completed",
      avatar: "MW",
      details: "Changed delivery address for order #12344",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      description: "Customer updated delivery address and contact information for existing order."
    },
    {
      id: 6,
      type: "user",
      user: "Emma Davis",
      action: "uploaded profile picture",
      time: "5 hours ago",
      status: "completed",
      avatar: "ED",
      details: "Profile picture updated successfully",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      description: "User successfully uploaded and updated their profile picture through the settings page."
    },
    {
      id: 7,
      type: "system",
      user: "System",
      action: "database optimization completed",
      time: "6 hours ago",
      status: "completed",
      avatar: "SY",
      details: "Performance optimization completed",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      description: "Scheduled database optimization and indexing process completed successfully."
    },
    {
      id: 8,
      type: "alert",
      user: "System",
      action: "disk space warning threshold reached",
      time: "8 hours ago",
      status: "warning",
      avatar: "AL",
      details: "Disk space at 90% capacity",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      description: "Server disk space has reached 90% capacity. Consider cleanup or expansion."
    },
    {
      id: 9,
      type: "order",
      user: "Alex Chen",
      action: "cancelled order #12345",
      time: "10 hours ago",
      status: "cancelled",
      avatar: "AC",
      details: "Order cancelled by customer request",
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
      description: "Customer cancelled order due to change in requirements. Refund processed automatically."
    },
    {
      id: 10,
      type: "user",
      user: "Lisa Brown",
      action: "changed password",
      time: "12 hours ago",
      status: "completed",
      avatar: "LB",
      details: "Password updated for security",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      description: "User successfully updated their account password through the security settings."
    }
  ];

  useEffect(() => {
    // Simulate API call - replace with actual API call if needed
    const fetchActivities = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Sort activities by timestamp (newest first)
        const sortedActivities = sampleActivities.sort((a, b) => b.timestamp - a.timestamp);
        setActivities(sortedActivities);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Failed to load activities", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme === 'dark' ? 'dark' : 'light',
          style: { fontSize: '1.2rem' },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [theme]);

  // Filter activities based on search and filters
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || activity.status === filterStatus;
    const matchesType = filterType === "all" || activity.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleExpand = (id) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "warning":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5" />;
      case "user":
        return <User className="h-5 w-5" />;
      case "system":
        return <Settings className="h-5 w-5" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "order":
        return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300";
      case "user":
        return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300";
      case "system":
        return "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300";
      case "alert":
        return "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300";
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} mins ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "transition-[margin] duration-300 ease-in-out min-h-screen dark:bg-gray-900",
      collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
    )}>
      <main className="p-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">All Activities</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Monitor all system and user activities in real-time
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff8633] focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff8633] focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="warning">Warning</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-4 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff8633] focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="order">Orders</option>
                  <option value="user">Users</option>
                  <option value="system">System</option>
                  <option value="alert">Alerts</option>
                </select>
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Showing {filteredActivities.length} of {activities.length} activities
          </p>
        </div>

        {/* Activities List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-[#ff8633]" />
              Recent Activities ({filteredActivities.length})
            </h2>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-1">
                No activities found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div 
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleExpand(activity.id)}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-4 ${getTypeColor(activity.type)}`}>
                        {getTypeIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                            {activity.avatar}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-200">
                              {activity.user}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {activity.action}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-11">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            {formatTime(activity.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {expandedActivityId === activity.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {expandedActivityId === activity.id && (
                    <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-800/50">
                      <div className="ml-11 space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Details
                          </h4>
                          <p className="text-gray-800 dark:text-gray-200">
                            {activity.details}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Description
                          </h4>
                          <p className="text-gray-800 dark:text-gray-200">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Activity ID: #{activity.id}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Type: {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllActivities;
