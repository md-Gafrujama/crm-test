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
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
  const { theme, setTheme } = useTheme();

  const EditProfilePanel = ({ profile, onClose, onSave }) => {
    const [editedProfile, setEditedProfile] = useState({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phoneNumber: profile.phoneNumber || '',
      about: profile.about || '',
      skills: profile.skills || [],
      photo: profile.photo || ''
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
      // Filter out empty skills
      const filteredSkills = editedProfile.skills.filter(skill => skill.trim() !== '');
      onSave({ ...editedProfile, skills: filteredSkills });
    };

    return (
      <div 
        ref={panelRef}
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out`}
      >
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 px-2">
          <div className="bg-gray-50 dark:bg-slate-800 px-2 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
            <div className="flex justify-between items-center mb-6 pt-4">
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

            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[#ff8633]">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editedProfile.firstName}
                        onChange={handleChangeEdit}
                        className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editedProfile.lastName}
                        onChange={handleChangeEdit}
                        className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editedProfile.email}
                      onChange={handleChangeEdit}
                      className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editedProfile.phoneNumber}
                      onChange={handleChangeEdit}
                      className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Profile Photo URL</label>
                    <input
                      type="url"
                      name="photo"
                      value={editedProfile.photo}
                      onChange={handleChangeEdit}
                      className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                      placeholder="https://example.com/photo.jpg"
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
                      className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                      rows="3"
                      placeholder="Tell us about yourself, your experience, and your professional background"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[#ff8633]">Skills</h3>
                  <div className="space-y-3">
                    {editedProfile.skills?.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 dark:text-gray-400">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
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
                      className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 flex items-center text-sm font-medium text-[#ff8633] hover:text-[#e67328] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Skill
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3 pb-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 transition-colors"
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

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      if (!userId) {
        throw new Error('User ID not found');
      }

      // Update user profile using your update-profile API
      const response = await axios.put(
        `${API_BASE_URL}/api/update-profile/${userId}`,
        {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          about: updatedUser.about,
          skills: updatedUser.skills,
          photo: updatedUser.photo
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        // Fetch updated user data from usersData API to ensure consistency
        const { data: allUsers } = await axios.get(`${API_BASE_URL}/api/usersData`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Find the updated user in the response
        const updatedUserData = allUsers.find(user => user.id === userId);
        
        if (updatedUserData) {
          setCurrentUser(updatedUserData);
        } else {
          // Fallback: update current state with the form data
          setCurrentUser(prev => ({
            ...prev,
            ...updatedUser
          }));
        }

        setEditPanelOpen(false);

        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: theme === 'dark' ? 'dark' : 'light',
        });
      }

    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update profile";

      setApiError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: theme === 'dark' ? 'dark' : 'light',
        style: { fontSize: '1.1rem' },
      });

    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Fetch user profile using your API
        const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data) {
          setCurrentUser(response.data);
        } else {
          throw new Error('No user data received');
        }

      } catch (error) {
        console.error('Profile loading error:', error);
        const errorMessage = error.response?.data?.message ||
          error.message ||
          "Failed to load profile data";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          theme: theme === 'dark' ? 'dark' : 'light',
          style: { fontSize: '1.1rem' },
        });

        // Only logout if it's an authentication error
        if (error.response?.status === 401 || error.message.includes('token')) {
          onLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [onLogout, theme]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <UserHeader onToggleSidebar={toggleSidebar} />
        <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
          <div className={cn(
            "transition-all duration-300 ease-in-out min-h-screen dark:bg-slate-900 flex items-center justify-center",
            collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
          )}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8633] mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
            </div>
          </div>
        </UserSidebar>
        <UserFooter/>
      </>
    );
  }

  // Error state
  if (apiError && !currentUser) {
    return (
      <>
        <UserHeader onToggleSidebar={toggleSidebar} />
        <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
          <div className={cn(
            "transition-all duration-300 ease-in-out min-h-screen dark:bg-slate-900 flex items-center justify-center",
            collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
          )}>
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠</div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Error Loading Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{apiError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#ff8633] text-white rounded-lg hover:bg-[#e67328] transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </UserSidebar>
        <UserFooter/>
      </>
    );
  }

  // Prepare user data for display
  const user = currentUser ? {
    firstName: currentUser.firstName || 'Unknown',
    lastName: currentUser.lastName || 'User',
    name: `${currentUser.firstName || 'Unknown'} ${currentUser.lastName || 'User'}`,
    username: currentUser.username || 'N/A',
    email: currentUser.email || 'Not provided',
    phoneNumber: currentUser.phoneNumber || 'Not provided',
    photo: currentUser.photo || 'https://ui-avatars.com/api/?name=User&background=ff8633&color=fff',
    about: currentUser.about || `Hello! I'm ${currentUser.firstName || 'User'} and I'm excited to be part of this platform.`,
    skills: currentUser.skills || [],
    // Additional fields that might be useful
    joinDate: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown',
    lastLogin: 'Recently',
    assignedWork: currentUser.assignedWork || 'No assigned work',
    statusOfWork: currentUser.statusOfWork || 'Available'
  } : null;

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
              <div className="w-full max-w-4xl dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#ff8633] to-[#ff9a5a] p-4 sm:p-6 text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-10">
                    <div className="flex justify-center">
                      <img
                        className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 xl:h-40 xl:w-40 2xl:h-44 2xl:w-44 rounded-full border-4 border-white shadow-lg object-cover"
                        src={user?.photo}
                        alt="User avatar"
                        onError={(e) => {
                          e.target.src = 'https://ui-avatars.com/api/?name=User&background=ff8633&color=fff';
                        }}
                        loading="eager"
                        decoding="async"
                      />
                    </div>

                    <div className="text-center sm:text-left">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{user?.name}</h1>
                      <p className="text-white/90 text-sm sm:text-base md:text-lg">@{user?.username}</p>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="space-y-6 text-center lg:text-left">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-slate-600">
                          Personal Information
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-100">Email</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400 break-words">{user?.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-100">Phone</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400">{user?.phoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-100">Member Since</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400">{user?.joinDate}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-100">Status</p>
                            <span className="mt-1 inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* About and Skills */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 dark:text-gray-400 dark:border-slate-600">
                          About
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {user?.about}
                        </p>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-slate-600">
                          Skills & Expertise
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {user?.skills?.length > 0 ? (
                            user.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-[#ff8633]/10 text-[#ff8633] rounded-full text-sm font-medium border border-[#ff8633]/20"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic">No skills added yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => setEditPanelOpen(true)}
                      className="px-6 py-3 bg-[#ff8633] hover:bg-[#e67328] text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Panel Modal */}
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
      <UserFooter/>
    </>
  );
};

export default ProfileofUser;