import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';

export const SuperAdminSettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    companyName: 'Dalali Express',
    trackingPrefix: 'XF27',
    emailEnabled: true,
    smsEnabled: false,
    twoFAEnabled: false,
  });

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/admin/super/overview' },
    { id: 'shipments', label: 'Shipments', icon: '📦', path: '/admin/super/shipments' },
    { id: 'users', label: 'Users', icon: '👥', path: '/admin/super/users' },
    { id: 'branches', label: 'Branches', icon: '🏢', path: '/admin/super/branches' },
    { id: 'services', label: 'Services', icon: '🚚', path: '/admin/super/services' },
    { id: 'tracking', label: 'Tracking Control', icon: '📍', path: '/admin/super/tracking' },
    { id: 'reports', label: 'Reports', icon: '📈', path: '/admin/super/reports' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/admin/super/notifications' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/super/settings' },
  ];

  return (
    <DashboardLayout
      title="System Settings"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-6 max-w-4xl">
        {/* Company Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Company Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Logo Upload</label>
              <input
                type="file"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tracking Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tracking Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Tracking Number Prefix</label>
              <input
                type="text"
                value={settings.trackingPrefix}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Format: XF27-001, XF27-002, etc.</p>
            </div>
          </div>
        </div>

        {/* Communication Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Communication Channels</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-900 font-medium">Email Notifications</label>
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-900 font-medium">SMS/WhatsApp Notifications</label>
              <input
                type="checkbox"
                checked={settings.smsEnabled}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-900 font-medium">Two-Factor Authentication (2FA)</label>
              <input
                type="checkbox"
                checked={settings.twoFAEnabled}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Password Policy</label>
              <p className="text-gray-700 text-sm">
                • Minimum 8 characters
                <br />
                • Requires uppercase, lowercase, number, and special character
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
          Save Settings
        </button>
      </div>
    </DashboardLayout>
  );
};
