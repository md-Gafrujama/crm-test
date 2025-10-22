import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Star, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Pricing = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      icon: Star,
      price: { monthly: 29, annual: 290 },
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 5 users',
        '1,000 contacts',
        'Basic CRM features',
        'Email support',
        'Mobile app access',
        'Basic reporting'
      ],
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      name: 'Professional',
      icon: Zap,
      price: { monthly: 79, annual: 790 },
      description: 'Best for growing businesses',
      features: [
        'Up to 25 users',
        '10,000 contacts',
        'Advanced CRM features',
        'Priority support',
        'Custom integrations',
        'Advanced analytics',
        'Workflow automation',
        'API access'
      ],
      color: 'from-[#ff8633] to-orange-500',
      popular: true
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: { monthly: 149, annual: 1490 },
      description: 'For large organizations',
      features: [
        'Unlimited users',
        'Unlimited contacts',
        'All CRM features',
        '24/7 phone support',
        'Custom development',
        'Advanced security',
        'Dedicated account manager',
        'Custom training'
      ],
      color: 'from-purple-500 to-pink-500',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 14-day free trial for all plans. No credit card required.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all new subscriptions.'
    }
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
              Simple <span className="text-[#ff8633]">Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Choose the perfect plan for your business. All plans include our core features with no hidden fees.
            </p>

            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm ${!isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-14 h-8 rounded-full transition-colors ${isAnnual ? 'bg-[#ff8633]' : 'bg-gray-300'}`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
              <span className={`text-sm ${isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                Annual <span className="text-green-600">(Save 17%)</span>
              </span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 ${plan.popular ? 'ring-2 ring-[#ff8633] scale-105' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#ff8633] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-gray-600">/{isAnnual ? 'year' : 'month'}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={() => navigate('/register')}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-[#ff8633] to-orange-500 text-white hover:shadow-lg' 
                      : 'border-2 border-gray-300 text-gray-700 hover:border-[#ff8633] hover:text-[#ff8633]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="text-center mt-16 p-8 bg-gradient-to-r from-[#ff8633]/10 to-orange-200/20 rounded-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Plan?</h3>
            <p className="text-gray-600 mb-6">
              Contact our sales team for enterprise solutions and custom pricing.
            </p>
            <motion.button
              onClick={() => navigate('/contact')}
              className="px-8 py-3 bg-gradient-to-r from-[#ff8633] to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Sales
            </motion.button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;