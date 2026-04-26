import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';
import branchService from '../../services/branchService';

interface Branch {
  id: string;
  name: string;
  country: string;
  phone: string;
}

export const SuperAdminBranches: React.FC = () => {
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

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

  React.useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await branchService.getAllBranches(100, 0);
      setBranches(response.data.branches || []);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
      setError('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Branch Management"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading branches...</p>
          </div>
        ) : (
          <>
            {/* Branch Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {branches && branches.length > 0 ? (
                branches.map((branch) => (
                  <div key={branch.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{branch.name}</h3>
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Country</p>
                        <p className="font-medium text-gray-900">{branch.country}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{branch.phone}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                      <button className="text-blue-600 font-medium hover:underline text-sm">Edit</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-600">No branches found</p>
                </div>
              )}
            </div>

            {/* Add Branch CTA */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Add New Branch</h3>
                  <p className="text-green-100 mt-1">Expand Dalali Express to new locations</p>
                </div>
                <button className="px-6 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition">
                  + Add Branch
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
