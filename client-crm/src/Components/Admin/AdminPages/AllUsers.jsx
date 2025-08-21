import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EditUser from '../Forms/EditUser';
import axios from 'axios';
import { Header } from '../common/Header';
import { Sidebar, useSidebar } from '../common/sidebar';
import { cn } from "../../../utils/cn";
import { useTheme } from '../../../hooks/use-theme';
import Footer from '../common/Footer';
import Sign from '../Forms/sign';
import { API_BASE_URL } from "../../../config/api";
import { Search, Users, UserCheck, Filter, Shield, Activity, UserX } from 'lucide-react';

const AllUsers = ({collapsed}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Filter users by search term
  const filteredUsers = users.filter(user => 
    ['firstName', 'lastName', 'email', 'username', 'role'].some(field =>
      user[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Filter by role
  const filteredByRole = filteredUsers.filter(user => {
    if (roleFilter === 'All') return true;
    if (roleFilter === 'Active') return user.isActive !== false;
    if (roleFilter === 'Inactive') return user.isActive === false;
    return user.role?.toLowerCase() === roleFilter.toLowerCase();
  });

  // Count users and admins
  const totalCount = filteredByRole.length;
  const userCount = filteredByRole.filter(user => user.role?.toLowerCase() === 'user').length;
  const adminCount = filteredByRole.filter(user => user.role?.toLowerCase() === 'admin').length;
  const activeCount = filteredByRole.filter(user => user.isActive !== false).length;
  const inactiveCount = filteredByRole.filter(user => user.isActive === false).length;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view users');
        }

        const response = await axios.get(`${API_BASE_URL}/api/allUser`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Session expired. Please login again.');
        }

        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    handleCloseModal();
  };

  const handleUserDeleted = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn(
          "transition-[margin] duration-300 ease-in-out",
          collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
        )}>
          <div className="container mx-auto px-4 py-6">

{/* Header Section */}
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 max-w-7xl mx-auto gap-6">
  <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">
    Users Management
  </h1>
  
  {/* Controls Section */}
  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
    {/* Search Input */}
    <div className="relative w-full sm:w-80">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
      />
    </div>
    
    {/* Role Filter Dropdown */}
    <div className="relative w-full sm:w-44">
      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="w-full pl-10 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none bg-white cursor-pointer"
      >
        <option value="All">All Users</option>
        <option value="User">Users Only</option>
        <option value="Admin">Admins Only</option>
        <option value="Active">Active Only</option>
        <option value="Inactive">Inactive Only</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    
    {/* Add User Button */}
    <button
      onClick={() => setShowAddUserForm(true)}
      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#ff8633] text-white rounded-lg transition-all duration-200 hover:bg-[#e57328] hover:shadow-md whitespace-nowrap text-sm font-medium"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 616 6H2a6 6 0 016-6z" />
      </svg>
      Add User
    </button>
  </div>
</div>

            {/* Stats Cards - Added more cards with proper counts */}
            <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Total Users */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
                  </div>
                </div>
              </div>
              
              {/* Admins */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminCount}</p>
                  </div>
                </div>
              </div>
              
              {/* Users */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <UserCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userCount}</p>
                  </div>
                </div>
              </div>

              {/* Active Users - Green */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
                  </div>
                </div>
              </div>

              {/* Inactive Users - Red */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{inactiveCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Cards Grid */}
            {filteredByRole.length === 0 ? (
              <div className="max-w-7xl mx-auto text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  {searchTerm ? 'No users match your search criteria.' : 'No users found.'}
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Try adjusting your search or filter options.
                </p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredByRole.map((user) => (
                  <div key={user.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div className="relative">
                      {/* Circular Profile Image */}
                      <div className="flex justify-center pt-4">
                        <img
                          src={user.photo || 'https://randomuser.me/api/portraits/men/1.jpg'}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-sm"
                          onError={(e) => {
                            e.target.src = 'https://randomuser.me/api/portraits/men/1.jpg';
                          }}
                        />
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleEditUser(user.id)}
                          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                          aria-label="Edit user"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Status Badge - Green for Active, Red for Inactive */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                          user.isActive !== false
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            user.isActive !== false ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Role Badge */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role?.toLowerCase() === 'admin' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 pt-2">
                      <div className="mb-2 text-center">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
                      </div>

                      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <span className="truncate">{user.email}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {user.assignedWork && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-slate-700 rounded-md">
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Task:</span> {user.assignedWork}
                          </p>
                        </div>
                      )}

                      {user.statusOfWork && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                              {user.statusOfWork}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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
        <Sign 
          isOpen={showAddUserForm} 
          onClose={() => setShowAddUserForm(false)}
        />
      </Sidebar>
      <Footer/>
    </>
  );
};

export default AllUsers;
