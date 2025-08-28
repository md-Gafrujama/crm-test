import React, { useState, useEffect,useRef } from 'react';
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
    const [editedProfile, setEditedProfile] = useState(profile);
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
      setEditedProfile(prev => ({ ...prev, [name]: value, id: profile.id }));
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
      className={`fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out`}
    >
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 px-2">
        <div className="bg-gray-50 dark:bg-slate-800 px-2 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editedProfile.email || ''}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editedProfile.phoneNumber || ''}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-[#ff8633]">About</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">About You</label>
                  <textarea
                    name="about"
                    value={editedProfile.about || ''}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    rows="2"
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
                        placeholder="Skill"
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

            <div className="mt-8 flex justify-end space-x-3">
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

      if (!updatedUser.id) {
        throw new Error('User ID is missing. Cannot update profile.');
      }

      const token = localStorage.getItem('token');

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

     setEditPanelOpen(false);

      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        theme: theme === 'dark' ? 'dark' : 'light',
      });
      const { data } = await axios.get(`${API_BASE_URL}/api/usersData`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const matchedUser = data.find(user => user.id === updatedUser.id);
      setCurrentUser(matchedUser);

    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update profile";

      setApiError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: theme === 'dark' ? 'dark' : 'light',
        style: { fontSize: '1.2rem' },
      });

    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLead = async (updatedLead) => {
    try {
      setIsSaving(true);
      setApiError(null);

      if (!updatedLead.id) {
        throw new Error('Lead ID is missing. Cannot update lead.');
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/api/leads/update-lead/${updatedLead.id}`,
        updatedLead,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setEditProfilePopupOpen(false);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === 'dark' ? 'dark' : 'light',
      });

      // Refresh user data
      const { data } = await axios.get(`${API_BASE_URL}/api/usersData`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const matchedUser = data.find(user => user.id === updatedLead.id);
      setCurrentUser(matchedUser);

    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage = err.response?.data?.message ||
        err.message ||
        "Failed to update profile";

      setApiError(errorMessage);
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
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');

        if (!token || !storedUserId) {
          throw new Error('Missing authentication data');
        }

        const response = await axios.get(`${API_BASE_URL}/api/usersData`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const allUsers = response.data;
        const matchedUser = allUsers.find(user =>
          user.id === storedUserId &&
          user.username === storedUsername
        );

        if (!matchedUser) {
          throw new Error('User data mismatch');
        }

        setCurrentUser(matchedUser);
        setLoading(false);

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

  const user = currentUser ? {
    id: currentUser.id,
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    email: currentUser.email,
    role: currentUser.role,
    joinDate: new Date(currentUser.createdAt).toLocaleDateString(),
    lastLogin: 'Recently',
    avatar: currentUser.photo || 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: currentUser.about || `User with username ${currentUser.username}`,
    skills: currentUser.skills || ['User Management', 'Profile Editing'],
    phoneNumber: currentUser.phoneNumber || 'Not provided',
    assignedWork: currentUser.assignedWork || 'No assigned work',
    statusOfWork: currentUser.statusOfWork || 'Unknown'
  } : {
    name: 'User',
    email: 'No email',
    role: 'user',
    joinDate: 'Unknown',
    lastLogin: 'Unknown',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'User information not available',
    skills: [],
    phoneNumber: 'Not provided',
    assignedWork: 'No data',
    statusOfWork: 'Unknown'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    );
  }

  return (
    <>
      <UserHeader onToggleSidebar={toggleSidebar} />
      <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar} >

        <div className={cn(
          "transition-all duration-300 ease-in-out min-h-screen dark:bg-slate-900",
          collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
        )}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-slate-900">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-4xl  dark:bg-slate-800 rounded-xl  overflow-hidden">
                <div className="bg-gradient-to-r from-[#ff8633] to-[#ff9a5a] p-4 sm:p-6 text-center">
  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-10">
    {/* Avatar with optimized sizing */}
    <div className="flex justify-center">
      <img
        className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 xl:h-40 xl:w-40 2xl:h-44 2xl:w-44 rounded-full border-4 border-white shadow-md object-cover"
        src={user.avatar}
        alt="User avatar"
        // These attributes help with image quality
        loading="eager"
        decoding="async"
      />
    </div>

    {/* Name and Role */}
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
                    <div className="space-y-6 text-center lg:text-left">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200">
                          Personal Information
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-100">Email</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-100">Phone</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400">{user.phoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-100">Member Since</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400">{user.joinDate}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200">
                          Work Information
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-100">Assigned Work</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400">{user.assignedWork}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-100">Status</p>
                            <p className="mt-1 text-gray-800 dark:text-gray-400 capitalize">{user.statusOfWork}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* About & Skills Section */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 dark:text-gray-400">
                          About
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200">
                          Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#ff8633]/10 text-[#ff8633] rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => setEditPanelOpen(true)}
                      className="px-6 py-2 bg-[#ff8633] hover:bg-[#e67328] text-white rounded-lg font-medium transition-colors shadow-md"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Popup */}
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