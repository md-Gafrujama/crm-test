// import React, { useState,useRef,useEffect, lazy, Suspense } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { API_BASE_URL } from '../../../config/api'; 
// import { useTheme } from '../../../hooks/use-theme';

// // Lazy load components and icons
// const Eye = lazy(() => import('lucide-react').then(module => ({ default: module.Eye })));
// const EyeOff = lazy(() => import('lucide-react').then(module => ({ default: module.EyeOff })));
// const ReactToastifyCSS = lazy(() => import('react-toastify/dist/ReactToastify.css'));

// const Sign = ({isOpen,onClose}) => {
//   const navigate = useNavigate();
//   const panelRef = useRef(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { theme, setTheme } = useTheme();
  
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     username: '',
//     email: '',
//     password: '',
//     phone: '',
//     role: 'user',
//     profilePhoto: null
//   });
//   const [previewImage, setPreviewImage] = useState(null);

//   const handleChange = React.useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }, []);

//   // closing panel
//     useEffect(() => {
//       const handleClickOutside = (event) => {
//         if (panelRef.current && !panelRef.current.contains(event.target)) {
//           onClose();
//         }
//       };
  
//       if (isOpen) {
//         document.addEventListener('mousedown', handleClickOutside);
//       }
  
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//       };
//     }, [isOpen, onClose]);

//       // Prevent scrolling when panel is open
//       useEffect(() => {
//         if (isOpen) {
//           document.body.style.overflow = 'hidden';
//         } else {
//           document.body.style.overflow = 'auto';
//         }
    
//         return () => {
//           document.body.style.overflow = 'auto';
//         };
//       }, [isOpen]);
    
     

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size > 2 * 1024 * 1024) { 
//       toast.warning("Image size should be less than 2MB", {
//                     position: "top-right",
//                     autoClose: 5000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: theme === 'dark' ? 'dark' : 'light',
//                     style: { fontSize: '1.2rem' }, 
//                   });
//       return;
//     }
    
//     if (file) {
//       setFormData(prev => ({ ...prev, profilePhoto: file }));
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);
//   const token = localStorage.getItem('token');


//   try {
//     const formDataToSend = new FormData();

//     for (const [key, value] of Object.entries(formData)) {
//       if (key !== 'profilePhoto' && value != null) {
//         formDataToSend.append(key, value);
//       }
//     }

//     if (formData.profilePhoto instanceof File) {
//       formDataToSend.append('profilePhoto', formData.profilePhoto);
//     }

//     const response = await axios.post(`${API_BASE_URL}/api/addUser`, 
//       formDataToSend,
//       {
//           headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data' 
//         }
//     });

//     toast.success("Account created successfully!", {
//                   position: "top-right",
//                   autoClose: 5000,
//                   hideProgressBar: false,
//                   closeOnClick: true,
//                   pauseOnHover: true,
//                   draggable: true,
//                   progress: undefined,
//                   theme: theme === 'dark' ? 'dark' : 'light',
//                   style: { fontSize: '1.2rem' }, 
//                 });
//     setTimeout(() => navigate("/dashboard"), 2000);

//   } catch (e) {
//     console.error("Registration error:", e);
//     toast.error(e.message || "Registration failed. Please try again", {
//                   position: "top-right",
//                   autoClose: 5000,
//                   hideProgressBar: false,
//                   closeOnClick: true,
//                   pauseOnHover: true,
//                   draggable: true,
//                   progress: undefined,
//                   theme: theme === 'dark' ? 'dark' : 'light',
//                   style: { fontSize: '1.2rem' }, 
//                 });
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//  if (!isOpen) return null;

//   return (
//     <>
//     <div 
//         className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
//         onClick={onClose}
//       />
//        <div 
//         ref={panelRef}
//         className={`fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//      <div className="h-full flex flex-col">
//        <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold dark:text-gray-300">Add New User</h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//    <div className="flex-1 overflow-y-auto p-6">
//     <div className="flex items-center justify-center min-h-screen p-5">
//       <Suspense fallback={
//         <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
//           </div>
//         </div>
//       }>
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl  transition-all"
//         >


//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-400 mb-2">Create Account</h2>
//             <p className="text-gray-500 dark:text-gray-400">Add Users</p>
//           </div>

//           {/* Profile Photo Upload */}
//           <div className="mb-6 flex flex-col items-center">
//             <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-gray-200">
//               {previewImage ? (
//                 <img 
//                   src={previewImage} 
//                   alt="Preview" 
//                   className="w-full h-full object-cover"
//                   loading="lazy"
//                 />
//               ) : (
//                 <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                   <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//                   </svg>
//                 </div>
//               )}
//             </div>
//             <label className="cursor-pointer">
//               <span className="px-4 py-2 bg-[#ff8633] text-white rounded-lg hover:bg-[#e6732b] transition">
//                 Upload Photo
//               </span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </label>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
//                 First Name
//               </label>
//               <input
//                 type="text"
//                 id="firstName"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 required
//                 className="dark:text-gray-400 w-full text-center px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                 placeholder="John"
//                 autoComplete="given-name"
//               />
//             </div>
//             <div>
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
//                 Last Name
//               </label>
//               <input
//                 type="text"
//                 id="lastName"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//                 className="dark:text-gray-400 w-full px-4 text-center py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                 placeholder="Doe"
//                 autoComplete="family-name"
//               />
//             </div>
//           </div>


//  <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="dark:text-gray-400 w-full px-4  text-center py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//               placeholder="your@email.com"
//               autoComplete="email"
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="dark:text-gray-400 w-full px-4  text-center py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//               placeholder="+1 (123) 456-7890"
//               autoComplete="tel"
//             />
//           </div>
         

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-800 dark:text-gray-400 mb-3 text-center">Account Type</label>
//             <div className="flex justify-center space-x-6">
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="role"
//                   value="user"
//                   checked={formData.role === 'user'}
//                   onChange={handleChange}
//                   className="hidden"
//                 />
//                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${formData.role === 'user' ? 'border-[#ff8633]' : 'border-gray-300'}`}>
//                   {formData.role === 'user' && <div className="w-3 h-3 rounded-full bg-[#ff8633]"></div>}
//                 </div>
//                 <span className="text-gray-700 dark:text-gray-400">User</span>
//               </label>
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="role"
//                   value="admin"
//                   checked={formData.role === 'admin'}
//                   onChange={handleChange}
//                   className="hidden"
//                 />
//                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${formData.role === 'admin' ? 'border-[#ff8633]' : 'border-gray-300'}`}>
//                   {formData.role === 'admin' && <div className="w-3 h-3 rounded-full bg-[#ff8633]"></div>}
//                 </div>
//                 <span className="text-gray-700 dark:text-gray-400">Admin</span>
//               </label>
//             </div>
//           </div>


// <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
//  <div className="mb-4">
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="dark:text-gray-400 w-full text-center px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//               placeholder="john_doe"
//               autoComplete="username"
//             />
//           </div>

//           <div className="relative mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
//               Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               name="password"
//               placeholder="••••••••"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="dark:text-gray-400 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all pr-12"
//               autoComplete="new-password"
//             />
//             <Suspense fallback={<div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-300 rounded-full"></div>}>
//               <button
//                 type="button"
//                 className="absolute right-3 top-3/4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700"
//                 onClick={() => setShowPassword(!showPassword)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//               </button>
//             </Suspense>
//           </div>
// </div>
         

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${
//               isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
//             }`}
//           >
//             {isSubmitting ? 'Creating Account...' : 'Sign Up'}
//           </button>
          
//         </form>
//       </Suspense>
//     </div>
// </div>
// </div>
// </div>
//     </>
//   );
// };

// export default React.memo(Sign);

import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api'; 
import { useTheme } from '../../../hooks/use-theme';

// Lazy load components and icons
const Eye = lazy(() => import('lucide-react').then(module => ({ default: module.Eye })));
const EyeOff = lazy(() => import('lucide-react').then(module => ({ default: module.EyeOff })));

const Sign = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    profilePhoto: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    // Username validation (no spaces, special characters)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (formData.username && !usernameRegex.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Closing panel with escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
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
    
    if (!file) return;
    
    // File size validation (2MB)
    if (file.size > 2 * 1024 * 1024) { 
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
    
    // File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.warning("Please upload only image files (JPEG, PNG, GIF, WebP)", {
        position: "top-right",
        autoClose: 5000,
        theme: theme === 'dark' ? 'dark' : 'light',
        style: { fontSize: '1.2rem' }, 
      });
      return;
    }
    
    setFormData(prev => ({ ...prev, profilePhoto: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.onerror = () => {
      toast.error("Error reading file", {
        position: "top-right",
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      role: 'user',
      profilePhoto: null
    });
    setPreviewImage(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting", {
        position: "top-right",
        autoClose: 5000,
        theme: theme === 'dark' ? 'dark' : 'light',
        style: { fontSize: '1.2rem' }, 
      });
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    // Check if token exists
    if (!token) {
      toast.error("Authentication token not found. Please login again.", {
        position: "top-right",
        autoClose: 5000,
        theme: theme === 'dark' ? 'dark' : 'light',
        style: { fontSize: '1.2rem' }, 
      });
      setIsSubmitting(false);
      navigate('/login');
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form data except profilePhoto
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'profilePhoto' && value != null && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      // Append profile photo if exists
      if (formData.profilePhoto instanceof File) {
        formDataToSend.append('profilePhoto', formData.profilePhoto);
      }

      // Enhanced axios configuration
      const response = await axios.post(`${API_BASE_URL}/api/addUser`, 
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
          timeout: 30000, // 30 second timeout
          validateStatus: (status) => status < 500, // Don't throw for 4xx errors
        }
      );

      // Handle successful response
      if (response.status === 200 || response.status === 201) {
        resetForm();
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
        
        setTimeout(() => {
          onClose();
          navigate("/dashboard");
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Failed to create account');
      }

    } catch (error) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again";
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            errorMessage = data?.message || "Invalid data provided. Please check your inputs.";
            break;
          case 401:
            errorMessage = "Authentication failed. Please login again.";
            localStorage.removeItem('token');
            setTimeout(() => navigate('/login'), 2000);
            break;
          case 403:
            errorMessage = "You don't have permission to create users.";
            break;
          case 409:
            errorMessage = data?.message || "User already exists. Please try with different credentials.";
            // Clear the conflicting fields
            if (data?.field === 'email') {
              setErrors(prev => ({ ...prev, email: 'Email already exists' }));
            } else if (data?.field === 'username') {
              setErrors(prev => ({ ...prev, username: 'Username already exists' }));
            }
            break;
          case 413:
            errorMessage = "File size too large. Please upload a smaller image.";
            break;
          case 422:
            errorMessage = "Validation error. Please check your inputs.";
            if (data?.errors) {
              setErrors(data.errors);
            }
            break;
          case 429:
            errorMessage = "Too many requests. Please try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = data?.message || `Server error (${status}). Please try again.`;
        }
      } else if (error.request) {
        // Network error or CORS issue
        if (error.code === 'ECONNABORTED') {
          errorMessage = "Request timeout. Please check your connection and try again.";
        } else if (error.message.toLowerCase().includes('cors')) {
          errorMessage = "Connection blocked. Please contact administrator about CORS configuration.";
        } else if (error.message.toLowerCase().includes('network')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = "Unable to connect to server. Please check your internet connection.";
        }
      } else if (error.code === 'ERR_CANCELED') {
        errorMessage = "Request was cancelled.";
      } else {
        errorMessage = error.message || "An unexpected error occurred.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 7000,
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
        aria-hidden="true"
      />
      <div 
        ref={panelRef}
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
      >
        <div className="h-full flex flex-col">
          <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 id="panel-title" className="text-xl font-semibold dark:text-gray-300">Add New User</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close panel"
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
            <Suspense fallback={
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-6 mx-auto"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-8 mx-auto"></div>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            }>
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl transition-all"
                noValidate
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-400 mb-2">Create Account</h2>
                  <p className="text-gray-500 dark:text-gray-400">Add Users</p>
                </div>

                {/* Profile Photo Upload */}
                <div className="mb-6 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-gray-200 dark:border-slate-600">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 bg-[#ff8633] text-white rounded-lg hover:bg-[#e6732b] transition duration-200">
                      Upload Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className={`dark:text-gray-400 w-full text-center px-4 py-3 rounded-lg border transition-all ${
                        errors.firstName 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-slate-700 focus:ring-[#ff8633] focus:border-transparent'
                      } dark:bg-slate-800 focus:outline-none focus:ring-2`}
                      placeholder="John"
                      autoComplete="given-name"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className={`dark:text-gray-400 w-full px-4 text-center py-3 rounded-lg border transition-all ${
                        errors.lastName 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-slate-700 focus:ring-[#ff8633] focus:border-transparent'
                      } dark:bg-slate-800 focus:outline-none focus:ring-2`}
                      placeholder="Doe"
                      autoComplete="family-name"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className={`dark:text-gray-400 w-full px-4 text-center py-3 rounded-lg border transition-all ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-slate-700 focus:ring-[#ff8633] focus:border-transparent'
                    } dark:bg-slate-800 focus:outline-none focus:ring-2`}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

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
                    disabled={isSubmitting}
                    className="dark:text-gray-400 w-full px-4 text-center py-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    placeholder="+1 (123) 456-7890"
                    autoComplete="tel"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-400 mb-3 text-center">Account Type</label>
                  <div className="flex justify-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={formData.role === 'user'}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${formData.role === 'user' ? 'border-[#ff8633]' : 'border-gray-300 dark:border-slate-600'}`}>
                        {formData.role === 'user' && <div className="w-3 h-3 rounded-full bg-[#ff8633]"></div>}
                      </div>
                      <span className="text-gray-700 dark:text-gray-400">User</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${formData.role === 'admin' ? 'border-[#ff8633]' : 'border-gray-300 dark:border-slate-600'}`}>
                        {formData.role === 'admin' && <div className="w-3 h-3 rounded-full bg-[#ff8633]"></div>}
                      </div>
                      <span className="text-gray-700 dark:text-gray-400">Admin</span>
                    </label>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className={`dark:text-gray-400 w-full text-center px-4 py-3 rounded-lg border transition-all ${
                        errors.username 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-slate-700 focus:ring-[#ff8633] focus:border-transparent'
                      } dark:bg-slate-800 focus:outline-none focus:ring-2`}
                      placeholder="john_doe"
                      autoComplete="username"
                    />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                  </div>

                  <div className="relative mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Password *
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className={`dark:text-gray-400 w-full px-4 py-3 rounded-lg border transition-all pr-12 ${
                        errors.password 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-slate-700 focus:ring-[#ff8633] focus:border-transparent'
                      } dark:bg-slate-800 focus:outline-none focus:ring-2`}
                      autoComplete="new-password"
                    />
                    <Suspense fallback={<div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-300 rounded-full"></div>}>
                      <button
                        type="button"
                        className="absolute right-3 top-3/4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 p-1 rounded"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </Suspense>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-95 transform duration-200 ${
                    isSubmitting 
                      ? 'opacity-75 cursor-not-allowed' 
                      : 'hover:from-[#e6732b] hover:to-[#e6732b] cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Sign Up'
                  )}
                </button>
                
              </form>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Sign);
