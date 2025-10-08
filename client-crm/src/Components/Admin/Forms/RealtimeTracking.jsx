import React, { useState, lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Activity, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  User, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Wifi,
  Battery
} from 'lucide-react';
const ReactToastifyCSS = lazy(() => import('react-toastify/dist/ReactToastify.css'));
import { API_BASE_URL } from '../../../config/api'; 
import { Header } from '../common/Header';
import { Sidebar,useSidebar } from '../common/sidebar';
import { useTheme } from '../../../hooks/use-theme';

const RealtimeTracking = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });
  
  // Additional state for enhanced features
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [activeTracking, setActiveTracking] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [trackingMode, setTrackingMode] = useState('basic'); // basic, advanced, stealth
  const [trackingDuration, setTrackingDuration] = useState('30'); // minutes
  const [notifications, setNotifications] = useState(true);
  const [dataExport, setDataExport] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [quickActions, setQuickActions] = useState([
    { id: 1, name: 'Location Tracking', icon: MapPin, active: true },
    { id: 2, name: 'Activity Monitor', icon: Activity, active: true },
    { id: 3, name: 'Network Analysis', icon: Wifi, active: false },
    { id: 4, name: 'Device Info', icon: Smartphone, active: true }
  ]);

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);



  const handlegobacktodashboard = () => {
    navigate('/dashboard');
  };
const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [collapsed, setCollapsed] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  // Ensure layout is stable on first render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLayoutReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const body = {
        phoneNumber: formData.phone,
      };

      const response = await axios.post(`${API_BASE_URL}/api/realtimetracking`, {
        body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      toast.success("Realtime Tracking done Successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme === 'dark' ? 'dark' : 'light',
      style: { fontSize: '1.2rem' }, // Increased font size
    });
    const userType = localStorage.getItem('userType'); 
   if (userType === 'user') {
   setTimeout(() => navigate("/userProfile"), 2000);
   window.location.reload();
  } else if (userType === 'admin') {
    setTimeout(() => navigate("/dashboard"), 2000);
  }     
    } catch (e) {
      console.error("Reailtime Tracking Failed - Full Error:", e);
      console.error("Error details:", {
        message: e.message,
        stack: e.stack,
      });
            toast.error(e.message || "Realtime Traking Failed, Please try again!", {
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
      setIsSubmitting(false);
    }
  };

  // Show loading state to prevent layout shift
  if (!isLayoutReady) {
    return (
      <>
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex">
          <div className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700"></div>
          <div className="flex-1 bg-slate-100 dark:bg-slate-900 min-h-screen pt-16">
            <div className="p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-1/2 mb-8"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      {/* <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onCollapsedChange={setCollapsed}> */}
        <div className="w-full h-full">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-orange-500"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Realtime Tracking
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Monitor user activity and location in real-time
                      </p>
                    </div>
                </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600"
                    >
                      <Filter className="h-4 w-4 mr-2 inline" />
                      Advanced
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Tracks</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                      </div>
                      <Activity className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Searches</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{recentSearches.length}</p>
                      </div>
                      <Search className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">98%</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">2.3s</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Tracking Form */}
                <div className="lg:col-span-2">
                  <Suspense fallback={
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded w-3/4 mb-6 mx-auto"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-1/2 mb-8 mx-auto"></div>
                      </div>
                    </div>
                  }>
                    <form
                      onSubmit={handleSubmit}
                      className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 transition-all hover:shadow-2xl"
                    >
                    {/* Form Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                          <Smartphone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Track Device
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enter phone number to start tracking
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${isSubmitting ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {isSubmitting ? 'Tracking...' : 'Ready'}
                        </span>
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="mb-6">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="+1 (123) 456-7890"
                          autoComplete="tel"
                          required
                        />
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Email Input (Optional) */}
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email Address (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="user@example.com"
                          autoComplete="email"
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Advanced Options */}
                    {showAdvancedOptions && (
                      <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Advanced Options
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Tracking Mode */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Tracking Mode
                            </label>
                            <select
                              value={trackingMode}
                              onChange={(e) => setTrackingMode(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                              <option value="basic">Basic Tracking</option>
                              <option value="advanced">Advanced Monitoring</option>
                              <option value="stealth">Stealth Mode</option>
                            </select>
                          </div>

                          {/* Duration */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Duration (minutes)
                            </label>
                            <select
                              value={trackingDuration}
                              onChange={(e) => setTrackingDuration(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                              <option value="15">15 minutes</option>
                              <option value="30">30 minutes</option>
                              <option value="60">1 hour</option>
                              <option value="180">3 hours</option>
                              <option value="720">12 hours</option>
                            </select>
                          </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="mt-4 space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notifications}
                              onChange={(e) => setNotifications(e.target.checked)}
                              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              Enable real-time notifications
                            </span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={dataExport}
                              onChange={(e) => setDataExport(e.target.checked)}
                              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              Export tracking data
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.phone}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                        isSubmitting || !formData.phone
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl active:scale-95 transform'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Tracking in Progress...</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          <span>Start Tracking</span>
                        </>
                      )}
                    </button>
                  </form>
                </Suspense>
              </div>

              {/* Sidebar with Quick Actions and History */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-orange-500" />
                    Quick Actions
                  </h3>
                  
                  <div className="space-y-3">
                    {quickActions.map((action) => (
                      <div
                        key={action.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                          action.active
                            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                            : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
                        }`}
                        onClick={() => {
                          setQuickActions(prev => 
                            prev.map(item => 
                              item.id === action.id ? { ...item, active: !item.active } : item
                            )
                          );
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <action.icon className={`h-4 w-4 ${action.active ? 'text-orange-600' : 'text-gray-500'}`} />
                          <span className={`text-sm font-medium ${action.active ? 'text-orange-900 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'}`}>
                            {action.name}
                          </span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${action.active ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    Recent Searches
                  </h3>
                  
                  {recentSearches.length > 0 ? (
                    <div className="space-y-2">
                      {recentSearches.slice(0, 5).map((search, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                          <button className="text-gray-400 hover:text-orange-500 transition-colors">
                            <RefreshCw className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No recent searches</p>
                    </div>
                  )}
                </div>

                {/* System Status */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-500" />
                    System Status
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Security</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-600 dark:text-green-400">Secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      {/* </Sidebar> */}
    </>
  );
};

export default React.memo(RealtimeTracking);
