import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';

interface Service {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  category: string;
}

export const SuperAdminServices: React.FC = () => {
  const [services, setServices] = React.useState<Service[]>([
    {
      id: 'SRV001',
      name: 'Air Freight',
      description: 'Fast international delivery for urgent cargo',
      status: 'Active',
      category: 'Shipping',
    },
    {
      id: 'SRV002',
      name: 'Sea Freight',
      description: 'Cost-effective bulk cargo shipping',
      status: 'Active',
      category: 'Shipping',
    },
    {
      id: 'SRV003',
      name: 'Clearing & Forwarding',
      description: 'Customs handling and compliance',
      status: 'Active',
      category: 'Services',
    },
    {
      id: 'SRV004',
      name: 'Cargo Consolidation',
      description: 'Combine multiple shipments for savings',
      status: 'Active',
      category: 'Services',
    },
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

  const toggleServiceStatus = (id: string) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
    );
  };

  return (
    <DashboardLayout
      title="Service Management"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-6">
        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    service.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {service.status}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{service.description}</p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium transition text-sm">
                  Edit
                </button>
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className={`px-4 py-2 rounded font-medium transition text-sm ${
                    service.status === 'Active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {service.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Service CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Add New Service</h3>
              <p className="text-purple-100 mt-1">Expand Dalali Express service offerings</p>
            </div>
            <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition">
              + Add Service
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
