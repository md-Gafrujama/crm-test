import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Users, Shield, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const TermsOfService = () => {
  const navigate = useNavigate();

  const terms = [
    {
      icon: Users,
      title: 'User Responsibilities',
      content: 'Users must provide accurate information, maintain account security, and use the service in compliance with applicable laws.'
    },
    {
      icon: Shield,
      title: 'Service Availability',
      content: 'We strive for 99.9% uptime but cannot guarantee uninterrupted service. Maintenance windows will be communicated in advance.'
    },
    {
      icon: FileText,
      title: 'Intellectual Property',
      content: 'All content, features, and functionality are owned by weCRM and protected by copyright, trademark, and other laws.'
    },
    {
      icon: AlertCircle,
      title: 'Limitation of Liability',
      content: 'Our liability is limited to the amount paid for the service. We are not liable for indirect or consequential damages.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-[#ff8633] hover:text-orange-600 mb-8 group"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </motion.button>

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Terms of <span className="text-[#ff8633]">Service</span>
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: December 2024
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using weCRM, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </motion.div>

          <div className="grid gap-8 mb-12">
            {terms.map((term, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ff8633] to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <term.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{term.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{term.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription and Billing</h2>
            <div className="space-y-4 text-gray-600">
              <p>• Subscriptions are billed monthly or annually based on your chosen plan</p>
              <p>• You can cancel your subscription at any time from your account settings</p>
              <p>• Refunds are provided within 14 days of initial purchase</p>
              <p>• Price changes will be communicated 30 days in advance</p>
            </div>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-gradient-to-r from-[#ff8633]/10 to-orange-200/20 rounded-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Questions about Terms?</h3>
            <p className="text-gray-600">
              Contact us at <a href="mailto:legal@wecrm.com" className="text-[#ff8633] hover:underline">legal@wecrm.com</a>
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;