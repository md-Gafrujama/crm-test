import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../config/api';

export const PersonalDetails = (onLogout) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');

        if (!token || !storedUserId) {
          throw new Error('Missing authentication data');
        }

        // Fetch all users data
        const allUsersResponse = await axios.get(`${API_BASE_URL}/api/allUser`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const allUsers = allUsersResponse.data;
        const matchedUser = allUsers.find(user =>
          user.id === storedUserId &&
          user.username === storedUsername
        );

        if (!matchedUser) {
          throw new Error('User data mismatch');
        }

        // Fetch additional user info
        const userInfoResponse = await axios.get(`${API_BASE_URL}/api/allUser/info/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const userInfoData = userInfoResponse.data;
        
        // Find matching user info by username
        const matchedUserInfo = Array.isArray(userInfoData) 
          ? userInfoData.find(info => info.username === storedUsername)
          : (userInfoData.username === storedUsername ? userInfoData : null);

        setCurrentUser(matchedUser);
        setUserInfo(matchedUserInfo);
        setLoading(false);

      } catch (error) {
        console.error('Profile loading error:', error);
        const errorMessage = error.response?.data?.message ||
          error.message ||
          "Failed to load profile data";

        toast.error(errorMessage);
        setError(errorMessage);
        setLoading(false);
        onLogout?.();
      }
    };

    loadUserProfile();
  }, [onLogout]);

  // Merge data from both endpoints
  const user = currentUser ? {
    id: currentUser.id,
    name: userInfo 
      ? `${userInfo.firstName} ${userInfo.lastName}`
      : `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username,
    username: currentUser.username,
    email: currentUser.email,
    role: currentUser.role,
    joinDate: new Date(currentUser.createdAt).toLocaleDateString(),
    lastLogin: 'Recently',
    avatar: userInfo?.photo || 
             currentUser.photo || 
             'https://randomuser.me/api/portraits/men/32.jpg',
    bio: currentUser.about || `User with username ${currentUser.username}`,
    skills: currentUser.skills || ['User Management', 'Profile Editing'],
    phoneNumber: currentUser.phoneNumber || 'Not provided',
    assignedWork: currentUser.assignedWork || 'No assigned work',
    statusOfWork: currentUser.statusOfWork || 'Unknown',
    // Additional fields from userInfo
    firstName: userInfo?.firstName || currentUser.firstName || '',
    lastName: userInfo?.lastName || currentUser.lastName || '',
    photo: userInfo?.photo || currentUser.photo || null
  } : {
    id: null,
    name: 'User',
    username: 'Unknown',
    email: 'No email',
    role: 'user',
    joinDate: 'Unknown',
    lastLogin: 'Unknown',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'User information not available',
    skills: [],
    phoneNumber: 'Not provided',
    assignedWork: 'No data',
    statusOfWork: 'Unknown',
    firstName: '',
    lastName: '',
    photo: null
  };

  return { 
    user, 
    loading, 
    error,
    userInfo, // Expose userInfo separately if needed
    currentUser // Expose currentUser separately if needed
  };
};

// Alternative version with better error handling and retry logic
export const PersonalDetailsWithRetry = (onLogout) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserProfile = async (retryCount = 0) => {
      try {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');

        if (!token || !storedUserId) {
          throw new Error('Missing authentication data');
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        // Use Promise.all to fetch both endpoints simultaneously
        const [allUsersResponse, userInfoResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/allUser`, { headers }),
          axios.get(`${API_BASE_URL}/api/allUser/info/`, { headers }).catch(err => {
            console.warn('User info endpoint failed, continuing without it:', err);
            return null;
          })
        ]);

        const allUsers = allUsersResponse.data;
        const matchedUser = allUsers.find(user =>
          user.id === storedUserId &&
          user.username === storedUsername
        );

        if (!matchedUser) {
          throw new Error('User data mismatch');
        }

        let matchedUserInfo = null;
        if (userInfoResponse?.data) {
          const userInfoData = userInfoResponse.data;
          matchedUserInfo = Array.isArray(userInfoData) 
            ? userInfoData.find(info => info.username === storedUsername)
            : (userInfoData.username === storedUsername ? userInfoData : null);
        }

        setCurrentUser(matchedUser);
        setUserInfo(matchedUserInfo);
        setError(null);
        setLoading(false);

      } catch (error) {
        console.error('Profile loading error:', error);
        
        // Retry logic for network errors
        if (retryCount < 2 && (error.code === 'NETWORK_ERROR' || error.response?.status >= 500)) {
          setTimeout(() => loadUserProfile(retryCount + 1), 1000 * (retryCount + 1));
          return;
        }

        const errorMessage = error.response?.data?.message ||
          error.message ||
          "Failed to load profile data";

        toast.error(errorMessage);
        setError(errorMessage);
        setLoading(false);
        
        // Only logout on auth errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          onLogout?.();
        }
      }
    };

    loadUserProfile();
  }, [onLogout]);

  const user = currentUser ? {
    id: currentUser.id,
    name: userInfo 
      ? `${userInfo.firstName} ${userInfo.lastName}`
      : `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username,
    username: currentUser.username,
    email: currentUser.email,
    role: currentUser.role,
    joinDate: new Date(currentUser.createdAt).toLocaleDateString(),
    lastLogin: 'Recently',
    avatar: userInfo?.photo || 
             currentUser.photo || 
             'https://randomuser.me/api/portraits/men/32.jpg',
    bio: currentUser.about || `User with username ${currentUser.username}`,
    skills: currentUser.skills || ['User Management', 'Profile Editing'],
    phoneNumber: currentUser.phoneNumber || 'Not provided',
    assignedWork: currentUser.assignedWork || 'No assigned work',
    statusOfWork: currentUser.statusOfWork || 'Unknown',
    firstName: userInfo?.firstName || currentUser.firstName || '',
    lastName: userInfo?.lastName || currentUser.lastName || '',
    photo: userInfo?.photo || currentUser.photo || null
  } : {
    id: null,
    name: 'User',
    username: 'Unknown',
    email: 'No email',
    role: 'user',
    joinDate: 'Unknown',
    lastLogin: 'Unknown',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'User information not available',
    skills: [],
    phoneNumber: 'Not provided',
    assignedWork: 'No data',
    statusOfWork: 'Unknown',
    firstName: '',
    lastName: '',
    photo: null
  };

  return { 
    user, 
    loading, 
    error,
    userInfo,
    currentUser,
    hasUserInfo: !!userInfo // Helper to check if additional user info is available
  };
};