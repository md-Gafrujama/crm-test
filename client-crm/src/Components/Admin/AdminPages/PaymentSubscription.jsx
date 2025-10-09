import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Check, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  Calendar,
  Download,
  Settings,
  ChevronRight,
  AlertCircle,
  Loader2,
  Crown,
  Building2,
  Sparkles
} from 'lucide-react';
import { Header } from '../common/Header';
import { Sidebar, useSidebar } from '../common/sidebar';
import { cn } from "../../../utils/cn";
import Footer from '../common/Footer';
import { API_BASE_URL } from "../../../config/api";
import { toast } from 'react-toastify';

const PaymentSubscription = () => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleSidebarCollapsedChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };
  
  // State management
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: ''
  });

  // Subscription plans configuration
  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Shield,
      price: { monthly: 29, yearly: 290 },
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 5 team members',
        'Basic CRM features',
        '1GB storage',
        'Email support',
        'Basic analytics',
        'Mobile app access'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Professional',
      icon: Zap,
      price: { monthly: 79, yearly: 790 },
      description: 'Advanced features for growing businesses',
      features: [
        'Up to 25 team members',
        'Advanced CRM features',
        '10GB storage',
        'Priority support',
        'Advanced analytics & reports',
        'API access',
        'Custom integrations',
        'Lead scoring',
        'Automation workflows'
      ],
      popular: true,
      color: 'purple'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Crown,
      price: { monthly: 199, yearly: 1990 },
      description: 'Complete solution for large organizations',
      features: [
        'Unlimited team members',
        'All CRM features',
        'Unlimited storage',
        '24/7 dedicated support',
        'Custom analytics',
        'White-label solution',
        'Advanced security',
        'SSO integration',
        'Custom development',
        'Dedicated account manager'
      ],
      popular: false,
      color: 'gold'
    }
  ];

  // Mock payment history data
  useEffect(() => {
    setPaymentHistory([
      {
        id: 1,
        date: '2024-01-15',
        amount: 79,
        plan: 'Professional',
        status: 'Paid',
        invoice: 'INV-2024-001'
      },
      {
        id: 2,
        date: '2023-12-15',
        amount: 79,
        plan: 'Professional',
        status: 'Paid',
        invoice: 'INV-2023-012'
      },
      {
        id: 3,
        date: '2023-11-15',
        amount: 79,
        plan: 'Professional',
        status: 'Paid',
        invoice: 'INV-2023-011'
      }
    ]);
  }, []);

  const handleCardInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Payment processed successfully!');
      setCurrentPlan(selectedPlan);
      setShowPaymentForm(false);
      setCardDetails({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        billingAddress: ''
      });
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      gold: 'from-yellow-500 to-yellow-600'
    };
    return colors[color] || colors.blue;
  };

  const getCurrentPlanDetails = () => {
    return subscriptionPlans.find(plan => plan.id === currentPlan);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onCollapsedChange={handleSidebarCollapsedChange}>
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Payment & Subscription
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your payment methods and subscription
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Current Plan Status */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Current Plan
                </h2>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              
              {getCurrentPlanDetails() && (
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg bg-gradient-to-r",
                    getPlanColor(getCurrentPlanDetails().color)
                  )}>
                    {React.createElement(getCurrentPlanDetails().icon, { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {getCurrentPlanDetails().name} Plan
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      ${getCurrentPlanDetails().price[billingCycle]} / {billingCycle === 'monthly' ? 'month' : 'year'}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={() => setShowPaymentForm(true)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={cn(
                    "px-6 py-2 rounded-md transition-all",
                    billingCycle === 'monthly'
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={cn(
                    "px-6 py-2 rounded-md transition-all relative",
                    billingCycle === 'yearly'
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "relative bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300 hover:shadow-lg",
                    selectedPlan === plan.id
                      ? "border-purple-500 shadow-lg"
                      : "border-gray-200 dark:border-gray-700",
                    plan.popular && "ring-2 ring-purple-500 ring-opacity-50"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "p-2 rounded-lg bg-gradient-to-r",
                        getPlanColor(plan.color)
                      )}>
                        {React.createElement(plan.icon, { className: "w-6 h-6 text-white" })}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {plan.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${plan.price[billingCycle]}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          / {billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Save ${(plan.price.monthly * 12) - plan.price.yearly} per year
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        if (plan.id !== currentPlan) {
                          setShowPaymentForm(true);
                        }
                      }}
                      className={cn(
                        "w-full py-3 px-4 rounded-lg font-medium transition-all",
                        plan.id === currentPlan
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          : selectedPlan === plan.id
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                      )}
                      disabled={plan.id === currentPlan}
                    >
                      {plan.id === currentPlan ? 'Current Plan' : 'Select Plan'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Form Modal */}
            {showPaymentForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Payment Details
                    </h3>
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        {subscriptionPlans.find(p => p.id === selectedPlan)?.name} Plan
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${subscriptionPlans.find(p => p.id === selectedPlan)?.price[billingCycle]} / {billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardholderName}
                          onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) => handleCardInputChange('cardNumber', formatCardNumber(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiryDate}
                            onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="MM/YY"
                            maxLength="5"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="123"
                            maxLength="4"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Billing Address
                        </label>
                        <textarea
                          value={cardDetails.billingAddress}
                          onChange={(e) => handleCardInputChange('billingAddress', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="123 Main St, City, State, ZIP"
                          rows="3"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowPaymentForm(false)}
                        className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Complete Payment'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Payment History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Payment History
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  View your past payments and download invoices
                </p>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {payment.plan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {payment.invoice}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
         
        </div>
      {/* </div> */}
      </div>
    </Sidebar>
    <Footer />
  </div>
  );
};

export default PaymentSubscription;
