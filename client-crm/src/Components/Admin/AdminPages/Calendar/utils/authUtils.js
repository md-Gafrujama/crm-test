// Authentication utility functions

export const validateToken = (token) => {
  if (!token) {
    return false;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(parts[1]));

    if (!payload.uid || !payload.role) {
      return false;
    }

    if (payload.exp && payload.exp < Date.now() / 1000) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  if (!validateToken(token)) {
    localStorage.removeItem('token');
    throw new Error('Invalid or expired token');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const handleAuthError = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('userType');
  alert('Your session has expired. Please log in again.');
  window.location.href = '/login';
};
