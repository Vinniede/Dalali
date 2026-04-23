import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';

export const BranchAdminProfile: React.FC = () => {
  const branchName = 'Dar es Salaam';
  const [profileData, setProfileData] = React.useState({
    name: 'John Kamau',
    email: 'john@dalali.com',
    phone: '+255 784 567890',
    branch: branchName,
  });

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/admin/branch/overview' },
    { id: 'my-shipments', label: 'My Shipments', icon: '📦', path: '/admin/branch/shipments' },
    { id: 'create', label: 'Create Shipment', icon: '➕', path: '/admin/branch/create' },
    { id: 'incoming', label: 'Incoming Cargo', icon: '📥', path: '/admin/branch/incoming' },
    { id: 'outgoing', label: 'Outgoing Cargo', icon: '📤', path: '/admin/branch/outgoing' },
    { id: 'tracking', label: 'Tracking Updates', icon: '📍', path: '/admin/branch/tracking' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/admin/branch/profile' },
  ];

  return (
    <DashboardLayout
      title="My Profile"
      menuItems={menuItems}
      userRole="branch-admin"
      userName="Branch Admin"
      branchName={branchName}
    >
      <div className="space-y-6 max-w-2xl">
        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h3>
          <div className="flex items-center gap-6 mb-6 pb-6 border-b">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              JK
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{profileData.name}</p>
              <p className="text-gray-600">Branch Admin at {profileData.branch}</p>
              <p className="text-sm text-green-600 font-medium mt-1">✓ Active</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Assigned Branch</label>
              <input
                type="text"
                value={profileData.branch}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
          </div>

          <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
            Save Changes
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
          <div className="space-y-4 mb-4">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
            Update Password
          </button>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Created shipment XF27-042', time: '2 hours ago' },
              { action: 'Updated tracking for XF27-041', time: '4 hours ago' },
              { action: 'Logged in', time: 'Today at 8:30 AM' },
              { action: 'Changed password', time: 'Yesterday' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                <p className="text-gray-900">{item.action}</p>
                <p className="text-sm text-gray-500">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
