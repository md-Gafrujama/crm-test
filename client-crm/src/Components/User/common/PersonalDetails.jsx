import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../config/api';

export const PersonalDetails = (onLogout) => {
  const [currentUser, setCurrentUser] = useState(null);
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

        const response = await axios.get(`${API_BASE_URL}/api/allUser`, {
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

        toast.error(errorMessage);
        setError(errorMessage);
        setLoading(false);
        onLogout?.();
      }
    };

    loadUserProfile();
  }, [onLogout]);

  const user = currentUser ? {
    id: currentUser.id,
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    username: currentUser.username,
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
    statusOfWork: 'Unknown'
  };

  return { user, loading, error };
};