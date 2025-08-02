import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api'; 
import { useTheme } from '../../../hooks/use-theme';

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
    <>

   <div className="flex items-center justify-center  p-0">
     
                  <Suspense fallback={
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
                      </div>
                    </div>
                  }>
                    <form
                      onSubmit={handleSubmitAlert}
                      className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl  transition-all"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-xl lg:text-3xl font-bold text-gray-800 dark:text-gray-400 mb-2">Alerts And Reminder</h2>
                      </div>
  
                       <div className="mb-4">
                        <label htmlFor="alerttopic" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                         Alert Topic
                        </label>
                        <input
                          type="text"
                          id="alerttopic"
                          name="alerttopic"
                          value={formData.alerttopic}
                          onChange={handleChange}
                          required
                          className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder="alerttopic"
                          autoComplete="alerttopic"
                        />
                      </div>
  
  
  
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="mb-4">
                        <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                          Reminder
                        </label>
                        <input
                          type="text"
                          id="reminder"
                          name="reminder"
                          value={formData.reminder}
                          onChange={handleChange}
                          required
                          className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                          placeholder="reminder"
                          autoComplete="reminder"
                        />
                      </div>
                        <div>
                          <label htmlFor="alertdate" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            id="alertdate"
                            name="alertdate"
                            value={formData.alertdate}
                            onChange={handleChange}
                            required
                            className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 text-center py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                            placeholder=""
                            autoComplete="alertdate"
                          />
                        </div>
                      </div>
  
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="mb-4">
    <label htmlFor="remindertime" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
      Reminder Time:
    </label>
    <input
      type="time"
      id="remindertime"
      name="remindertime"
      value={formData.remindertime || ''}
      onChange={handleChange}
      className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
      required
    />
  </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                            placeholder="description"
                            autoComplete="description"
                          />
                        </div>
                      </div>
  
  
  
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                      >
                        {isSubmitting ? 'Adding the Alert...' : 'Add Alert and Reminder'}
                      </button>
                    </form>
                  </Suspense>
    </div>
    </>
  );
};

export default React.memo(AlertsandReminder);