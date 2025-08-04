import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { useTheme } from '../../../hooks/use-theme';
import { toast } from 'react-toastify';

const EditUser = ({ userId, onUpdate, onDelete, onClose }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isLocked, setIsLocked] = useState(user?.locked || false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}/api/userProfile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        toast.error(error.message || "Failed to Load User!", {
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

    fetchUser();
  }, [userId]);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });

  };

  useEffect(() => {
  if (user) {
    setIsLocked(user.locked || false);
  }
}, [user]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (
    !user.firstName ||
    !user.lastName ||
    !user.email ||
    !user.assignedWork ||
    !user.statusOfWork
  ) {
    setError('All fields are required.');
    return;
  }

  setSaving(true);

  try {
    const token = localStorage.getItem("token");

    const updateData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      assignedWork: user.assignedWork,
      statusOfWork: user.statusOfWork,
    };

    const response = await axios.put(
      `${API_BASE_URL}/api/userProfile/${userId}`, // Make sure userId is defined
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    onUpdate(response.data); // Callback after successful update
  } catch (err) {
    const errorMessage =
      err.response?.data?.error ||
      err.response?.data?.message ||
     toast.error(error.message || "Failed to Update user!", {
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

    setError(errorMessage);
  } finally {
    setSaving(false);
  }
};


const handleLock = async () => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `${API_BASE_URL}/api/userProfile/${userId}`,
      { locked: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setIsLocked(true);
    // Optional: update local user data
    setUser(prev => ({ ...prev, locked: true }));
  } catch (error) {
    toast.error(error.message || "Failed to Lock User!", {
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
    setIsLoading(false);
  }
};

const handleUnlock = async () => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `${API_BASE_URL}/api/userProfile/${userId}`,
      { locked: false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setIsLocked(false);
    // Optional: update local user data
    setUser(prev => ({ ...prev, locked: false }));
  } catch (error) {
    toast.error(error.message || "Failed to Unlock User!", {
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
    setIsLoading(false);
  }
};


  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/api/userProfile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onDelete(userId);
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        'Failed to delete user';
      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return null;

  return (
    <>
      <div className="flex justify-between items-center dark:bg-slate-800 border-b p-4">
        <h2 className="text-base font-semibold dark:text-gray-400 ">Edit User</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4 p-6 dark:bg-slate-800 shadow-lg">
        {/* First Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-400 mb-1" htmlFor="firstName">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            value={user.firstName || ''}
            onChange={handleChange}
            required
            className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-400 mb-1" htmlFor="lastName">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            value={user.lastName || ''}
            onChange={handleChange}
            required
            className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-400 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={user.email || ''}
            onChange={handleChange}
            required
            className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* StatusOfWork as simple input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-400 mb-1" htmlFor="statusOfWork">
            Status
          </label>
          <input
            id="statusOfWork"
            name="statusOfWork"
            value={user.statusOfWork || ''}
            onChange={handleChange}
            required
            className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Enter status (e.g. active, inactive)"
          />
        </div>

        {/* Assigned Work */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-400 mb-1" htmlFor="assignedWork">
            Current Assigned Work
          </label>
          <input
            id="assignedWork"
            name="assignedWork"
            value={user.assignedWork || ''}
            onChange={handleChange}
            required
            className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

    <div className="flex gap-2">
        <button
    onClick={handleLock}
    disabled={isLocked || isLoading || user?.role === 'admin'} // Optional: prevent locking admins
    className={`w-full px-4 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
      isLocked || isLoading || user?.role === 'admin'
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
    }`}
  >
    {isLoading ? 'Processing...' : 'Lock User'}
  </button>
     <button
    onClick={handleUnlock}
    disabled={!isLocked || isLoading}
    className={`w-full px-4 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
      !isLocked || isLoading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
    }`}
  >
    {isLoading ? 'Processing...' : 'Unlock User'}
  </button>
    </div>

        <button
          type="submit"
          disabled={saving || deleting}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={saving || deleting}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 mt-2"
        >
          {deleting ? 'Deleting...' : 'Delete User'}
        </button>
      </form>
    </>
  );
};

export default EditUser;










