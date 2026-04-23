import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';
import shipmentService from '../../services/shipmentService';
import authService from '../../services/authService';
import { formatDate, getStatusBgColor } from '../../services/utils';

interface Shipment {
  id: string;
  tracking_number: string;
  destination: string;
  current_status: string;
  created_at: string;
  history?: Array<{
    id: string;
    status: string;
    description: string;
    created_at: string;
  }>;
}

export const BranchAdminTracking: React.FC = () => {
  const user = authService.getUser();
  const [branchName, setBranchName] = React.useState('');
  const [trackingId, setTrackingId] = React.useState('');
  const [selectedShipment, setSelectedShipment] = React.useState<Shipment | null>(null);
  const [status, setStatus] = React.useState('In Transit');
  const [notes, setNotes] = React.useState('');
  const [shipments, setShipments] = React.useState<Shipment[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

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
    fetchShipments();
    if (user?.branch_id) {
      setBranchName('Your Branch');
    }
  }, [user]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await shipmentService.getShipments(100, 0);
      setShipments(response.data.shipments);
    } catch (err: any) {
      setError('Failed to fetch shipments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const response = await shipmentService.trackShipment(trackingId);
      setSelectedShipment(response.data);
      setStatus(response.data.current_status);
      setNotes('');
    } catch (err: any) {
      setError('Shipment not found');
      setSelectedShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedShipment) {
      setError('Please select a shipment first');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await shipmentService.updateShipmentStatus(
        selectedShipment.id,
        status,
        user?.branch_id || '',
        notes
      );
      setSuccess('✅ Shipment status updated successfully!');
      setSelectedShipment(null);
      setTrackingId('');
      setStatus('In Transit');
      setNotes('');
      fetchShipments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Update Shipment Tracking"
      menuItems={menuItems}
      userRole="branch-admin"
      userName={user?.name || 'Branch Admin'}
      branchName={branchName}
    >
      <div className="space-y-6">
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

        {/* Search */}
        <div className="card-elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Search Shipment</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g., DEX123456ABC)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="input-field flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary px-6 flex-shrink-0"
            >
              {loading ? '🔄 Searching...' : '🔍 Search'}
            </button>
          </div>
        </div>

        {/* Update Status */}
        {selectedShipment && (
          <div className="card-elevated border-l-4 border-primary-500">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Update Tracking: <span className="text-primary-700 font-mono">{selectedShipment.tracking_number}</span>
            </h3>
            <div className="space-y-5 mb-6">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Current Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${
                    selectedShipment.current_status === 'Delivered' ? 'bg-success bg-opacity-10 text-success' :
                    selectedShipment.current_status === 'In Transit' ? 'bg-warning bg-opacity-10 text-warning' :
                    'bg-info-100 text-info-900'
                  }`}>
                    {selectedShipment.current_status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Destination</p>
                  <p className="font-semibold text-gray-900 mt-2">{selectedShipment.destination}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">New Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="At Branch">📍 At Branch</option>
                  <option value="In Transit">🚚 In Transit</option>
                  <option value="Out for Delivery">🎯 Out for Delivery</option>
                  <option value="Delivered">✅ Delivered</option>
                  <option value="Failed Delivery">❌ Failed Delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or description about this update..."
                  className="input-field"
                  rows={4}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Visible to customers in tracking history</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUpdateStatus}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? '⏳ Updating...' : '💾 Update Tracking'}
              </button>
              <button
                onClick={() => {
                  setSelectedShipment(null);
                  setTrackingId('');
                  setNotes('');
                }}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Recent Shipments */}
        <div className="card-elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Shipments</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
            {loading && !selectedShipment ? (
              <div className="text-center py-8">
                <div className="inline-block mb-2">
                  <div className="w-6 h-6 border-3 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600">Loading shipments...</p>
              </div>
            ) : shipments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No shipments found</p>
              </div>
            ) : (
              shipments.slice(0, 15).map((shipment) => (
                <button
                  key={shipment.id}
                  onClick={() => {
                    setSelectedShipment(shipment);
                    setTrackingId(shipment.tracking_number);
                    setStatus(shipment.current_status);
                  }}
                  className={`w-full flex justify-between items-center pb-3 border-b last:border-b-0 p-3 rounded-lg transition-all duration-200 ${
                    selectedShipment?.id === shipment.id
                      ? 'bg-primary-50 border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold text-gray-900 font-mono">{shipment.tracking_number}</p>
                    <p className="text-xs text-gray-500">{formatDate(shipment.created_at)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    shipment.current_status === 'Delivered' ? 'bg-success bg-opacity-10 text-success' :
                    shipment.current_status === 'In Transit' ? 'bg-warning bg-opacity-10 text-warning' :
                    'bg-info-100 text-info-900'
                  }`}>
                    {shipment.current_status}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
