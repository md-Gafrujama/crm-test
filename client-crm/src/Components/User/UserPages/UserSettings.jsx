
import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { UserHeader } from '../common/UserHeader';
import { UserSidebar,useSidebarUser } from '../common/UserSidebar';
import { useTheme } from '../../../hooks/use-theme';
import { UserFooter } from '../common/UserFooter';


const UserSettings = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
  const { theme, setTheme } = useTheme();


  // UserProfile.jsx
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.group('[UserProfile] Loading User Data');

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

        console.log('Fetching user data...');
        const response = await axios.get(`${API_BASE_URL}/api/allUser`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const allUsers = response.data;
        console.log('Received users:', allUsers);

        // 3. Find matching user
        const matchedUser = allUsers.find(user =>
          user.id === storedUserId &&
          user.username === storedUsername
        );

        if (!matchedUser) {
          console.error('No matching user found. Available users:',
            allUsers.map(u => ({ id: u.id, username: u.username })));
          throw new Error('User data mismatch');
        }

        console.log('Matched user:', matchedUser);
        setCurrentUser(matchedUser);
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
  }, [onLogout]);


  const matchedUser = allUsers.find(user =>
    user.id === (userData?.userId || '')
  ) || allUsers.find(user =>
    user.username === (userData?.username || '')
  );

  const user = currentUser ? {
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    email: currentUser.email,
    role: currentUser.role,
    joinDate: new Date(currentUser.createdAt).toLocaleDateString(),
    lastLogin: 'Recently',
    avatar: currentUser.photo || 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: `User with username ${currentUser.username}`,
    skills: ['User Management', 'Profile Editing'],
    leadsActivity: [
      { id: 1, project: 'User Profile', status: 'In Progress', lastUpdate: 'Recently' }
    ],
    assignedWork: currentUser.assignedWork || 'No assigned work',
    statusOfWork: currentUser.statusOfWork || 'Unknown',
    phoneNumber: currentUser.phoneNumber || 'Not provided'
  } : {
    name: 'User',
    email: 'No email',
    role: 'user',
    joinDate: 'Unknown',
    lastLogin: 'Unknown',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'User information not available',
    skills: [],
    leadsActivity: [],
    assignedWork: 'No data',
    statusOfWork: 'Unknown',
    phoneNumber: 'Not provided'
  };

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    alerttopic: '',
    reminder: '',
    alertdate: '',
    remindertime: '',
    description: '',

  });

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);



  const [activeTab, setActiveTab] = useState('dashboard');


  const handleNewPass = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      console.error('New passwords do not match!');
      return;
    }

    const data = {
      currentPassword,
      newPassword,
      confirmPassword
    };

    console.log('Submitted Password Data:', data);

    // Simulated API call
    try {
      const response = await changepass(data);
      console.log('API Response:', response);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const changepass = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Password updated successfully!', data });
      }, 1000);
    });
  };

  return (
    <>
     <UserHeader onToggleSidebar={toggleSidebar} />
     <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar} >
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="mx-auto px-4 sm:px-6 lg:px-0 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full justify-center max-w-3xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6">
                <h2 className="text-xl lg:text-3xl font-bold text-gray-800 dark:text-gray-400 mb-6">Account Settings</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Last login: {user.lastLogin}</p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-400 mb-2">Change Password</h3>
                    <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault();

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

                              toast.error("Password changed successfully!", {
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
                        throw new Error(errorMessage);
                      }
                    }}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Current Password</label>
                        <input
                          type="password"
                          className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">New Password</label>
                        <input
                          type="password"
                          className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={8}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors hover:bg-[#e2762d]"
                      >
                        Update Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>

          </div>
        </div>
      </div>
    </div>
    </UserSidebar>
    <UserFooter/>
    </>
  );
};

export default UserSettings;
















