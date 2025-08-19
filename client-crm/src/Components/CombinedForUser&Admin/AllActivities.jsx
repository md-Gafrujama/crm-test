import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";
import { cn } from "../../utils/cn";
import { useTheme } from "../../hooks/use-theme";
import { ArrowLeft, Search, Filter, Activity, Users } from 'lucide-react';
import { 
  User, 
  ShoppingCart, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Clock 
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get authentication token
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please login to view activities");
        }
        
        const url = API_BASE_URL + "/api/recent";
        const result = await axios.get(url, {
          headers: { 
            Authorization: "Bearer " + token 
          }
        });
        
        const allActivities = [];
        
        // Process Users
        if (result.data.userData && Array.isArray(result.data.userData)) {
          result.data.userData.forEach(user => {
            const firstName = user.firstName || "";
            const lastName = user.lastName || "";
            const avatar = firstName.charAt(0) + lastName.charAt(0);
            
            allActivities.push({
              id: user.id,
              type: "user",
              user: firstName + " " + lastName,
              action: "User Registered",
              details: "Username: " + user.username + ", Email: " + user.email,
              status: user.locked ? "locked" : "completed",
              avatar: avatar.toUpperCase(),
              timestamp: new Date(user.createdAt),
              description: user.about || "User with role: " + user.role
            });
          });
        }
        
        // Process Employees
        if (result.data.lastCreatedEmployee && Array.isArray(result.data.lastCreatedEmployee)) {
          result.data.lastCreatedEmployee.forEach(emp => {
            const firstName = emp.firstName || "";
            const lastName = emp.lastName || "";
            const avatar = firstName.charAt(0) + lastName.charAt(0);
            
            allActivities.push({
              id: emp.id,
              type: "employee", 
              user: firstName + " " + lastName,
              action: "Employee Added",
              details: "Department: " + emp.department + ", Joined: " + new Date(emp.joiningDate).toLocaleDateString(),
              status: emp.status || "active",
              avatar: avatar.toUpperCase(),
              timestamp: new Date(emp.createdAt),
              description: "Role: " + emp.role + ", Email: " + emp.email
            });
          });
        }
        
        // Process Leads
        if (result.data.leads && Array.isArray(result.data.leads)) {
          result.data.leads.forEach(lead => {
            const firstName = lead.customerFirstName || "";
            const lastName = lead.customerLastName || "";
            const avatar = firstName.charAt(0) + lastName.charAt(0);
            
            allActivities.push({
              id: lead.id,
              type: "lead",
              user: firstName + " " + lastName,
              action: "Lead Created", 
              details: "Job Title: " + lead.jobTitle + ", Status: " + lead.status,
              status: lead.status || "pending",
              avatar: avatar.toUpperCase(),
              timestamp: new Date(lead.createdAt),
              description: lead.notes || "Lead from " + lead.companyName
            });
          });
        }
        
        // Sort by timestamp (newest first)
        allActivities.sort((a, b) => b.timestamp - a.timestamp);
        setActivities(allActivities);
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to load activities";
        setError(errorMessage);
        
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          theme: theme === "dark" ? "dark" : "light"
        });
        
        // Handle authentication error
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [theme, navigate]);

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const searchText = searchTerm.toLowerCase();
    const matchSearch = 
      activity.user.toLowerCase().includes(searchText) ||
      activity.action.toLowerCase().includes(searchText) ||
      activity.details.toLowerCase().includes(searchText);
    
    const matchStatus = filterStatus === "all" || activity.status === filterStatus;
    const matchType = filterType === "all" || activity.type === filterType;
    
    return matchSearch && matchStatus && matchType;
  });

  const toggleExpand = (id) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };

  const getStatusColor = (status) => {
    if (status === "pending") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    } else if (status === "completed") {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    } else if (status === "warning") {
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    } else if (status === "cancelled") {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    } else if (status === "locked") {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    } else if (status === "active") {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    } else if (status === "Contacted" || status === "Engaged") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    } else {
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type) => {
    if (type === "user") {
      return React.createElement(User, { className: "h-5 w-5" });
    } else if (type === "employee") {
      return React.createElement(Settings, { className: "h-5 w-5" });
    } else if (type === "lead") {
      return React.createElement(ShoppingCart, { className: "h-5 w-5" });
    } else {
      return React.createElement(Activity, { className: "h-5 w-5" });
    }
  };

  const getTypeColor = (type) => {
    if (type === "user") {
      return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300";
    } else if (type === "employee") {
      return "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300";
    } else if (type === "lead") {
      return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300";
    } else {
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
      return minutes + " mins ago";
    } else if (hours < 24) {
      return hours + " hours ago";
    } else {
      return days + " days ago";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const containerClass = "transition-[margin] duration-300 ease-in-out min-h-screen dark:bg-gray-900";
  const marginClass = collapsed ? "md:ml-[70px]" : "md:ml-[0px]";
  const finalContainerClass = cn(containerClass, marginClass);

  return (
    <div className={finalContainerClass}>
      <main className="p-6">
{/* Page Header */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
  <div>
    <div className="flex items-center gap-4 mb-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-semibold px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>
    </div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
      All Activities
    </h1>
    <p className="text-gray-600 dark:text-gray-400 mt-2">
      Monitor all system and user activities in real-time
    </p>
  </div>
</div>

{/* Search and Filters */}
<div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 border border-gray-200 dark:border-gray-700">
  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
      <Search className="h-5 w-5 text-orange-500" />
      Search & Filter Activities
    </h2>
  </div>
  
  <div className="p-6">
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search activities, users, or actions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      {/* Filter Controls */}
      <div className="flex gap-4">
        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2.5 border border-gray-200 font-semibold dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="warning">Warning</option>
            <option value="cancelled">Cancelled</option>
            <option value="locked">Locked</option>
            <option value="active">Active</option>
            <option value="Contacted">Contacted</option>
            <option value="Engaged">Engaged</option>
          </select>
        </div>
        
        {/* Type Filter */}
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 font-semibold py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent min-w-[120px]"
          >
            <option value="all">All Types</option>
            <option value="user">Users</option>
            <option value="employee">Employees</option>
            <option value="lead">Leads</option>
          </select>
        </div>
        
        {/* Clear Filters Button */}
        {(searchTerm || filterStatus !== 'all' || filterType !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterType('all');
            }}
            className="px-4 py-2.5 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors font-medium whitespace-nowrap"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
    
    {/* Results Summary */}
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-orange-500">{filteredActivities.length}</span>
          <span>of</span>
          <span className="font-medium">{activities.length}</span>
          <span>activities found</span>
        </div>
        
        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {activities.filter(a => a.status === 'completed' || a.status === 'active').length} Active
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {activities.filter(a => a.status === 'pending').length} Pending
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {activities.filter(a => a.status === 'warning' || a.status === 'locked').length} Issues
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Activities List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-orange-500" />
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
              {filteredActivities.map((activity) => {
                const statusClass = getStatusColor(activity.status);
                const typeClass = getTypeColor(activity.type);
                const isExpanded = expandedActivityId === activity.id;
                
                return (
                  <div key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div 
                      className="p-4 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleExpand(activity.id)}
                    >
                      <div className="flex items-center">
                        <div className={"p-2 rounded-full mr-4 " + typeClass}>
                          {getTypeIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                              {activity.avatar || "?"}
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
                            <span className={"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium " + statusClass}>
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
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
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
                          {activity.description && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Description
                              </h4>
                              <p className="text-gray-800 dark:text-gray-200">
                                {activity.description}
                              </p>
                            </div>
                          )}
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
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllActivities;
