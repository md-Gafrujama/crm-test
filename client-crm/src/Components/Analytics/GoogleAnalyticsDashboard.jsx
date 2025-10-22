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

const GoogleAnalyticsDashboard = ({ companyId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [dateRange, setDateRange] = useState('7daysAgo');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3333');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join-company', companyId);
    });

    newSocket.on('analytics-update', (data) => {
      setSummary(data.summary);
      setAnalyticsData(data.fullData);
    });

    return () => newSocket.close();
  }, [companyId]);

  useEffect(() => {
    fetchAnalyticsData();
    fetchSummary();
  }, [companyId, dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ga/data/${companyId}?dateRange=${dateRange}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalyticsData(response.data);
      setConnected(true);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setConnected(false);
    } finally {
      setLoading(false);
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

  const connectGoogleAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ga/auth-url`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Open OAuth popup
      const popup = window.open(response.data.authUrl, 'ga-auth', 'width=500,height=600');
      
      // Listen for popup completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // Refresh data after connection
          setTimeout(() => {
            fetchAnalyticsData();
            fetchSummary();
          }, 2000);
        }
      }, 1000);
    } catch (error) {
      console.error('Error connecting Google Analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!connected || !analyticsData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Google Analytics Integration</h3>
        <p className="text-gray-600 mb-6">Connect your Google Analytics account to view detailed insights</p>
        <button
          onClick={connectGoogleAnalytics}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Connect Google Analytics
        </button>
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
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${socket?.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {socket?.connected ? 'Live' : 'Disconnected'}
            </span>
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