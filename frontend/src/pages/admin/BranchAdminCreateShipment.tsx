import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';
import shipmentService from '../../services/shipmentService';
import branchService from '../../services/branchService';
import authService from '../../services/authService';

interface Branch {
  id: string;
  name: string;
}

export const BranchAdminCreateShipment: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [branchName, setBranchName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const [formData, setFormData] = React.useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    destination: '',
    cargoDescription: '',
    weight: '',
    volume: '',
    serviceType: 'Air Freight',
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

  React.useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await branchService.getAllBranches(100, 0);
        const branchList = response.data.branches as Branch[];
        setBranches(branchList);

        if (user?.branch_id) {
          const userBranch = branchList.find((b) => b.id === user.branch_id);
          if (userBranch) {
            setBranchName(userBranch.name);
          }
        }
      } catch (err) {
        console.error('Failed to fetch branches:', err);
      }
    };

    fetchBranches();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!user?.branch_id) {
        throw new Error('User branch information not available');
      }

      const response = await shipmentService.createShipment({
        senderName: formData.senderName,
        receiverName: formData.receiverName,
        originBranchId: user.branch_id,
        destination: formData.destination,
        description: formData.cargoDescription,
      });

      setSuccess(`✅ Shipment created successfully! Tracking ID: ${response.data.tracking_number}`);
      setFormData({
        senderName: '',
        senderPhone: '',
        senderAddress: '',
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        destination: '',
        cargoDescription: '',
        weight: '',
        volume: '',
        serviceType: 'Air Freight',
      });

      setTimeout(() => {
        navigate('/admin/branch/shipments');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Create New Shipment"
      menuItems={menuItems}
      userRole="branch-admin"
      userName={user?.name || 'Branch Admin'}
      branchName={branchName}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="alert-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {success && (
          <div className="alert-success">
            <span>{success}</span>
          </div>
        )}

        {/* Sender Information */}
        <div className="card-elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            👤 Sender Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone</label>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.senderPhone}
                onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Address</label>
              <input
                type="text"
                placeholder="Address"
                value={formData.senderAddress}
                onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Receiver Information */}
        <div className="card-elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            📦 Receiver Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.receiverName}
                onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone</label>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.receiverPhone}
                onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Address</label>
              <input
                type="text"
                placeholder="Address"
                value={formData.receiverAddress}
                onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Cargo Details */}
        <div className="card-elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            📍 Cargo Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Destination</label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select Destination</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Service Type</label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="input-field"
              >
                <option value="Air Freight">✈️ Air Freight</option>
                <option value="Sea Freight">🚢 Sea Freight</option>
                <option value="Consolidation">📦 Consolidation</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Description</label>
            <textarea
              placeholder="What are you shipping? (contents, materials, etc.)"
              value={formData.cargoDescription}
              onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
              className="input-field"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Weight</label>
              <input
                type="number"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Volume</label>
              <input
                type="number"
                placeholder="Volume (m³)"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 text-lg"
          >
            {loading ? '⏳ Creating Shipment...' : '✅ Create Shipment'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/branch/shipments')}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};
