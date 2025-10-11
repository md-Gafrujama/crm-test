import axios from "axios";
import { API_BASE_URL } from '../../../../../config/api';



// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Fetch recent leads data and statistics
 * @returns {Promise} API response with leads data and stats
 */
export const fetchRecentLeads = async () => {
  try {
    const response = await apiClient.get('/api/recent');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch recent leads');
  }
};

/**
 * Fetch weekly leads data
 * @returns {Promise} API response with weekly leads
 */
export const fetchWeeklyLeads = async () => {
  try {
    const response = await apiClient.get('/api/leads/weekly');
    return response.data || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch weekly leads');
  }
};

/**
 * Fetch monthly leads data
 * @returns {Promise} API response with monthly leads
 */
export const fetchMonthlyLeads = async () => {
  try {
    const response = await apiClient.get('/api/leads/monthly');
    return response.data || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch monthly leads');
  }
};


/**
 * Download leads as CSV
 * @returns {Promise} Blob data for CSV file
 */
export const downloadLeadsCSV = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/api/export/csv`, { 
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
      responseType: 'blob'
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Download failed');
  }
};

/**
 * Handle CSV download with file creation
 */
export const handleCSVDownload = async () => {
  try {
    const blob = await downloadLeadsCSV();
    
    const url = window.URL.createObjectURL(new Blob([blob]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
