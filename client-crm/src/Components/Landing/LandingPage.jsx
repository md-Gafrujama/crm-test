import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Users, BarChart3, Shield, Zap, Star, Menu, X, Play, CheckCircle, TrendingUp, Clock, Globe, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: Users, title: 'Smart Lead Management', desc: 'AI-powered lead scoring and automated follow-ups', color: 'from-blue-500 to-cyan-500' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time dashboards with predictive insights', color: 'from-purple-500 to-pink-500' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption and compliance', color: 'from-green-500 to-emerald-500' },
    { icon: Zap, title: 'Workflow Automation', desc: 'Save 10+ hours weekly with smart automation', color: 'from-orange-500 to-red-500' },
    { icon: TrendingUp, title: 'Sales Forecasting', desc: 'Predict revenue with 95% accuracy', color: 'from-indigo-500 to-blue-500' },
    { icon: Globe, title: 'Multi-Channel Integration', desc: 'Connect all your tools in one platform', color: 'from-teal-500 to-cyan-500' }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Users', icon: Users },
    { number: '99.9%', label: 'Uptime', icon: Shield },
    { number: '40%', label: 'Sales Increase', icon: TrendingUp },
    { number: '24/7', label: 'Support', icon: Clock }
  ];

  const testimonials = [
    { 
      name: 'Sarah Johnson', 
      role: 'Sales Manager at TechCorp', 
      text: 'weCRM transformed our sales process. We saw a 40% increase in conversions within 3 months!',
      avatar: 'SJ',
      company: 'TechCorp'
    },
    { 
      name: 'Mike Chen', 
      role: 'CEO at StartupXYZ', 
      text: 'The automation features saved us 15 hours per week. Best investment we\'ve made!',
      avatar: 'MC',
      company: 'StartupXYZ'
    },
    { 
      name: 'Lisa Rodriguez', 
      role: 'Marketing Director at GrowthCo', 
      text: 'Finally, a CRM that actually helps us understand our customers better.',
      avatar: 'LR',
      company: 'GrowthCo'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#ff8633]/20 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl"></div>
      </div>
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#ff8633]/10 to-orange-200/20 backdrop-blur-sm rounded-full text-[#ff8633] font-semibold mb-8 border border-orange-200/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-5 h-5 mr-2 fill-current" />
            Trusted by 10,000+ businesses worldwide
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-none tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            The Future of{' '}
            <span className="bg-gradient-to-r from-[#ff8633] via-orange-500 to-red-500 bg-clip-text text-transparent">
              Customer Success
            </span>
          </motion.h1>
          
          <motion.p
            className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transform your business with AI-powered CRM that converts 40% more leads, 
            automates workflows, and delivers insights that drive growth.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              onClick={() => navigate('/register')}
              className="group px-10 py-5 bg-gradient-to-r from-[#ff8633] to-orange-500 text-white rounded-2xl text-xl font-bold hover:shadow-2xl hover:shadow-orange-500/25 transition-all flex items-center justify-center"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              className="group px-10 py-5 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 rounded-2xl text-xl font-bold hover:border-[#ff8633] hover:text-[#ff8633] hover:shadow-xl transition-all flex items-center justify-center"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Hero Image/Visual */}
          <motion.div
            className="relative max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="bg-gradient-to-br from-white/90 to-gray-100/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-4 bg-gradient-to-r from-[#ff8633] to-orange-400 rounded-full"></div>
                <div className="h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                <div className="h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-6 bg-gray-100 rounded-lg w-1/2"></div>
                <div className="h-6 bg-gray-100 rounded-lg w-2/3"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#ff8633] to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-[#ff8633] to-orange-500 bg-clip-text text-transparent"> Scale Fast</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that work together to accelerate your growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join 10,000+ Happy Customers
            </h2>
            <p className="text-xl text-gray-600">
              See why businesses choose weCRM to accelerate their growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ff8633] to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#ff8633] via-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            14-day free trial • No credit card required
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to 10x Your Sales?
          </motion.h2>
          <motion.p
            className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join 10,000+ businesses using weCRM to close more deals, save time, and grow faster than ever before.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-[#ff8633] rounded-xl text-lg font-bold hover:bg-gray-100 transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
            <motion.button
              className="px-8 py-4 border-2 border-white text-white rounded-xl text-lg font-semibold hover:bg-white hover:text-[#ff8633] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;