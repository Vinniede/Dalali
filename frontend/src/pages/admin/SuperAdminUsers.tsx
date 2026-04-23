import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';

interface User {
  id: string;
  name: string;
  email: string;
  branch: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

export const SuperAdminUsers: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([
    {
      id: 'USR001',
      name: 'John Kamau',
      email: 'john@dalali.com',
      branch: 'Dar es Salaam',
      status: 'Active',
      joinDate: '2024-01-15',
    },
    {
      id: 'USR002',
      name: 'Grace Mwamba',
      email: 'grace@dalali.com',
      branch: 'Entebbe',
      status: 'Active',
      joinDate: '2024-02-20',
    },
    {
      id: 'USR003',
      name: 'David Nkana',
      email: 'david@dalali.com',
      branch: 'Kinshasa',
      status: 'Active',
      joinDate: '2024-03-10',
    },
  ]);

  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    branch: '',
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

  const handleAddUser = () => {
    if (formData.name && formData.email && formData.branch) {
      setUsers([
        ...users,
        {
          id: `USR${users.length + 1}`,
          ...formData,
          status: 'Active',
          joinDate: new Date().toISOString().split('T')[0],
        },
      ]);
      setFormData({ name: '', email: '', password: '', branch: '' });
      setShowForm(false);
    }
  };

  return (
    <DashboardLayout
      title="Branch Admin Users"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-6">
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b  flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">All Branch Admins</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
            >
              + Add Branch Admin
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Branch</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Join Date</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-gray-700">{user.branch}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.joinDate}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium transition">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium transition">
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Branch Admin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Branch</option>
                <option value="Dar es Salaam">Dar es Salaam</option>
                <option value="Entebbe">Entebbe</option>
                <option value="Kinshasa">Kinshasa</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddUser}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
              >
                Create User
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
