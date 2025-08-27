import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { UserHeader } from '../common/UserHeader';
import { useSidebarUser, UserSidebar } from '../common/UserSidebar';
import { cn } from "../../../utils/cn";
import { useTheme } from '../../../hooks/use-theme';
import { UserFooter } from '../common/UserFooter';

const ProfileofUser = ({ collapsed, onLogout }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
  const { theme, setTheme } = useTheme();

  const EditProfilePanel = ({ profile, onClose, onSave }) => {
    const [editedProfile, setEditedProfile] = useState({
      id: profile?.id || '',
      email: profile?.email || '',
      phoneNumber: profile?.phoneNumber || '',
      about: profile?.bio || '',
      skills: profile?.skills || []
    });
    const panelRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (panelRef.current && !panelRef.current.contains(event.target)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);

    const handleChangeEdit = (e) => {
      const { name, value } = e.target;
      setEditedProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillChange = (index, value) => {
      const newSkills = [...editedProfile.skills];
      newSkills[index] = value;
      setEditedProfile(prev => ({ ...prev, skills: newSkills }));
    };

    const addSkill = () => {
      setEditedProfile(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    };

    const removeSkill = (index) => {
      const newSkills = editedProfile.skills.filter((_, i) => i !== index);
      setEditedProfile(prev => ({ ...prev, skills: newSkills }));
    };

    const handleSubmitEdit = (e) => {
      e.preventDefault();
      onSave(editedProfile);
    };

    return (
      <div 
        ref={panelRef}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
      >
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 px-2">
          <div className="bg-gray-50 dark:bg-slate-800 px-2 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
            <div className="flex justify-between items-center mb-2 p-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-400">Edit Profile</h2>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-100 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-4">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editedProfile.email}
                      onChange={handleChangeEdit}
                      className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-700 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editedProfile.phoneNumber}
                      onChange={handleChangeEdit}
                      className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-700 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[#ff8633]">About</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">About You</label>
                    <textarea
                      name="about"
                      value={editedProfile.about}
                      onChange={handleChangeEdit}
                      className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-700 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                      rows="3"
                      placeholder="Tell us about yourself, your experience, and your professional background"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[#ff8633]">Skills</h3>
                  <div className="space-y-3">
                    {editedProfile.skills?.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-700 flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder="Enter skill"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSkill}
                      className="flex items-center text-sm font-medium text-[#ff8633] hover:text-[#e67328] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Skill
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:border-slate-700 dark:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff8633] hover:bg-[#e67328] transition-colors"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveUserProfile = async (updatedUser) => {
    try {
      setIsSaving(true);
      setApiError(null);

      if (!updatedUser.id) {
        throw new Error('User ID is missing. Cannot update profile.');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/update-profile/${updatedUser.id}`,
        {
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          about: updatedUser.about,
          skills: updatedUser.skills,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        setEditPanelOpen(false);
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          theme: theme === 'dark' ? 'dark' : 'light',
        });

        // Refresh user data
        await loadUserProfile();
      }

    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update profile";

      setApiError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: theme === 'dark' ? 'dark' : 'light',
      });

    } finally {
      setIsSaving(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      // Debug: Check what's in localStorage
      const token = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      const storedUsername = localStorage.getItem('username');
      
      console.log('Auth Debug:', { 
        hasToken: !!token, 
        userId: storedUserId, 
        username: storedUsername 
      });

      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      if (!storedUserId) {
        throw new Error('User ID not found. Please login again.');
      }

      // Try different API endpoints based on your API structure
      let response;
      let userData = null;

      try {
        // First try: Get all users and find current user
        console.log('Trying to fetch from:', `${API_BASE_URL}/api/allUser`);
        response = await axios.get(`${API_BASE_URL}/api/allUser`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('API Response:', response.data);

        // Handle different response structures
        let allUsers = [];
        if (Array.isArray(response.data)) {
          allUsers = response.data;
        } else if (response.data && Array.isArray(response.data.users)) {
          allUsers = response.data.users;
        } else if (response.data && Array.isArray(response.data.data)) {
          allUsers = response.data.data;
        } else {
          console.log('Unexpected response structure:', response.data);
        }

        if (allUsers.length > 0) {
          // Try different matching strategies
          userData = allUsers.find(user => 
            user.id === storedUserId || 
            user._id === storedUserId ||
            user.id === parseInt(storedUserId) ||
            user._id === parseInt(storedUserId)
          );

          if (!userData && storedUsername) {
            userData = allUsers.find(user => 
              user.username === storedUsername
            );
          }

          console.log('Matched user:', userData);
        }
      } catch (allUsersError) {
        console.log('AllUsers endpoint failed:', allUsersError.message);
      }

      // Second try: Get current user profile directly
      if (!userData) {
        try {
          console.log('Trying profile endpoint:', `${API_BASE_URL}/api/profile`);
          response = await axios.get(`${API_BASE_URL}/api/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          userData = response.data;
          console.log('Profile endpoint response:', userData);
        } catch (profileError) {
          console.log('Profile endpoint failed:', profileError.message);
        }
      }

      // Third try: Get user by ID
      if (!userData && storedUserId) {
        try {
          console.log('Trying user by ID:', `${API_BASE_URL}/api/user/${storedUserId}`);
          response = await axios.get(`${API_BASE_URL}/api/user/${storedUserId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          userData = response.data;
          console.log('User by ID response:', userData);
        } catch (userByIdError) {
          console.log('User by ID endpoint failed:', userByIdError.message);
        }
      }

      // Fourth try: Get current user info
      if (!userData) {
        try {
          console.log('Trying me endpoint:', `${API_BASE_URL}/api/me`);
          response = await axios.get(`${API_BASE_URL}/api/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          userData = response.data;
          console.log('Me endpoint response:', userData);
        } catch (meError) {
          console.log('Me endpoint failed:', meError.message);
        }
      }

      if (!userData) {
        throw new Error('Unable to fetch user data from any endpoint. Please check your API configuration.');
      }

      // Handle nested user data
      if (userData.user) {
        userData = userData.user;
      } else if (userData.data) {
        userData = userData.data;
      }

      console.log('Final user data:', userData);
      setCurrentUser(userData);

    } catch (error) {
      console.error('Profile loading error:', error);
      
      let errorMessage = "Failed to load profile data";
      
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. Please check your permissions.";
      } else if (error.response?.status === 404) {
        errorMessage = "User profile not found.";
      } else if (error.message.includes('Network Error')) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }

      setApiError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 7000,
        theme: theme === 'dark' ? 'dark' : 'light',
      });

      // Only logout on auth errors
      if (error.response?.status === 401 && onLogout) {
        setTimeout(() => {
          onLogout();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Transform user data from API to display format
  const transformUserData = (userData) => {
    if (!userData) return null;

    return {
      id: userData.id,
      name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'User',
      email: userData.email || 'No email provided',
      role: userData.role || 'user',
      joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown',
      lastLogin: userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'Recently',
      avatar: userData.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username || 'User')}&background=ff8633&color=fff`,
      bio: userData.about || 'No information provided',
      skills: Array.isArray(userData.skills) ? userData.skills : [],
      phoneNumber: userData.phoneNumber || 'Not provided',
      assignedWork: userData.assignedWork || 'No assigned work',
      statusOfWork: userData.statusOfWork || 'Not specified'
    };
  };

  const user = transformUserData(currentUser);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-500 mb-4">
            {apiError || "Unable to load user profile data"}
          </p>
          
          {/* Debug Information */}
          <div className="mb-4 p-3 bg-gray-100 dark:bg-slate-800 rounded-lg text-sm text-left">
            <p className="font-medium mb-2 text-gray-700 dark:text-gray-300">Debug Info:</p>
            <p className="text-gray-600 dark:text-gray-400">
              Token: {localStorage.getItem('token') ? '✓ Present' : '✗ Missing'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              User ID: {localStorage.getItem('userId') || 'Missing'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Username: {localStorage.getItem('username') || 'Missing'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              API URL: {API_BASE_URL}
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={loadUserProfile}
              disabled={loading}
              className="px-4 py-2 bg-[#ff8633] text-white rounded-lg hover:bg-[#e67328] transition-colors disabled:opacity-50"
            >
              {loading ? 'Retrying...' : 'Retry'}
            </button>
            
            <button
              onClick={() => {
                localStorage.clear();
                if (onLogout) onLogout();
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors ml-2"
            >
              Clear Data & Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserHeader onToggleSidebar={toggleSidebar} />
      <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn(
          "transition-all duration-300 ease-in-out min-h-screen dark:bg-slate-900",
          collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
        )}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-slate-900">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#ff8633] to-[#ff9a5a] p-4 sm:p-6 text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <div className="flex justify-center">
                      <img
                        className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-full border-4 border-white shadow-lg object-cover"
                        src={user.avatar}
                        alt="User avatar"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff8633&color=fff`;
                        }}
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
                      <p className="text-white/90 capitalize text-sm sm:text-base md:text-lg">{user.role}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Info Section */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
                          Personal Information
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Email</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Phone</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400">{user.phoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Member Since</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400">{user.joinDate}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
                          Work Information
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Assigned Work</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400">{user.assignedWork}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Status</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400 capitalize">{user.statusOfWork}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* About & Skills Section */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
                          About
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
                          Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.length > 0 ? (
                            user.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-[#ff8633]/10 text-[#ff8633] rounded-full text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                              No skills added yet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => setEditPanelOpen(true)}
                      className="px-6 py-3 bg-[#ff8633] hover:bg-[#e67328] text-white rounded-lg font-medium transition-colors shadow-md"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Edit Profile'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Modal */}
          {editPanelOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setEditPanelOpen(false)}
              />
              <EditProfilePanel
                profile={user}
                onClose={() => setEditPanelOpen(false)}
                onSave={handleSaveUserProfile}
              />
            </>
          )}
        </div>
      </UserSidebar>
      <UserFooter />
    </>
  );
};

export default ProfileofUser;