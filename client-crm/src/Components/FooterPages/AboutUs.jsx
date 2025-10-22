import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Target, Award, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const AboutUs = () => {
  const navigate = useNavigate();

  const team = [
    { name: 'John Smith', role: 'CEO & Founder', avatar: 'JS' },
    { name: 'Sarah Johnson', role: 'CTO', avatar: 'SJ' },
    { name: 'Mike Chen', role: 'Head of Sales', avatar: 'MC' },
    { name: 'Lisa Rodriguez', role: 'Head of Marketing', avatar: 'LR' }
  ];

  const values = [
    { icon: Users, title: 'Customer First', desc: 'Everything we do is focused on helping our customers succeed' },
    { icon: Target, title: 'Innovation', desc: 'We constantly push boundaries to deliver cutting-edge solutions' },
    { icon: Award, title: 'Excellence', desc: 'We strive for excellence in every aspect of our work' },
    { icon: Heart, title: 'Integrity', desc: 'We build trust through transparency and honest communication' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-[#ff8633] hover:text-orange-600 mb-8 group"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </motion.button>

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-[#ff8633]">weCRM</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to revolutionize how businesses manage customer relationships 
              and drive growth through intelligent automation and data-driven insights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2020, weCRM was born from the frustration of using outdated, 
                complex CRM systems that hindered rather than helped business growth.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team of experienced entrepreneurs and technologists came together 
                with a simple vision: create a CRM that's powerful yet intuitive, 
                comprehensive yet simple to use.
              </p>
            </motion.div>
            <motion.div
              className="bg-gradient-to-br from-[#ff8633]/10 to-orange-200/20 rounded-2xl p-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower businesses of all sizes with intelligent CRM tools that 
                drive growth, improve customer relationships, and streamline operations 
                through automation and AI-powered insights.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-[#ff8633] to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-[#ff8633] to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;