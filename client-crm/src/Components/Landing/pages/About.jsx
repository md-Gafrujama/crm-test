import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Target, Award, Heart } from 'lucide-react';
import Navbar from '../../common/Navbar';
import Footer from '../../common/Footer';

const About = () => {
  const navigate = useNavigate();

  const values = [
    { icon: Users, title: 'Customer First', desc: 'Every decision we make puts our customers at the center.' },
    { icon: Target, title: 'Innovation', desc: 'We constantly push boundaries to deliver cutting-edge solutions.' },
    { icon: Award, title: 'Excellence', desc: 'We strive for excellence in everything we do.' },
    { icon: Heart, title: 'Integrity', desc: 'We build trust through transparency and honest communication.' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="fixed top-20 left-4 z-40">
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 px-4 py-2 bg-white shadow-lg rounded-full hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>
      </div>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            About <span className="text-[#ff8633]">weCRM</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            We help businesses build stronger customer relationships through intelligent CRM solutions.
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#ff8633] to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;