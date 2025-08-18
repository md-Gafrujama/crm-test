import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../config/api';
import { cn } from "../../utils/cn";
import { useTheme } from "../../hooks/use-theme";
import { Calendar,Edit, Trash2, Bell, AlertCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import CombinedAlertReminder from './CombinedAlertReminder';

const AlertsAndReminderDisplay = ({ collapsed }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [expandedAlertId, setExpandedAlertId] = useState(null);
  const [showAddAlertReminderForm, setShowAddAlertReminderForm] = useState(false);

useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Please login to view alerts');
        }

        const response = await axios.get(`${API_BASE_URL}/api/alert`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Sort all alerts by date (newest first)
        const allAlerts = response.data.data
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setAlerts(allAlerts);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Failed to load alerts", {
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
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleEdit = (alert) => {
    setCurrentAlert(alert);
    setEditModalOpen(true);
  };

  const handleDelete = (alert) => {
    setCurrentAlert(alert);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/alert/${currentAlert.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setAlerts(alerts.filter(a => a.id !== currentAlert.id));
      toast.success("Alert deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    } catch (err) {
      toast.error(err.message || "Failed to delete alert", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const saveChanges = async (updatedAlert) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/api/alert/${updatedAlert.id}`,
        updatedAlert,
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'} }
      );

      setAlerts(alerts.map(a => a.id === updatedAlert.id ? response.data : a));
      toast.success("Alert updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    } catch (err) {
      toast.error(err.message || "Failed to update alert", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    } finally {
      setEditModalOpen(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
        <div className={cn(
          "transition-[margin] duration-300 ease-in-out min-h-screen dark:bg-gray-900",
          collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
        )}>
          <main className="p-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">Alerts & Reminders</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage your alerts and reminders in one place
                </p>
              </div>
              <button
                onClick={() => setShowAddAlertReminderForm(true)}
                className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-[#ff8633] hover:bg-[#e57328] text-white rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                Create New Alert
              </button>
            </div>

            {/* Alerts List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-[#ff8633]" />
                  Your Alerts ({alerts.length})
                </h2>
              </div>

              {alerts.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Bell className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-1">
                    No alerts found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Create your first alert to get started
                  </p>
                  <button
                    onClick={() => navigate('/create-alert')}
                    className="px-4 py-2 bg-[#ff8633] hover:bg-[#e57328] text-white rounded-lg transition-colors"
                  >
                    Create Alert
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div 
                        className="p-4 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleExpand(alert.id)}
                      >
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-200">
                              {alert.topic}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(alert.date)} at {alert.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(alert);
                            }}
                            className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 mr-2"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(alert);
                            }}
                            className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          {expandedAlertId === alert.id ? (
                            <ChevronUp className="h-5 w-5 ml-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 ml-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {expandedAlertId === alert.id && (
                        <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-800/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Reminder
                              </h4>
                              <p className="text-gray-800 dark:text-gray-200">
                                {alert.remainder || 'Not specified'}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Description
                              </h4>
                              <p className="text-gray-800 dark:text-gray-200">
                                {alert.description || 'Not specified'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

      {/* Edit Modal */}
      {editModalOpen && currentAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Edit Alert</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              saveChanges(currentAlert);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#ff8633] focus:border-[#ff8633] dark:bg-gray-700 dark:text-gray-200"
                    value={currentAlert.topic}
                    onChange={(e) => setCurrentAlert({...currentAlert, topic: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reminder
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#ff8633] focus:border-[#ff8633] dark:bg-gray-700 dark:text-gray-200"
                    value={currentAlert.remainder}
                    onChange={(e) => setCurrentAlert({...currentAlert, remainder: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#ff8633] focus:border-[#ff8633] dark:bg-gray-700 dark:text-gray-200"
                      value={currentAlert.date.split('T')[0]}
                      onChange={(e) => setCurrentAlert({...currentAlert, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#ff8633] focus:border-[#ff8633] dark:bg-gray-700 dark:text-gray-200"
                      value={currentAlert.time}
                      onChange={(e) => setCurrentAlert({...currentAlert, time: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#ff8633] focus:border-[#ff8633] dark:bg-gray-700 dark:text-gray-200"
                    value={currentAlert.description}
                    onChange={(e) => setCurrentAlert({...currentAlert, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff8633] hover:bg-[#e57328]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && currentAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Confirm Deletion</h2>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this alert?
              </p>
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{currentAlert.topic}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {formatDate(currentAlert.date)} at {currentAlert.time}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
        <CombinedAlertReminder 
                      isOpen={showAddAlertReminderForm} 
                      onClose={() => setShowAddAlertReminderForm(false)}
                    />
    </>
  );
};

export default AlertsAndReminderDisplay;