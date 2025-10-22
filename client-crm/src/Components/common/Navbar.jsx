import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Users, BarChart3, Settings } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Features', path: '#features', icon: BarChart3 },
    { name: 'About', path: '/about', icon: Users },
    { name: 'Pricing', path: '/pricing', icon: Settings },
    { name: 'Contact', path: '/contact', icon: Settings }
  ];

  const isActive = (path) => {
    if (path.startsWith('#')) return false;
    return location.pathname === path;
  };

  return (
    <motion.nav 
      className="fixed w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div 
            className="text-2xl font-bold bg-gradient-to-r from-[#ff8633] to-orange-500 bg-clip-text text-transparent cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
          >
            weCRM
          </motion.div>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => item.path.startsWith('#') ? 
                  document.querySelector(item.path)?.scrollIntoView({ behavior: 'smooth' }) : 
                  navigate(item.path)
                }
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  isActive(item.path) 
                    ? 'text-[#ff8633] bg-orange-50' 
                    : 'text-gray-700 hover:text-[#ff8633] hover:bg-orange-50'
                }`}
                whileHover={{ y: -2 }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="hidden md:flex space-x-4">
            <motion.button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-[#ff8633] border-2 border-[#ff8633] rounded-lg hover:bg-[#ff8633] hover:text-white transition-all font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-gradient-to-r from-[#ff8633] to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-white border-t border-gray-100"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.path.startsWith('#')) {
                    document.querySelector(item.path)?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate(item.path);
                  }
                  setIsMenuOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-all ${
                  isActive(item.path) 
                    ? 'text-[#ff8633] bg-orange-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-[#ff8633] border-2 border-[#ff8633] rounded-lg font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-gradient-to-r from-[#ff8633] to-orange-500 text-white rounded-lg font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;