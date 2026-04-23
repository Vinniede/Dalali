import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({
    totalShipments: 345,
    activeDeliveries: 28,
    deliveredToday: 12,
    delayedShipments: 3,
  });

  const [recentActivity, setRecentActivity] = React.useState([
    { id: 1, message: 'Shipment XF27 updated to In Transit', timestamp: '5 mins ago' },
    { id: 2, message: 'New branch admin added for Entebbe', timestamp: '1 hour ago' },
    { id: 3, message: 'System backup completed successfully', timestamp: '3 hours ago' },
    { id: 4, message: 'Fleet utilization: 87%', timestamp: 'Today at 10:30 AM' },
    { id: 5, message: 'Average delivery time: 2.3 days', timestamp: 'Today at 09:00 AM' },
  ]);

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
      title="Dashboard Overview"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Super Admin</h2>
          <p className="text-gray-600">Manage the entire Dalali Express logistics network</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Shipments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalShipments}</p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
            <p className="text-green-600 text-sm mt-4">↑ 12% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Deliveries</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeDeliveries}</p>
              </div>
              <span className="text-4xl">🚚</span>
            </div>
            <p className="text-gray-600 text-sm mt-4">Currently in transit</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Delivered Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.deliveredToday}</p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
            <p className="text-gray-600 text-sm mt-4">On-time delivery rate</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Delayed Shipments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.delayedShipments}</p>
              </div>
              <span className="text-4xl">⚠️</span>
            </div>
            <p className="text-red-600 text-sm mt-4">Require attention</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
              + Create Shipment
            </button>
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
              + Add Branch
            </button>
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition">
              + Add Branch Admin
            </button>
            <button className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition">
              📊 View Reports
            </button>
          </div>
        </div>

        {/* System Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Live Activity Feed</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                  <div className="text-2xl">📢</div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Database</p>
                  <p className="text-sm font-bold text-green-600">✓ Healthy</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">API Server</p>
                  <p className="text-sm font-bold text-green-600">✓ Online</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Storage</p>
                  <p className="text-sm font-bold text-green-600">87% Used</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Backup</p>
                  <p className="text-sm font-bold text-blue-600">↻ Today 3AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow text-white p-8">
          <h3 className="text-xl font-bold mb-6">System Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold">15+</p>
              <p className="text-blue-100 text-sm">Active Branches</p>
            </div>
            <div>
              <p className="text-3xl font-bold">600+</p>
              <p className="text-blue-100 text-sm">Total Staff</p>
            </div>
            <div>
              <p className="text-3xl font-bold">99.9%</p>
              <p className="text-blue-100 text-sm">Uptime SLA</p>
            </div>
            <div>
              <p className="text-3xl font-bold">2.3d</p>
              <p className="text-blue-100 text-sm">Avg Delivery Time</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
