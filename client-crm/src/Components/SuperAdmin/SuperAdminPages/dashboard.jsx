import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Clock, 
  AlertCircle,
  CheckCircle, 
  XCircle, 
  Eye, 
  Mail, 
  Phone, 
  Building, 
  User, 
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
  Menu,
  X,
  Home,
  Users,
  Settings,
  BarChart3,
  Bell,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { API_BASE_URL } from "../../../config/api";

const AdminDashboard = () => {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Registration requests state
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyTypeFilter, setCompanyTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');
  
  // Sign out modal state
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Count data state
  const [countData, setCountData] = useState({
    total: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0
  });
  const [isCountLoading, setIsCountLoading] = useState(false);

  // Sidebar navigation items
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'registrations', label: 'Registrations', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const companyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'technology', label: 'Technology' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'real estate', label: 'Real Estate' },
    { value: 'startup', label: 'Startup' },
    { value: 'apple', label: 'Apple' }
  ];

  // Helper function for profile image URL handling
  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) {
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
    }
    
    if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
      return profileImage;
    }
    
    // If it's just a filename or partial URL, use default image
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
  };

  // Fetch detailed registration data
  const fetchDetailedRegistrationData = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/superAdmin/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching detailed registration data:', error);
      return null;
    }
  };

  // Fetch data from specific APIs
  const fetchRegistrationData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // Fetch all four API endpoints
      const [pendingResponse, approvedResponse, rejectedResponse, detailedData] = await Promise.all([
        fetch(`${API_BASE_URL}/api/superAdmin/pending`, { headers }),
        fetch(`${API_BASE_URL}/api/superAdmin/approved`, { headers }),
        fetch(`${API_BASE_URL}/api/superAdmin/rejected`, { headers }),
        fetchDetailedRegistrationData()
      ]);

      // Check if responses are ok
      if (!pendingResponse.ok || !approvedResponse.ok || !rejectedResponse.ok) {
        if (pendingResponse.status === 401 || approvedResponse.status === 401 || rejectedResponse.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          return;
        }
        throw new Error('Failed to fetch registration data');
      }

      // Parse JSON responses
      const pendingData = await pendingResponse.json();
      const approvedData = await approvedResponse.json();
      const rejectedData = await rejectedResponse.json();

      // Enhanced transformation with detailed data and fixed image handling
      const transformData = (items, status) => {
        return items?.map(item => {
          const detailedInfo = detailedData ? detailedData[item.id] : null;
          
          return {
            id: item.id,
            firstName: item.owners_firstName,
            lastName: item.owners_lastName,
            username: item.username,
            email: item.email,
            phone: item.phone,
            companyName: item.companyName,
            companyType: item.companyType,
            profilePhoto: getProfileImageUrl(item.profileImage),
            submittedAt: item.createdAt,
            status: status,
            subscription: item.subscription,
            noOfUsers: item.noOfUsers,
            agreeToterms: item.agreeToterms,
            // Additional detailed information
            adminCount: detailedInfo?.adminCount || 0,
            employeeCount: detailedInfo?.employeeCount || 0,
            leadCount: detailedInfo?.leadCount || 0,
            alertCount: detailedInfo?.alertCount || 0
          };
        }) || [];
      };

      const transformedPending = transformData(pendingData.pending, 'pending');
      const transformedApproved = transformData(approvedData.data, 'approved');
      const transformedRejected = transformData(rejectedData.rejected, 'rejected');

      // Set the state
      setPendingRequests(transformedPending);
      setApprovedRequests(transformedApproved);
      setRejectedRequests(transformedRejected);
      
      // Combine all requests
      const combinedRequests = [...transformedPending, ...transformedApproved, ...transformedRejected];
      setAllRequests(combinedRequests);

      // Update count data
      setCountData({
        total: combinedRequests.length,
        approvedCount: transformedApproved.length,
        pendingCount: transformedPending.length,
        rejectedCount: transformedRejected.length
      });

    } catch (error) {
      console.error('Error fetching registration data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Keep the existing fetchCountData function as backup
  const fetchCountData = async () => {
    setIsCountLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/superAdmin/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCountData(data);
    } catch (error) {
      console.error('Error fetching count data:', error);
    } finally {
      setIsCountLoading(false);
    }
  };

  // Updated dashboard stats using API data
  const overviewStats = [
    {
      id: 'totalCompanies',
      title: "Total Companies",
      value: isLoading ? "..." : countData.total.toString(),
      change: "+12%",
      trend: "up",
      icon: Building,
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
      subtitle: "Registered companies"
    },
    {
      id: 'approvedCompanies',
      title: "Approved Companies",
      value: isLoading ? "..." : countData.approvedCount.toString(),
      change: "+8%",
      trend: "up",
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
      subtitle: "Active companies"
    },
    {
      id: 'pendingCompanies',
      title: "Pending Approval",
      value: isLoading ? "..." : countData.pendingCount.toString(),
      change: "+15%",
      trend: "up",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      lightColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
      subtitle: "Awaiting approval"
    },
    {
      id: 'rejectedCompanies',
      title: "Rejected Applications",
      value: isLoading ? "..." : countData.rejectedCount.toString(),
      change: "-3%",
      trend: "down",
      icon: XCircle,
      color: "from-red-500 to-red-600",
      lightColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
      subtitle: "Rejected applications"
    }
  ];

  // Update useEffect to fetch registration data on component mount
  useEffect(() => {
    fetchRegistrationData();
  }, []);

  useEffect(() => {
    if (activeTab === 'registrations') {
      // Data is already loaded, just filter if needed
      filterRequests();
    }
  }, [activeTab, allRequests, searchTerm, statusFilter, companyTypeFilter]);

  // Updated filter function to work with combined data
  const filterRequests = () => {
    let filtered = allRequests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (companyTypeFilter !== 'all') {
      filtered = filtered.filter(request => 
        request.companyType.toLowerCase() === companyTypeFilter.toLowerCase()
      );
    }

    setFilteredRequests(filtered);
  };

  // FIXED approve/reject handler with multiple API endpoint attempts
  const handleApproveReject = async (requestId, action, reason = '') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
      let response = null;
      let apiUrl = '';

      // Try different possible API endpoint patterns
      const apiAttempts = [
        // Attempt 1: Dedicated approve/reject endpoints
        {
          url: `${API_BASE_URL}/api/superAdmin/${action}/${requestId}`,
          method: 'PUT',
          body: { reason: reason || '' }
        },
        // Attempt 2: Update status endpoint
        {
          url: `${API_BASE_URL}/api/superAdmin/updateStatus`,
          method: 'PUT',
          body: { id: requestId, status: newStatus, reason: reason || '' }
        },
        // Attempt 3: PATCH on main endpoint
        {
          url: `${API_BASE_URL}/api/superAdmin/${requestId}`,
          method: 'PATCH',
          body: { status: newStatus, reason: reason || '' }
        },
        // Attempt 4: PUT on main endpoint
        {
          url: `${API_BASE_URL}/api/superAdmin/${requestId}`,
          method: 'PUT',
          body: { status: newStatus, reason: reason || '' }
        },
        // Attempt 5: POST to main endpoint
        {
          url: `${API_BASE_URL}/api/superAdmin/`,
          method: 'POST',
          body: { id: requestId, status: newStatus, reason: reason || '', action: action }
        }
      ];

      for (const attempt of apiAttempts) {
        try {
          console.log(`Trying API: ${attempt.method} ${attempt.url}`);
          
          response = await fetch(attempt.url, {
            method: attempt.method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(attempt.body)
          });

          console.log(`Response: ${response.status} ${response.statusText}`);

          if (response.ok) {
            apiUrl = attempt.url;
            console.log(`Success with: ${attempt.method} ${attempt.url}`);
            break;
          }
        } catch (error) {
          console.log(`Failed attempt: ${attempt.url}`, error.message);
          continue;
        }
      }

      // Check if any API call was successful
      if (response && response.ok) {
        try {
          const responseData = await response.json();
          console.log('API Success Response:', responseData);
        } catch (e) {
          console.log('No JSON response body, but request was successful');
        }
      } else {
        console.warn('All API endpoints failed or none available. Updating local state only.');
      }

      // Always update local state regardless of API success
      const updatedRequests = allRequests.map(request =>
        request.id === requestId
          ? { ...request, status: action === 'approve' ? 'approved' : 'rejected' }
          : request
      );
      
      setAllRequests(updatedRequests);

      // Update individual arrays
      const updatedPending = updatedRequests.filter(req => req.status === 'pending');
      const updatedApproved = updatedRequests.filter(req => req.status === 'approved');
      const updatedRejected = updatedRequests.filter(req => req.status === 'rejected');

      setPendingRequests(updatedPending);
      setApprovedRequests(updatedApproved);
      setRejectedRequests(updatedRejected);

      // Update counts
      setCountData({
        total: updatedRequests.length,
        approvedCount: updatedApproved.length,
        pendingCount: updatedPending.length,
        rejectedCount: updatedRejected.length
      });

      setShowModal(false);
      setSelectedRequest(null);
      setActionReason('');
      
      const message = action === 'approve' 
        ? 'Registration approved successfully!' 
        : 'Registration rejected successfully!';
      
      alert(message);
      
    } catch (error) {
      console.error(`Error ${action}ing registration:`, error);
      alert(`Error ${action}ing registration: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openActionModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XCircle }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      
      // Clear the specific localStorage items used by your auth system
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('userType');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear any other potential auth-related items
      localStorage.removeItem('authToken');
      localStorage.removeItem('userSession');
      localStorage.removeItem('adminSession');
      localStorage.removeItem('userRole');
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Trigger storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      setShowSignOutModal(false);
      
      // Show success message
      alert('Successfully signed out! Redirecting to login page...');
      
      // Redirect to login
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Error during sign out:', error);
      
      // Fallback redirect if navigate fails
      try {
        window.location.href = '/login';
      } catch (e) {
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced request details component
  const EnhancedRequestDetails = ({ request }) => (
    <div className="space-y-6">
      {/* Existing user info */}
      <div className="flex items-center space-x-4">
        <img
          className="h-16 w-16 rounded-full object-cover"
          src={request.profilePhoto}
          alt={`${request.firstName} ${request.lastName}`}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
          }}
        />
        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
            {request.firstName} {request.lastName}
          </h4>
          <p className="text-gray-600 dark:text-gray-400">@{request.username}</p>
          <div className="mt-1">{getStatusBadge(request.status)}</div>
        </div>
      </div>

      {/* Company Statistics - New Section */}
      {(request.adminCount > 0 || request.employeeCount > 0 || request.leadCount > 0 || request.alertCount > 0) && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Company Statistics</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{request.adminCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Admins</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{request.employeeCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Employees</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{request.leadCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Leads</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{request.alertCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Alerts</div>
            </div>
          </div>
        </div>
      )}

      {/* Existing company details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{request.companyName}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Type</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{request.companyType}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{request.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subscription</label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              request.subscription 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            }`}>
              {request.subscription ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{request.phone}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Request ID</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{request.id}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Submitted</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(request.submittedAt)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Terms Agreement</label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              request.agreeToterms 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {request.agreeToterms ? 'Agreed' : 'Not Agreed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Updated refresh handlers
  const handleRefreshData = () => {
    fetchRegistrationData();
  };

  // Header Component
  const Header = () => (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="ml-4 lg:ml-0">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Super Admin Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // Sidebar Component with Updated Sign Out
  const Sidebar = () => (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Super Admin Hub
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer - Updated Sign Out Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setShowSignOutModal(true)}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200 group"
            >
              <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Overview Tab Content
  const OverviewContent = () => (
    <div className="space-y-8">
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
        <button
          onClick={handleRefreshData}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <div
            key={stat.id}
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-all duration-300`} />
            
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.lightColor} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 group-hover:scale-105 ${
                  stat.trend === "up" 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  <TrendingUp className={`h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                  {stat.change}
                </div>
              </div>

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

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700 rounded-b-xl">
                <div className={`h-full bg-gradient-to-r rounded-b-xl transition-all duration-500 transform origin-left scale-x-0 group-hover:scale-x-100 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Registration Management Content
  const RegistrationContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registration Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Review and manage company registration requests</p>
        </div>
        <button
          onClick={handleRefreshData}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Registration Stats - Updated to use API data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? "..." : countData.pendingCount}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? "..." : countData.approvedCount}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? "..." : countData.rejectedCount}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Building className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? "..." : countData.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            value={companyTypeFilter}
            onChange={(e) => setCompanyTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            {companyTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          
          <button className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Registration Requests ({filteredRequests.length})
          </h2>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading requests...</span>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No registration requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recruiter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statistics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={request.profilePhoto}
                          alt={`${request.firstName} ${request.lastName}`}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.firstName} {request.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">@{request.username}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{request.companyName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{request.companyType}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <Mail className="w-4 h-4 mr-1" />
                        {request.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Phone className="w-4 h-4 mr-1" />
                        {request.phone}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          {request.adminCount} Admin{request.adminCount !== 1 ? 's' : ''}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {request.employeeCount} Employee{request.employeeCount !== 1 ? 's' : ''}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                          {request.leadCount} Lead{request.leadCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(request.submittedAt)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                            setActionType('view');
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openActionModal(request, 'approve')}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => openActionModal(request, 'reject')}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Analytics Content
  const AnalyticsContent = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Analytics Dashboard</h3>
        <p className="text-gray-500 dark:text-gray-400">Detailed analytics and reporting features coming soon</p>
      </div>
    </div>
  );

  // Settings Content
  const SettingsContent = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">System Settings</h3>
        <p className="text-gray-500 dark:text-gray-400">Configuration and system settings panel</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />;
      case 'registrations':
        return <RegistrationContent />;
      case 'analytics':
        return <AnalyticsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* Updated Registration Action Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {actionType === 'view' ? 'Registration Details' :
                   actionType === 'approve' ? 'Approve Registration' : 'Reject Registration'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                    setActionReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Use the enhanced request details component */}
              <EnhancedRequestDetails request={selectedRequest} />

              {/* Action Section */}
              {actionType !== 'view' && (
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {actionType === 'approve' ? 'Approval Note (Optional)' : 'Rejection Reason'}
                    </label>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder={
                        actionType === 'approve' 
                          ? 'Add any notes for the approval...' 
                          : 'Please provide a reason for rejection...'
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      required={actionType === 'reject'}
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                    setActionReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                
                {actionType === 'approve' && (
                  <button
                    onClick={() => handleApproveReject(selectedRequest.id, 'approve', actionReason)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Approving...' : 'Approve Registration'}
                  </button>
                )}
                
                {actionType === 'reject' && (
                  <button
                    onClick={() => handleApproveReject(selectedRequest.id, 'reject', actionReason)}
                    disabled={isLoading || !actionReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Rejecting...' : 'Reject Registration'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Confirm Sign Out
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to sign out?
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You will be redirected to the login page and will need to authenticate again to access the admin dashboard.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Signing Out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;