import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api'; 
import { Header } from '../Admin/common/Header';
import { Sidebar, useSidebar } from '../Admin/common/sidebar';
import { cn } from "../../utils/cn";
import Footer from '../Admin/common/Footer';
import { toast } from 'react-toastify';
import { useTheme } from '../../hooks/use-theme';
import { ArrowLeft, Users, Lock } from 'lucide-react';

const AllLockedUsers = ({collapsed}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view users');
        }

        const response = await axios.get(`${API_BASE_URL}/api/security/locked`, {
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

  const handleUnlock = async (userId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/userProfile/${userId}`,
        { locked: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the users state to reflect the unlocked user
      setUsers(prev => ({
        ...prev,
        lockedAccounts: prev.lockedAccounts.filter(user => user.id !== userId)
      }));
      
      toast.success("User unlocked successfully!", {
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
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unlock user", {
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
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    navigate('/sign');
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

  const totalLockedUsers = users.lockedAccounts ? users.lockedAccounts.length : 0;

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn(
          "transition-[margin] duration-300 ease-in-out",
          collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
        )}>
          <div className="container mx-auto px-4 py-6">

            {/* Header Section with Back Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 max-w-7xl mx-auto gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">
                  All Locked Users ({totalLockedUsers})
                </h1>
              </div>
              
              {/* Controls Section */}
              <div className="flex flex-col lg:flex-row md:flex-row gap-2">
                <button
                  onClick={handleAddUser}
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors hover:bg-[#e57328]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 616 6H2a6 6 0 616-6z" />
                    <path d="M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Add New User
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="max-w-7xl mx-auto mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Locked Users</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{totalLockedUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Locked Users Grid - Show ALL locked users (no slice limit) */}
            {users.lockedAccounts && users.lockedAccounts.length === 0 ? (
              <div className="max-w-7xl mx-auto text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <Lock className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No Locked Users found.</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">All users are currently unlocked.</p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.lockedAccounts?.map((user) => (
                  <div key={user.email} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-left text-gray-800 dark:text-gray-200">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-gray-600 text-left dark:text-gray-300 mb-2 capitalize">{user.statusOfWork || 'Status not available'}</p>

                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      <button
                        onClick={() => handleUnlock(user.id)}
                        disabled={isLoading}
                        className={`w-full px-4 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                          isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                        }`}
                      >
                        {isLoading ? 'Processing...' : 'Unlock User'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Sidebar>
      <Footer/>
    </>
  );
};

export default AllLockedUsers;
