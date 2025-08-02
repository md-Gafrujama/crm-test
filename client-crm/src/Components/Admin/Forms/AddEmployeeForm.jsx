import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { useTheme } from '../../../hooks/use-theme';

const AddEmployeeForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    username: '',
    email: '',
    phone: '',
    whatsappphone: '',
    joiningdate: '',
    status: 'active',
    department: '',
    role: '',
    profilePhoto: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const departmentRoles = {
    'Sales': ['Field Sales', 'Inside Sales', 'B2B', 'B2C'],
    'Marketing': ['Content', 'Performance', 'SEO', 'Social Media', 'Branding'],
    'SaaS': ['Product Manager', 'Customer Success', 'Technical Support', 'Implementation'],
    'Technology': ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'AI/ML', 'QA', 'UI/UX'],
  };

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'department' && { role: '' })
    }));
  }, []);

  // closing panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.warning("Image size should be less than 2MB", {
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
      return;
    }

    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      const token = localStorage.token;
      for (const [key, value] of Object.entries(formData)) {
        if (key !== 'profilePhoto' && value != null) {
          formDataToSend.append(key, value);
        }
      }

      if (formData.profilePhoto instanceof File) {
        formDataToSend.append('profilePhoto', formData.profilePhoto);
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/employee`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );


      toast.success("Account created successfully!", {
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
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (e) {
      console.error("Registration error:", e);
      toast.error(e.message || "Registration failed. Please try again", {
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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={`fixed inset-y-0 right-0 w-full max-w-xl bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold dark:text-gray-300">Add New Employee</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center min-h-screen p-5">
              <Suspense fallback={
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
                  </div>
                </div>
              }>
                <form
                  onSubmit={handleSubmit}
                  className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl  transition-all"
                >


                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-400 mb-2">Employee Management</h2>
                    <p className="text-gray-500 dark:text-gray-400">Add Employees</p>
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="mb-6 flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-gray-200">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-[#ff8633] text-white rounded-lg hover:bg-[#e6732b] transition">
                        Upload Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="dark:text-gray-400 w-full text-center px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        placeholder="John"
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        id="middleName"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        className="dark:text-gray-400 w-full px-4 text-center py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        placeholder="Doe"
                        autoComplete="family-name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="dark:text-gray-400 w-full px-4 text-center py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        placeholder="Doe"
                        autoComplete="family-name"
                      />
                    </div>
                  </div>


                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Email (Official)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="dark:text-gray-400 w-full px-4  text-center py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="mb-4">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="dark:text-gray-400 w-full px-4  text-center py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        placeholder="+1 (123) 456-7890"
                        autoComplete="tel"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="whatsappphone" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Whatsapp Number
                      </label>
                      <input
                        type="tel"
                        id="whatsappphone"
                        name="whatsappphone"
                        value={formData.whatsappphone}
                        onChange={handleChange}
                        className="dark:text-gray-400 w-full px-4  text-center py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        placeholder="+1 (123) 456-7890"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="dark:text-gray-400 w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    >
                      <option value="">Select Department</option>
                      {Object.keys(departmentRoles).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      disabled={!formData.department}
                      className="dark:text-gray-400 w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    >
                      <option value="">Select Role</option>
                      {formData.department && departmentRoles[formData.department].map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>


                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-400 mb-3 text-center">Status</label>
                    <div className="flex justify-center space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={formData.status === 'active'}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${formData.status === 'active' ? 'border-[#ff8633]' : 'border-gray-300'}`}>
                          {formData.status === 'active' && <div className="w-3 h-3 rounded-full bg-[#ff8633]"></div>}
                        </div>
                        <span className="text-gray-700 dark:text-gray-400">Active</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="inactive"
                          checked={formData.status === 'inactive'}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${formData.status === 'inactive' ? 'border-[#ff8633]' : 'border-gray-300'}`}>
                          {formData.status === 'inactive' && <div className="w-3 h-3 rounded-full bg-[#ff8633]"></div>}
                        </div>
                        <span className="text-gray-700 dark:text-gray-400">Inactive</span>
                      </label>
                    </div>
                  </div>


                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div className="mb-4">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="dark:text-gray-400 w-full text-center px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        placeholder="john_doe"
                        autoComplete="username"
                      />
                    </div>

                    <div className="relative mb-4">
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Joining Date
                      </label>
                      <input
                        type="date"
                        id="joiningdate"
                        name="joiningdate"
                        value={formData.joiningdate}
                        onChange={handleChange}
                        required
                        className="dark:text-gray-400 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all pr-12"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>


                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                  >
                    {isSubmitting ? 'Adding Employee...' : 'Add Employee'}
                  </button>

                </form>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(AddEmployeeForm);