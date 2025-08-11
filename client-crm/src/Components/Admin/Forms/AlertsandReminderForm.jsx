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
    <div className="flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8 mx-auto"></div>
          </div>
        </div>
      }>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create Alert</h2>
            </div>
            <p className="text-purple-100 text-sm">Set up reminders and notifications</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitAlert} className="p-6 space-y-6">
            {/* Alert Topic */}
            <div className="space-y-2">
              <label htmlFor="alerttopic" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <AlertCircle className="h-4 w-4 text-purple-600" />
                Alert Topic
              </label>
              <input
                type="text"
                id="alerttopic"
                name="alerttopic"
                value={formData.alerttopic}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter alert topic..."
              />
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="alertdate" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Date
                </label>
                <input
                  type="date"
                  id="alertdate"
                  name="alertdate"
                  value={formData.alertdate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="remindertime" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  Time
                </label>
                <input
                  type="time"
                  id="remindertime"
                  name="remindertime"
                  value={formData.remindertime || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Reminder */}
            <div className="space-y-2">
              <label htmlFor="reminder" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Bell className="h-4 w-4 text-orange-600" />
                Reminder Type
              </label>
              <input
                type="text"
                id="reminder"
                name="reminder"
                value={formData.reminder}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="e.g., Email, SMS, Push notification..."
              />
            </div>

            {/* Description - Larger Area */}
            <div className="space-y-2">
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4 text-indigo-600" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                placeholder="Add detailed description for your alert..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform active:scale-95 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Alert...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Bell className="h-5 w-5" />
                  Create Alert & Reminder
                </div>
              )}
            </button>
          </form>
        </div>
      </Suspense>
    </div>
  );
};

export default React.memo(AlertsandReminder);
