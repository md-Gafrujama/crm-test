import axios from 'axios';
import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config/api'; 

const Eye = lazy(() => import('lucide-react').then(module => ({ default: module.Eye })));
const EyeOff = lazy(() => import('lucide-react').then(module => ({ default: module.EyeOff })));
const ArrowLeft = lazy(() => import('lucide-react').then(module => ({ default: module.ArrowLeft })));
const Mail = lazy(() => import('lucide-react').then(module => ({ default: module.Mail })));
const User = lazy(() => import('lucide-react').then(module => ({ default: module.User })));
const Lock = lazy(() => import('lucide-react').then(module => ({ default: module.Lock })));

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({

      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    

//
    try {
      console.log('Attempting login with:', formData);
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out. Please try again.');
      }, 10000); 

      // Use environment variable for API URL
      const response = await axios.post(`${API_BASE_URL}/api/login`, 
        {
          email: formData.email,
          username: formData.username, 
          password: formData.password
        },
        {
          cancelToken: source.token
        });

      clearTimeout(timeoutId);

      const data = response.data;
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedIn', 'true'); 
        localStorage.setItem('userId', data.user?.id || '');
        localStorage.setItem('username', data.user?.username || '');
        const userType = data.userType || data.user?.role;
        localStorage.setItem('userType', userType);

        console.log('Stored user data:', {
          token: data.token,
          userId: data.user.id,
          username: data.user.username,
          userType
        });

        if (userType === 'admin') {
          navigate('/dashboard', { replace: true });
          window.location.reload();
        } else {
          navigate('/user-dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.name === 'AbortError' 
        ? "Request timed out. Please try again." 
        : error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back to Landing Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-[#ff8633] mb-6 transition-colors"
          whileHover={{ x: -5 }}
        >
          <Suspense fallback={<div className="w-4 h-4 bg-gray-300 rounded"></div>}>
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Suspense>
          Back to Home
        </motion.button>

        {/* Login Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Welcome Back
            </motion.h1>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Sign in to your weCRM account
            </motion.p>
          </div>

          <Suspense fallback={<div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"></div>}>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  autoComplete="email"
                />
              </div>

              {/* Username Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  autoComplete="username"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <motion.a
                  href="/forgetPassword"
                  className="text-[#ff8633] hover:text-orange-600 text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Forgot password?
                </motion.a>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-[#ff8633] text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 focus:ring-2 focus:ring-[#ff8633] focus:ring-offset-2 transition-all ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'
                }`}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>

              {/* Register Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <motion.a
                    href="/register"
                    className="text-[#ff8633] hover:text-orange-600 font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Sign up
                  </motion.a>
                </p>
              </div>
            </motion.form>
          </Suspense>
        </motion.div>

        {/* Additional Links */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-[#ff8633] hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#ff8633] hover:underline">Privacy Policy</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default React.memo(Login);

