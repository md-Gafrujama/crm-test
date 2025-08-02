import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
const ReactToastifyCSS = lazy(() => import('react-toastify/dist/ReactToastify.css'));
import { API_BASE_URL } from '../../../config/api'; 
import { Header } from '../common/Header';
import { Sidebar,useSidebar } from '../common/sidebar';
import { useTheme } from '../../../hooks/use-theme';

const RealtimeTracking = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);



  const handlegobacktodashboard = () => {
    navigate('/dashboard');
  };
const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const body = {
        phoneNumber: formData.phone,
      };

      const response = await axios.post(`${API_BASE_URL}/api/realtimetracking`, {
        body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      toast.success("Realtime Tracking done Successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme === 'dark' ? 'dark' : 'light',
      style: { fontSize: '1.2rem' }, // Increased font size
    });
    const userType = localStorage.getItem('userType'); 
   if (userType === 'user') {
   setTimeout(() => navigate("/userProfile"), 2000);
   window.location.reload();
  } else if (userType === 'admin') {
    setTimeout(() => navigate("/dashboard"), 2000);
  }     
    } catch (e) {
      console.error("Reailtime Tracking Failed - Full Error:", e);
      console.error("Error details:", {
        message: e.message,
        stack: e.stack,
      });
            toast.error(e.message || "Realtime Traking Failed, Please try again!", {
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
    <>
    <div className="flex items-center justify-center">
      <Suspense fallback={
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
          </div>
        </div>
      }>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl dark:border dark:border-gray-700 border border-gray-100 transition-all hover:shadow-2xl"
        >
          <div className="absolute top-4 right-4">
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-400 mb-2">Realtime Tracking</h2>
          </div>

            <div className='mb-10'>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-3 rounded-lg text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="+1 (123) 456-7890"
                autoComplete="tel"
              />
            </div>




          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
          >
            {isSubmitting ? 'Reailtime Tracking ...' : 'Track'}
          </button>
        </form>
      </Suspense>
    </div>
    </>
  );
};

export default React.memo(RealtimeTracking);