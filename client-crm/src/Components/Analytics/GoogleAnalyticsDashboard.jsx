import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import io from 'socket.io-client';
import axios from 'axios';
import { getCompanyIdFromToken, getCompanyIdFromAPI } from '../../utils/auth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const GoogleAnalyticsDashboard = ({ companyId: propCompanyId }) => {
  // Get actual companyId from JWT token or API
  const getCompanyId = async () => {
    // Try props first
    if (propCompanyId) return propCompanyId;
    
    // Try localStorage
    const storedCompanyId = localStorage.getItem('companyId');
    if (storedCompanyId && storedCompanyId !== 'temp-company-id') return storedCompanyId;
    
    // Get from JWT token and fetch user data
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Decode JWT to get user ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.uid;
      
      if (userId) {
        // Fetch user data to get companyId
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8888'}/api/userProfile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data?.companyId) {
          localStorage.setItem('companyId', response.data.companyId);
          return response.data.companyId;
        }
      }
    } catch (error) {
      console.error('Error getting companyId:', error);
    }
    
    return null;
  };
  
  const [companyId, setCompanyId] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [dateRange, setDateRange] = useState('7daysAgo');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:8888');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('analytics-update', (data) => {
      setSummary(data.summary);
      setAnalyticsData(data.fullData);
    });

    return () => newSocket.close();
  }, []);

  // Join company room when companyId is available
  useEffect(() => {
    if (socket && companyId) {
      console.log('Joining company room:', companyId);
      socket.emit('join-company', companyId);
    }
  }, [socket, companyId]);

  useEffect(() => {
    // Initialize companyId
    const initCompanyId = async () => {
      const id = await getCompanyId();
      console.log('Retrieved companyId:', id);
      setCompanyId(id);
      setLoading(false);
    };
    
    initCompanyId();
  }, []);

  useEffect(() => {
    if (companyId) {
      checkConnectionStatus();
    }
  }, [companyId]);

  useEffect(() => {
    if (connected) {
      fetchAnalyticsData();
      fetchSummary();
    }
  }, [companyId, dateRange, connected]);

  const checkConnectionStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Checking connection status for companyId:', companyId);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8888'}/api/ga/summary/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Connection check response:', response.data);
      
      if (response.data && response.status === 200) {
        setConnected(true);
        setSummary(response.data);
        console.log('Google Analytics is connected!');
      } else {
        setConnected(false);
        console.log('Google Analytics not connected');
      }
    } catch (error) {
      console.log('Connection check failed:', error.response?.status, error.response?.data);
      if (error.response?.status === 404) {
        console.log('Google Analytics not configured for this company');
      }
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ga/data/${companyId}?dateRange=${dateRange}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ga/summary/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const disconnectGoogleAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/ga/disconnect/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConnected(false);
      setAnalyticsData(null);
      setSummary(null);
    } catch (error) {
      console.error('Error disconnecting Google Analytics:', error);
    }
  };

  const connectGoogleAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ga/auth-url`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Open OAuth popup
      const popup = window.open(response.data.authUrl, 'ga-auth', 'width=500,height=600');
      
      // Listen for messages from popup
      const messageHandler = async (event) => {
        if (event.origin !== (import.meta.env.VITE_API_URL || 'http://localhost:8888')) return;
        
        if (event.data.code) {
          // Get property ID from user
          const propertyId = prompt('Please enter your Google Analytics 4 Property ID:');
          
          if (companyId && propertyId) {
            try {
              await axios.post(
                `${import.meta.env.VITE_API_URL}/api/ga/oauth-callback`,
                { code: event.data.code, companyId, propertyId },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              
              // Refresh data after connection
              console.log('OAuth successful, refreshing connection status...');
              setTimeout(() => {
                checkConnectionStatus();
                fetchAnalyticsData();
                fetchSummary();
              }, 2000);
            } catch (error) {
              console.error('Error saving OAuth tokens:', error);
            }
          }
        } else if (event.data.error) {
          console.error('OAuth error:', event.data.error);
        }
        
        window.removeEventListener('message', messageHandler);
      };
      
      window.addEventListener('message', messageHandler);
      
      // Fallback: Check if popup is closed
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
        }
      }, 1000);
    } catch (error) {
      console.error('Error connecting Google Analytics:', error);
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Google Analytics Integration</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (loading || !companyId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">
          {!companyId ? 'Loading company data...' : 'Loading...'}
        </span>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Google Analytics Integration</h3>
        <p className="text-gray-600 mb-6">Connect your Google Analytics account to view detailed insights</p>
        <div className="space-y-4">
          <button
            onClick={connectGoogleAnalytics}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect Google Analytics
          </button>
          <div className="text-center space-y-2">
            <button
              onClick={checkConnectionStatus}
              className="text-sm text-blue-600 hover:text-blue-800 underline block mx-auto"
            >
              Check Connection Status
            </button>
            <button
              onClick={async () => {
                const token = localStorage.getItem('token');
                try {
                  const response = await axios.get(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:8888'}/api/ga/test/${companyId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  console.log('Company test data:', response.data);
                  alert(JSON.stringify(response.data, null, 2));
                } catch (error) {
                  console.error('Test failed:', error);
                  alert('Test failed: ' + (error.response?.data?.error || error.message));
                }
              }}
              className="text-sm text-green-600 hover:text-green-800 underline block mx-auto"
            >
              Test Company Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Google Analytics Dashboard</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Connected</span>
            <button
              onClick={disconnectGoogleAnalytics}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Disconnect
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Chart configurations
  const activeUsersChart = {
    labels: analyticsData.activeUsers.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [{
      label: 'Active Users',
      data: analyticsData.activeUsers.map(item => item.activeUsers),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  const sessionsChart = {
    labels: analyticsData.sessions.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [{
      label: 'Sessions',
      data: analyticsData.sessions.map(item => item.sessions),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 1
    }]
  };

  const trafficSourcesChart = {
    labels: analyticsData.trafficSources.map(item => item.source),
    datasets: [{
      data: analyticsData.trafficSources.map(item => item.sessions),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ]
    }]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Google Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          {connected && (
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="today">Today</option>
              <option value="7daysAgo">Last 7 days</option>
              <option value="30daysAgo">Last 30 days</option>
              <option value="90daysAgo">Last 90 days</option>
            </select>
          )}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {connected ? 'Connected' : 'Not Connected'}
            </span>
            {connected && (
              <button
                onClick={disconnectGoogleAnalytics}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="text-3xl font-bold text-blue-600">{summary.totalActiveUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Sessions</h3>
            <p className="text-3xl font-bold text-green-600">{summary.totalSessions}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Conversions</h3>
            <p className="text-3xl font-bold text-purple-600">{summary.totalConversions}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Top Source</h3>
            <p className="text-lg font-semibold text-gray-900">{summary.topTrafficSource}</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Active Users Over Time</h3>
          <Line data={activeUsersChart} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Sessions</h3>
          <Bar data={sessionsChart} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <Doughnut data={trafficSourcesChart} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Real-time Updates</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Last updated: {summary?.lastUpdated ? new Date(summary.lastUpdated).toLocaleString() : 'Never'}
            </p>
            <p className="text-sm text-gray-600">
              Update frequency: Every 5 minutes
            </p>
            <div className="mt-4">
              <button
                onClick={fetchAnalyticsData}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsDashboard;