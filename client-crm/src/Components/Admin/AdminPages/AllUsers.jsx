import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  Users, 
  UserCheck, 
  Filter, 
  Shield, 
  Activity, 
  UserX, 
  Plus,
  Edit3,
  Mail,
  Calendar,
  Eye,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import EditUser from '../Forms/EditUser';
import { Header } from '../common/Header';
import { Sidebar, useSidebar } from '../common/sidebar';
import { cn } from "../../../utils/cn";
import Footer from '../common/Footer';
import Sign from '../Forms/sign';
import { API_BASE_URL } from "../../../config/api";

const OptimizedUserDashboard = ({ collapsed }) => {
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [viewAll, setViewAll] = useState(false);

  // Helper function to determine if user is active based on API data
  const isUserActive = useCallback((user) => {
    // Check various possible field names that might indicate active status
    if (user.hasOwnProperty('isActive')) {
      return user.isActive === true;
    }
    if (user.hasOwnProperty('active')) {
      return user.active === true;
    }
    if (user.hasOwnProperty('status')) {
      return user.status === 'active' || user.status === 'Active' || user.status === true;
    }
    if (user.hasOwnProperty('userStatus')) {
      return user.userStatus === 'active' || user.userStatus === 'Active';
    }
    if (user.hasOwnProperty('accountStatus')) {
      return user.accountStatus === 'active' || user.accountStatus === 'Active';
    }
    
    // If user has assigned work, consider them active by default
    if (user.assignedWork && user.assignedWork.trim() !== '') {
      return true;
    }
    
    // Default to false if no clear indication of active status
    return false;
  }, []);

  // API functions - optimized with error handling
  const fetchAllUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to view users');
      }

      const response = await axios.get(`${API_BASE_URL}/api/allUser`, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 10000 // 10 second timeout
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Session expired. Please login again.');
      }

      // Handle different response structures
      const data = response.data;
      
      // Check if data is directly an array
      if (Array.isArray(data)) {
        return data;
      }
      
      // Check common response structures
      if (data.users && Array.isArray(data.users)) {
        return data.users;
      }
      
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      if (data.result && Array.isArray(data.result)) {
        return data.result;
      }
      
      // If none of the above, try to find any array property
      const possibleArrays = Object.values(data).filter(value => Array.isArray(value));
      if (possibleArrays.length > 0) {
        return possibleArrays[0];
      }
      
      // Log the actual response structure for debugging
      console.log('API Response structure:', data);
      
      // Return empty array if no valid structure found
      return [];
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      console.error('Fetch users error:', error);
      throw error;
    }
  }, []);

  const fetchActiveUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to view users');
      }

      const response = await axios.get(`${API_BASE_URL}/api/allUser/active`, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 10000
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Session expired. Please login again.');
      }

      // Handle different response structures
      const data = response.data;
      
      // Check if data is directly an array
      if (Array.isArray(data)) {
        return data;
      }
      
      // Check common response structures
      if (data.users && Array.isArray(data.users)) {
        return data.users;
      }
      
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      if (data.result && Array.isArray(data.result)) {
        return data.result;
      }
      
      // If none of the above, try to find any array property
      const possibleArrays = Object.values(data).filter(value => Array.isArray(value));
      if (possibleArrays.length > 0) {
        return possibleArrays[0];
      }
      
      console.log('Active Users API Response:', data);
      return [];
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      console.error('Fetch active users error:', error);
      throw error;
    }
  }, []);

  const fetchInactiveUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to view users');
      }

      const response = await axios.get(`${API_BASE_URL}/api/allUser/inactive`, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 10000
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Session expired. Please login again.');
      }

      // Handle different response structures
      const data = response.data;
      
      // Check if data is directly an array
      if (Array.isArray(data)) {
        return data;
      }
      
      // Check common response structures
      if (data.users && Array.isArray(data.users)) {
        return data.users;
      }
      
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      if (data.result && Array.isArray(data.result)) {
        return data.result;
      }
      
      // If none of the above, try to find any array property
      const possibleArrays = Object.values(data).filter(value => Array.isArray(value));
      if (possibleArrays.length > 0) {
        return possibleArrays[0];
      }
      
      console.log('Inactive Users API Response:', data);
      return [];
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      console.error('Fetch inactive users error:', error);
      throw error;
    }
  }, []);

  // Main fetch function with loading state
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await fetchAllUsers();
      console.log('Fetched users:', allUsers); // Debug log
      
      // Ensure we always set an array
      if (Array.isArray(allUsers)) {
        setUsers(allUsers);
      } else {
        console.warn('API did not return an array:', allUsers);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error in fetchUsers:', err);
      setError(err.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAllUsers]);

  // Specialized fetch functions
  const getActiveUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const activeUsers = await fetchActiveUsers();
      console.log('Fetched active users:', activeUsers); // Debug log
      
      if (Array.isArray(activeUsers)) {
        setUsers(activeUsers);
        setRoleFilter('Active');
      } else {
        console.warn('Active users API did not return an array:', activeUsers);
        setUsers([]);
        setRoleFilter('Active');
      }
    } catch (err) {
      console.error('Error in getActiveUsers:', err);
      setError(err.message || 'Failed to fetch active users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [fetchActiveUsers]);

  const getInactiveUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const inactiveUsers = await fetchInactiveUsers();
      console.log('Fetched inactive users:', inactiveUsers); // Debug log
      
      if (Array.isArray(inactiveUsers)) {
        setUsers(inactiveUsers);
        setRoleFilter('Inactive');
      } else {
        console.warn('Inactive users API did not return an array:', inactiveUsers);
        setUsers([]);
        setRoleFilter('Inactive');
      }
    } catch (err) {
      console.error('Error in getInactiveUsers:', err);
      setError(err.message || 'Failed to fetch inactive users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [fetchInactiveUsers]);

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Memoized filtered users for better performance
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    
    let filtered = users;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user =>
        ['firstName', 'lastName', 'email', 'username', 'role'].some(field =>
          user[field]?.toString().toLowerCase().includes(searchLower)
        )
      );
    }

    // Role/Status filter - Using API data properly
    if (roleFilter !== 'All') {
      switch (roleFilter) {
        case 'Active':
          filtered = filtered.filter(user => isUserActive(user));
          break;
        case 'Inactive':
          filtered = filtered.filter(user => !isUserActive(user));
          break;
        case 'User':
          filtered = filtered.filter(user => 
            user.role?.toLowerCase() === 'user'
          );
          break;
        case 'Admin':
          filtered = filtered.filter(user => 
            user.role?.toLowerCase() === 'admin'
          );
          break;
        default:
          filtered = filtered.filter(user => 
            user.role?.toLowerCase() === roleFilter.toLowerCase()
          );
      }
    }

    return filtered;
  }, [users, searchTerm, roleFilter, isUserActive]);

  // Memoized statistics - Using API data properly
  const stats = useMemo(() => {
    const allUsers = Array.isArray(users) ? users : [];
    
    return {
      total: allUsers.length,
      users: allUsers.filter(user => user.role?.toLowerCase() === 'user').length,
      admins: allUsers.filter(user => user.role?.toLowerCase() === 'admin').length,
      active: allUsers.filter(user => isUserActive(user)).length,
      inactive: allUsers.filter(user => !isUserActive(user)).length
    };
  }, [users, isUserActive]);

  // Event handlers
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleRoleFilterChange = useCallback((value) => {
    setRoleFilter(value);
    // Reset search when changing filters
    if (value !== 'All' && searchTerm) {
      setSearchTerm('');
    }
  }, [searchTerm]);

  const handleEditUser = useCallback((userId) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
  }, []);

  const handleUserAdded = useCallback(() => {
    fetchUsers();
    setShowAddUserForm(false);
  }, [fetchUsers]);

  const handleUserUpdated = useCallback((updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
    handleCloseModal();
  }, [handleCloseModal]);

  const handleUserDeleted = useCallback((userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    handleCloseModal();
  }, [handleCloseModal]);

  // Display users (limit to 4 unless viewAll is true)
  const displayUsers = useMemo(() => 
    viewAll ? filteredUsers : filteredUsers.slice(0, 4),
    [filteredUsers, viewAll]
  );

  // Components
  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className={`text-3xl font-bold transition-colors duration-200 ${color}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl transition-all duration-200 group-hover:scale-110 ${bgColor}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const UserCard = ({ user }) => (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-blue-200 dark:hover:border-blue-600">
      <div className="relative">
        {/* Header with gradient */}
        <div className="h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
        
        {/* Profile Image */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <img
              src={user.photo || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=fff&size=80`}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg transition-transform duration-200 group-hover:scale-110"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=fff&size=80`;
              }}
            />
            {/* Status indicator - Using API data */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center ${
              isUserActive(user) ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <div className={`w-2 h-2 rounded-full bg-white`}></div>
            </div>
          </div>
        </div>
        
        {/* Edit button */}
        <button
          onClick={() => handleEditUser(user.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
          aria-label="Edit user"
        >
          <Edit3 className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="pt-12 pb-6 px-6">
        {/* Role Badge */}
        <div className="flex justify-center mb-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${
            user.role?.toLowerCase() === 'admin' 
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {user.role?.toLowerCase() === 'admin' ? (
              <Shield className="h-3 w-3" />
            ) : (
              <UserCheck className="h-3 w-3" />
            )}
            {user.role}
          </span>
        </div>

        {/* User Info */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            @{user.username}
          </p>
          
          {/* Status Badge - Using API data */}
          <div className="flex justify-center">
            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
              isUserActive(user)
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              <Activity className="h-3 w-3" />
              {isUserActive(user) ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Mail className="h-4 w-4 flex-shrink-0 text-blue-500" />
            <span className="truncate">{user.email}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 flex-shrink-0 text-green-500" />
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Work Info */}
        {user.assignedWork && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Task
            </p>
            <p className="text-sm text-gray-900 dark:text-white">
              {user.assignedWork}
            </p>
            {user.statusOfWork && (
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${
                  user.statusOfWork.toLowerCase().includes('progress') ? 'bg-yellow-500' :
                  user.statusOfWork.toLowerCase().includes('completed') ? 'bg-green-500' :
                  'bg-gray-400'
                }`}></div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {user.statusOfWork}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <>
        <Header onToggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
          <div className={cn(
            "transition-[margin] duration-300 ease-in-out",
            collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
          )}>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
              </div>
            </div>
          </div>
        </Sidebar>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header onToggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
          <div className={cn(
            "transition-[margin] duration-300 ease-in-out",
            collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
          )}>
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error loading users</p>
                    <p className="text-sm mt-1">{error}</p>
                    <button 
                      onClick={fetchUsers}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Sidebar>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn(
          "transition-[margin] duration-300 ease-in-out min-h-screen",
          collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
        )}>
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  User Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your team members and their permissions
                </p>
              </div>
              
              {/* Controls Section */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-blue-300"
                  />
                </div>
                
                {/* Role Filter Dropdown */}
                <div className="relative w-full sm:w-48">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={roleFilter}
                    onChange={(e) => handleRoleFilterChange(e.target.value)}
                    className="w-full pl-11 pr-8 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none bg-white cursor-pointer transition-all duration-200 hover:border-blue-300"
                  >
                    <option value="All">All Users</option>
                    <option value="User">Users Only</option>
                    <option value="Admin">Admins Only</option>
                    <option value="Active">Active Only</option>
                    <option value="Inactive">Inactive Only</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                
                {/* Add User Button */}
                <button
                  onClick={() => setShowAddUserForm(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </button>
              </div>
            </div>

            {/* Stats Cards - Now using proper API-based counting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard 
                icon={Users} 
                title="Total Users" 
                value={stats.total} 
                color="text-blue-600 dark:text-blue-400"
                bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatCard 
                icon={Shield} 
                title="Admins" 
                value={stats.admins} 
                color="text-purple-600 dark:text-purple-400"
                bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <StatCard 
                icon={UserCheck} 
                title="Users" 
                value={stats.users} 
                color="text-indigo-600 dark:text-indigo-400"
                bgColor="bg-gradient-to-br from-indigo-500 to-indigo-600"
              />
              <StatCard 
                icon={Activity} 
                title="Active" 
                value={stats.active} 
                color="text-green-600 dark:text-green-400"
                bgColor="bg-gradient-to-br from-green-500 to-green-600"
              />
              <StatCard 
                icon={UserX} 
                title="Inactive" 
                value={stats.inactive} 
                color="text-red-600 dark:text-red-400"
                bgColor="bg-gradient-to-br from-red-500 to-red-600"
              />
            </div>

            {/* User Cards Grid */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  {searchTerm || roleFilter !== 'All' ? 'No users match your criteria' : 'No users found'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm || roleFilter !== 'All' 
                    ? 'Try adjusting your search or filter options.'
                    : 'Get started by adding your first user.'
                  }
                </p>
                {(!searchTerm && roleFilter === 'All') && (
                  <button
                    onClick={() => setShowAddUserForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First User
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {displayUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>

                {/* View All Button */}
                {!viewAll && filteredUsers.length > 4 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-600 dark:text-gray-400">
                        Showing 4 of {filteredUsers.length} users
                        <span className="text-blue-600 dark:text-blue-400 font-medium ml-1">
                          ({filteredUsers.length - 4} more)
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setViewAll(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 hover:shadow-md text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          View All
                        </button>
                        <button
                          onClick={() => navigate('/view-all-users')}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
                        >
                          Full Page View
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {viewAll && filteredUsers.length > 4 && (
                  <div className="text-center">
                    <button
                      onClick={() => setViewAll(false)}
                      className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm font-medium"
                    >
                      Show Less
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && selectedUserId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <EditUser 
                userId={selectedUserId} 
                onUpdate={handleUserUpdated}
                onDelete={handleUserDeleted}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserForm && (
          <Sign 
            isOpen={showAddUserForm} 
            onClose={() => setShowAddUserForm(false)}
            onUserAdded={handleUserAdded}
          />
        )}
      </Sidebar>
      <Footer />
    </>
  );
};

export default OptimizedUserDashboard;