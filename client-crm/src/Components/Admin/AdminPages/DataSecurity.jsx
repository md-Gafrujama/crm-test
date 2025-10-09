import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Key,
  Eye,
  Database,
  Download,
  Trash2,
  Activity,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useTheme } from '../../../hooks/use-theme';
import { Header } from '../common/Header';
import { Sidebar, useSidebar } from '../common/sidebar';
import { cn } from "../../../utils/cn";
import Footer from '../common/Footer';
import { toast } from 'react-toastify';

const DataSecurity = () => {
  const { theme } = useTheme();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarCollapsedChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginNotifications: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    ipWhitelist: false,
    dataEncryption: true,
    auditLogs: true,
    apiAccess: false
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    analytics: true,
    marketing: false,
    thirdPartySharing: false,
    cookieConsent: true
  });

  // Data Management State
  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '365',
    exportFormat: 'json'
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSecurityToggle = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success(`${setting} ${securitySettings[setting] ? 'disabled' : 'enabled'}`);
  };

  const handlePrivacyToggle = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success('Privacy setting updated');
  };

  const handleDataToggle = (setting) => {
    setDataSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success('Data setting updated');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password updated successfully');
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDataExport = () => {
    toast.success('Data export initiated. You will receive an email when ready.');
  };

  const handleDataDeletion = () => {
    toast.warning('Data deletion request submitted. This action cannot be undone.');
  };

  const securityScore = Object.values(securitySettings).filter(Boolean).length;
  const maxSecurityScore = Object.keys(securitySettings).length;

  return (
    <div className="min-h-screen  dark:bg-gray-900 flex flex-col">
       <Header onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* ✅ Correct Sidebar Placement */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          onCollapsedChange={handleSidebarCollapsedChange}
          collapsed={sidebarCollapsed}
        />

        {/* ✅ Main Content Area */}
        <main className="flex-1 overflow-auto p-6 mt-20">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Data & Security
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account security, privacy settings, and data preferences
            </p>
          </div>

          {/* Security Score */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Security Score
              </h2>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    securityScore >= 6
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : securityScore >= 4
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  )}
                >
                  {securityScore}/{maxSecurityScore}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={cn(
                  "h-3 rounded-full transition-all duration-300",
                  securityScore >= 6
                    ? "bg-green-500"
                    : securityScore >= 4
                    ? "bg-yellow-500"
                    : "bg-red-500"
                )}
                style={{ width: `${(securityScore / maxSecurityScore) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {securityScore >= 6
                ? "Excellent security setup!"
                : securityScore >= 4
                ? "Good security, consider enabling more features"
                : "Security needs improvement"}
            </p>
          </div>

          {/* Settings Sections */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Security Settings */}
            <div className="space-y-6">
              {/* Security Settings Box */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Security Settings
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { key: 'twoFactorAuth', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                    { key: 'loginNotifications', label: 'Login Notifications', desc: 'Get notified of new sign-ins' },
                    { key: 'ipWhitelist', label: 'IP Whitelist', desc: 'Restrict access to specific IP addresses' },
                    { key: 'dataEncryption', label: 'Data Encryption', desc: 'Encrypt sensitive data at rest' },
                    { key: 'auditLogs', label: 'Audit Logs', desc: 'Track all account activities' },
                    { key: 'apiAccess', label: 'API Access', desc: 'Allow third-party API access' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {setting.label}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {setting.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSecurityToggle(setting.key)}
                        className="relative"
                      >
                        {securitySettings[setting.key] ? (
                          <ToggleRight className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Password Management */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Password Management
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Change Password
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last changed 30 days ago
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Session Timeout
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Auto logout after inactivity
                      </p>
                    </div>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Data Management */}
            <div className="space-y-6">
              {/* Privacy Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Privacy Settings
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { key: 'dataCollection', label: 'Data Collection', desc: 'Allow collection of usage data' },
                    { key: 'analytics', label: 'Analytics', desc: 'Help improve our services' },
                    { key: 'marketing', label: 'Marketing Communications', desc: 'Receive promotional emails' },
                    { key: 'thirdPartySharing', label: 'Third-party Sharing', desc: 'Share data with partners' },
                    { key: 'cookieConsent', label: 'Cookie Consent', desc: 'Allow cookies for better experience' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {setting.label}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {setting.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrivacyToggle(setting.key)}
                        className="relative"
                      >
                        {privacySettings[setting.key] ? (
                          <ToggleRight className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Data Management
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Auto Backup
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Automatically backup your data
                      </p>
                    </div>
                    <button
                      onClick={() => handleDataToggle('autoBackup')}
                      className="relative"
                    >
                      {dataSettings.autoBackup ? (
                        <ToggleRight className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Export Data
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Download all your data
                      </p>
                    </div>
                    <button
                      onClick={handleDataExport}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Delete Account
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Permanently delete your account
                      </p>
                    </div>
                    <button
                      onClick={handleDataDeletion}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Security Activity
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { action: 'Password changed', time: '2 hours ago', device: 'Chrome on Windows', status: 'success' },
                  { action: 'Login from new device', time: '1 day ago', device: 'Mobile App', status: 'warning' },
                  { action: '2FA enabled', time: '3 days ago', device: 'Chrome on Windows', status: 'success' },
                  { action: 'API key generated', time: '1 week ago', device: 'Chrome on Windows', status: 'info' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          activity.status === 'success'
                            ? 'bg-green-500'
                            : activity.status === 'warning'
                            ? 'bg-yellow-500'
                            : activity.status === 'info'
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                        )}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.device}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Password Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Change Password
                  </h3>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    &times;
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePasswordChange();
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DataSecurity;
