import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api'; 
import { useTheme } from '../../../hooks/use-theme';
import { Calendar, Clock, Bell, FileText, AlertCircle } from 'lucide-react';

const ReactToastifyCSS = lazy(() => import('react-toastify/dist/ReactToastify.css'));

const AlertsandReminder = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({
    alerttopic:'',
    reminder:'',
    alertdate:'',
    remindertime:'',
    description:'',
  });

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmitAlert = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to add alerts and reminder", {
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
        navigate('/login');
        return;
      }

      const backendData = {
        alerttopic: formData.alerttopic,
        reminder: formData.reminder,
        alertdate: formData.alertdate,
        remindertime: formData.remindertime,
        description: formData.description,
      };
      console.log(backendData)
      const response = await axios.post(`${API_BASE_URL}/api/alert`, 
        backendData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success("Alert created successfully!", {
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
          const userType = localStorage.getItem('userType'); 
   if (userType === 'user') {
   setTimeout(() => navigate("/userProfile"), 2000);
   window.location.reload();
  } else if (userType === 'admin') {
    setTimeout(() => navigate("/dashboard"), 2000);
  } 
    } catch (err) {
      console.error("Alert creation error:", err);
      toast.error("Failed to create Alert" || err.message , {
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <Suspense fallback={
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      }>
        {/* Simple Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create Alert</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Set up reminders and notifications</p>
        </div>

        {/* Simple Form */}
        <form onSubmit={handleSubmitAlert} className="space-y-4">
          {/* Alert Topic */}
          <div>
            <label htmlFor="alerttopic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alert Topic
            </label>
            <input
              type="text"
              id="alerttopic"
              name="alerttopic"
              value={formData.alerttopic}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter alert topic..."
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="alertdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                id="alertdate"
                name="alertdate"
                value={formData.alertdate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="remindertime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                id="remindertime"
                name="remindertime"
                value={formData.remindertime || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Reminder */}
          <div>
            <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reminder Type
            </label>
            <input
              type="text"
              id="reminder"
              name="reminder"
              value={formData.reminder}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Email, SMS, Push notification..."
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Add detailed description for your alert..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding Alert...
              </div>
            ) : (
              'Create Alert & Reminder'
            )}
          </button>
        </form>
      </Suspense>
    </div>
  );
};

export default React.memo(AlertsandReminder);
