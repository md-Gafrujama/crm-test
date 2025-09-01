import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { UserHeader } from '../common/UserHeader';
import { UserSidebar, useSidebarUser } from '../common/UserSidebar';
import { useTheme } from '../../../hooks/use-theme';
import { UserFooter } from '../common/UserFooter';

const UserSettings = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
  const { theme, setTheme } = useTheme();

  // Updated useEffect to use /api/usersData
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.group('[UserProfile] Loading User Data from /api/usersData');

        // 1. Get stored credentials
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');

        console.log('Stored credentials:', {
          token: token ? 'exists' : 'missing',
          userId: storedUserId,
          username: storedUsername
        });

        if (!token || !storedUserId) {
          throw new Error('Missing authentication data');
        }

        console.log('Fetching user data from /api/usersData...');
        const response = await axios.get(`${API_BASE_URL}/api/usersData`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('API Response:', response.data);

        // Handle the new API structure
        if (response.data.success && response.data.data.user) {
          const apiUser = response.data.data.user;
          
          // Verify the user matches stored credentials
          if (apiUser.id === storedUserId && apiUser.username === storedUsername) {
            console.log('User data matched:', apiUser);
            setCurrentUser(apiUser);
            setUserData(response.data.data); // Store full data including leads info
          } else {
            console.error('User data mismatch. API user:', {
              id: apiUser.id,
              username: apiUser.username
            });
            throw new Error('User data mismatch');
          }
        } else {
          throw new Error('Invalid API response structure');
        }

        setLoading(false);
        console.groupEnd();
      } catch (error) {
        console.error('Profile loading error:', error);

        const errorMessage = error.response?.data?.message ||
          error.message ||
          "Failed to load profile data";

        toast.error(errorMessage, {
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
        setLoading(false);
        onLogout();
      }
    };

    loadUserProfile();
  }, [onLogout, theme]);

  // Updated user object using new API structure
  const user = currentUser ? {
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    email: currentUser.email,
    role: currentUser.role,
    joinDate: new Date(currentUser.createdAt).toLocaleDateString(),
    lastLogin: new Date(currentUser.updatedAt).toLocaleDateString(),
    avatar: currentUser.photo || 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: currentUser.about || `User with username ${currentUser.username}`,
    skills: currentUser.skills || ['User Management', 'Profile Editing'],
    assignedWork: currentUser.assignedWork || 'No assigned work',
    statusOfWork: currentUser.statusOfWork || 'Unknown',
    phoneNumber: currentUser.phoneNumber || 'Not provided',
    username: currentUser.username,
    userType: currentUser.userType,
    companyId: currentUser.companyId
  } : {
    name: 'User',
    email: 'No email',
    role: 'user',
    joinDate: 'Unknown',
    lastLogin: 'Unknown',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'User information not available',
    skills: [],
    assignedWork: 'No data',
    statusOfWork: 'Unknown',
    phoneNumber: 'Not provided'
  };

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <UserHeader onToggleSidebar={toggleSidebar} />
      <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className="min-h-screen  dark:bg-slate-900">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                {/* Improved Card with #ff8633 theme */}
                <div className=" dark:bg-slate-800 rounded-2xl dark:border-slate-700 p-8">
                  {/* Header Section */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#ff8633] to-[#e07429] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Last login: <span className="font-medium text-[#ff8633]">{user.lastLogin}</span>
                    </p>
                  </div>

                  {loading ? (
                    // Loading State
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ff8633] border-t-transparent mx-auto mb-4"></div>
                        <p className="text-[#ff8633] font-medium">Loading user data...</p>
                      </div>
                    </div>
                  ) : (
                    // Password Change Form
                    <div className="space-y-6">
                      <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#ff8633]/10 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#ff8633]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          Change Password
                        </h3>

                        <form 
                          className="space-y-6" 
                          onSubmit={async (e) => {
                            e.preventDefault();
                            setIsSubmitting(true);

                            if (newPassword !== confirmPassword) {
                              toast.error("Passwords don't match!", {
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
                              setIsSubmitting(false);
                              return;
                            }

                            try {
                              const token = localStorage.getItem('token');
                              const response = await axios.post(
                                `${API_BASE_URL}/api/editPass`,
                                {
                                  currentPassword,
                                  newPassword
                                },
                                {
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  }
                                }
                              );

                              toast.success("Password changed successfully!", {
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
                              
                              setCurrentPassword('');
                              setNewPassword('');
                              setConfirmPassword('');

                            } catch (error) {
                              const errorMessage = error.response?.data?.message ||
                                "Password change failed";
                              
                              toast.error(errorMessage, {
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
                          }}
                        >
                          {/* Current Password */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="Enter your current password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                            />
                          </div>

                          {/* New Password */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="Enter your new password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              minLength={8}
                            />
                          </div>

                          {/* Confirm Password */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="Confirm your new password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              minLength={8}
                            />
                          </div>

                          {/* Submit Button */}
                          <div className="pt-4">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full bg-gradient-to-r from-[#ff8633] to-[#e07429] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#e07429] hover:to-[#cc6422] focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:ring-offset-2 dark:focus:ring-offset-slate-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                              {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                  Updating...
                                </div>
                              ) : (
                                'Update Password'
                              )}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* User Info Display */}
                      {userData && (
                        <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                          <h4 className="text-sm font-semibold text-[#ff8633] uppercase tracking-wider mb-4">
                            Account Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Work Status:</span>
                              <span className="ml-2 text-[#ff8633] font-bold capitalize">{user.statusOfWork}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Role:</span>
                              <span className="ml-2 text-[#ff8633] font-bold capitalize">{user.role}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </UserSidebar>
      <UserFooter />
    </>
  );
};

export default UserSettings;
