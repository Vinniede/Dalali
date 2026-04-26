import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';
import shipmentService from '../../services/shipmentService';
import branchService from '../../services/branchService';

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  origin_branch_id: string;
  destination: string;
  current_status: string;
  created_at: string;
}

interface Branch {
  id: string;
  name: string;
}

export const SuperAdminShipments: React.FC = () => {
  const [filter, setFilter] = React.useState('all');
  const [shipments, setShipments] = React.useState<Shipment[]>([]);
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    senderName: '',
    receiverName: '',
    originBranchId: '',
    destination: '',
    description: '',
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

  // Fetch shipments and branches on mount
  React.useEffect(() => {
    fetchShipments();
    fetchBranches();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await shipmentService.getShipments(100, 0);
      setShipments(response.data.shipments);
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
      setError('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await branchService.getAllBranches(100, 0);
      setBranches(response.data.branches);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.senderName || !formData.receiverName || !formData.originBranchId || !formData.destination) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await shipmentService.createShipment({
        senderName: formData.senderName,
        receiverName: formData.receiverName,
        originBranchId: formData.originBranchId,
        destination: formData.destination,
        description: formData.description,
      });

      setSuccess(`✅ Shipment created successfully! Tracking: ${response.data.tracking_number}`);
      setFormData({
        senderName: '',
        receiverName: '',
        originBranchId: '',
        destination: '',
        description: '',
      });
      setShowCreateForm(false);
      await fetchShipments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create shipment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Pending':
      case 'Created':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredShipments = shipments.filter((s) => {
    if (filter === 'all') return true;
    return s.current_status.toLowerCase().replace(' ', '-') === filter;
  });

  return (
    <DashboardLayout
      title="Global Shipments"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-6">
        {/* Alerts */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Create Shipment Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Create New Shipment</h3>
              <p className="text-blue-100 mt-1">Add a shipment directly to the system</p>
            </div>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              + Create Shipment
            </button>
          </div>
        </div>

        {/* Create Shipment Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Create New Shipment</h3>
            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Sender Name *</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Receiver Name *</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={formData.receiverName}
                    onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Origin Branch *</label>
                  <select
                    value={formData.originBranchId}
                    onChange={(e) => setFormData({ ...formData, originBranchId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Destination *</label>
                  <input
                    type="text"
                    placeholder="e.g., Nairobi, Kenya"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Cargo description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                >
                  Create Shipment
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Shipments</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('created')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'created'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Created
            </button>
            <button
              onClick={() => setFilter('in-transit')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'in-transit'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'delivered'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setFilter('delayed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'delayed'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Delayed
            </button>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-600">Loading shipments...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Tracking Number</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Sender</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Receiver</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Destination</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments && filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-bold text-blue-600">{shipment.tracking_number}</td>
                      <td className="px-6 py-4 text-gray-700">{shipment.sender_name}</td>
                      <td className="px-6 py-4 text-gray-700">{shipment.receiver_name}</td>
                      <td className="px-6 py-4 text-gray-700">{shipment.destination}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.current_status)}`}>
                          {shipment.current_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(shipment.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-600">
                      No shipments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
