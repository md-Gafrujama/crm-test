import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { UserHeader } from '../common/UserHeader';
import { useSidebarUser, UserSidebar } from '../common/UserSidebar';
import { cn } from "../../../utils/cn";
import { useTheme } from '../../../hooks/use-theme';
import { UserFooter } from '../common/UserFooter';
import { useNavigate } from 'react-router-dom';

const UserReport = ({ collapsed, onLogout }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leadActivity, setLeadActivity] = useState([]);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
  const { theme } = useTheme();

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Load user profile and lead activity
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        
        if (!token || !storedUserId) {
          throw new Error('Missing authentication data');
        }

        // Fetch user profile
        const userResponse = await axios.get(`${API_BASE_URL}/api/allUser`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Handle different response structures
        const userData = Array.isArray(userResponse.data) ? userResponse.data : userResponse.data.data || [];
        
        // Try different ID matching strategies (string vs number)
        const matchedUser = userData.find(user => 
          user.id === storedUserId || 
          user.id === parseInt(storedUserId) || 
          user.id.toString() === storedUserId
        );
        
        if (!matchedUser) {
          console.error('User matching failed. Stored ID:', storedUserId, 'Available users:', userData.map(u => ({id: u.id, type: typeof u.id})));
          throw new Error('User data mismatch');
        }
        
        setCurrentUser(matchedUser);

        // Fetch lead activity
        const leadsResponse = await axios.get(`${API_BASE_URL}/api/usersData`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Combine all leads and sort by recent activity
        const allLeads = [
          ...(leadsResponse.data.data?.allNewLeads || []),
          ...(leadsResponse.data.data?.allContacted || []),
          ...(leadsResponse.data.data?.allEngaged || []),
          ...(leadsResponse.data.data?.allQualified || []),
          ...(leadsResponse.data.data?.allProposalSent || []),
          ...(leadsResponse.data.data?.allNegotiation || []),
          ...(leadsResponse.data.data?.allClosedWon || []),
          ...(leadsResponse.data.data?.allClosedLost || []),
          ...(leadsResponse.data.data?.allOnHold || []),
          ...(leadsResponse.data.data?.allDoNotContact || []),
        ];

        // Sort by most recent first and take top 5
        const sortedLeads = allLeads
          .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
          .slice(0, 5);

        setLeadActivity(sortedLeads);
        setLoading(false);

      } catch (error) {
        console.error('Data loading error:', error);
        toast.error(error.message || "Failed to load data", {
          position: "top-right",
          theme: theme === 'dark' ? 'dark' : 'light',
        });
        setLoading(false);
        
        // Only logout for authentication errors, not data issues
        if (error.response?.status === 401 || error.message.includes('authentication') || error.message.includes('token')) {
          if (typeof onLogout === 'function') {
            onLogout();
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('loggedIn');
            navigate('/login');
          }
        }
      }
    };

    loadUserData();
  }, [onLogout, theme]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    );
  }

  // Add null check for currentUser
  if (!currentUser) {
    return (
      <>
        <UserHeader onToggleSidebar={toggleSidebar} />
        <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
          <div className={cn(
            "transition-all duration-300 ease-in-out min-h-screen bg-slate-100 dark:bg-slate-900",
            collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
          )}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-8 text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Unable to Load User Data
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please try refreshing the page or contact support if the issue persists.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#ff8633] hover:bg-[#e57328] text-white rounded-lg transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </UserSidebar>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserHeader onToggleSidebar={toggleSidebar} />
      <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn(
          "transition-all duration-300 ease-in-out min-h-screen bg-slate-100 dark:bg-slate-900",
          collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
        )}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* User Profile Summary Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden mb-8">
               <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium dark:text-gray-300">
                    {currentUser?.firstName || 'N/A'} {currentUser?.lastName || ''}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                  <p className="font-medium dark:text-gray-300">
                    {currentUser?.role || 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-medium dark:text-gray-300 capitalize">
                    {currentUser?.statusOfWork || 'Active'}
                  </p>
                </div>
              </div>
            </div>

            {/* Lead Activity Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#ff8633] to-[#ff9a5a] p-6">
                <h2 className="text-xl font-bold text-white">Recent Lead Activity</h2>
              </div>
              
              <div className="p-6">
                {leadActivity.length > 0 ? (
                  <>
                  <div className="space-y-4">
                    {leadActivity.map((lead, index) => (
                      <div key={lead.id || index} className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium dark:text-gray-300">
                              {lead.customerFirstName || 'Unknown'} {lead.customerLastName || 'Customer'}
                            </h3>
                            <p className="text-sm text-gray-600 text-left dark:text-gray-400">
                              {lead.companyName || 'No company specified'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            lead.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            lead.status === 'Closed Won' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            lead.status === 'Closed Lost' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {lead.status || 'Unknown'}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            {lead.serviceInterestedIn || 'No service specified'}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {lead.updatedAt || lead.createdAt ? formatDate(lead.updatedAt || lead.createdAt) : 'No date'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-right">
                    <button 
                      onClick={() => navigate('/user-leads')}
                      className="text-sm font-medium text-white px-6 py-3 rounded-lg bg-[#ff8633] hover:bg-[#e57328] transition-colors"
                    >
                      View All Leads ({leadActivity.length}) →
                    </button>
                  </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No lead activity found
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </UserSidebar>
      <UserFooter />
    </>
  );
};

export default UserReport;



