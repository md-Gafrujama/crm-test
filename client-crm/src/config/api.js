// src/config/api.js
// Simple API configuration

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-test-green.vercel.app';
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888';
export { API_BASE_URL };