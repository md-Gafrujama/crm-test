import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: 'We collect information you provide directly, such as account details, contact information, and usage data to improve our services.'
    },
    {
      icon: Eye,
      title: 'How We Use Information',
      content: 'Your information helps us provide, maintain, and improve our services, communicate with you, and ensure security.'
    },
    {
      icon: Shield,
      title: 'Information Sharing',
      content: 'We do not sell your personal information. We only share data with trusted partners to provide our services.'
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: 'We implement industry-standard security measures to protect your data from unauthorized access and breaches.'
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
              Privacy <span className="text-[#ff8633]">Policy</span>
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: December 2024
            </p>
          </motion.div>

          <div className="grid gap-8 mb-12">
            {sections.map((section, index) => (
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
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    <p className="text-gray-600 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights</h2>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>Access:</strong> You can request access to your personal information</p>
              <p>• <strong>Correction:</strong> You can request correction of inaccurate data</p>
              <p>• <strong>Deletion:</strong> You can request deletion of your personal information</p>
              <p>• <strong>Portability:</strong> You can request a copy of your data in a portable format</p>
            </div>
          </motion.div>

          <motion.div
            className="text-center mt-12 p-6 bg-gradient-to-r from-[#ff8633]/10 to-orange-200/20 rounded-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Questions?</h3>
            <p className="text-gray-600">
              Contact us at <a href="mailto:privacy@wecrm.com" className="text-[#ff8633] hover:underline">privacy@wecrm.com</a>
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;