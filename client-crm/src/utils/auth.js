

// Utility functions for authentication and user data
export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.uid,
      username: payload.username,
      role: payload.role,
      email: payload.email
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Get companyId by fetching user profile using uid from JWT
export const getCompanyIdFromAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const user = getUserFromToken();
    if (!user?.id) return null;
    
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8888'}/api/userProfile/${user.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data?.companyId || null;
  } catch (error) {
    console.error('Error fetching companyId:', error);
    return null;
  }
};

// Fallback: try localStorage first, then API
export const getCompanyIdFromToken = () => {
  // Try localStorage first (might be set elsewhere)
  const storedCompanyId = localStorage.getItem('companyId');
  if (storedCompanyId) return storedCompanyId;
  
  // If not in localStorage, we'll need to fetch from API
  return null;
};