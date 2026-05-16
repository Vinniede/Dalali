import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';
import shipmentService from '../../services/shipmentService';

interface Shipment {
  id: string;
  tracking_number: string;
  destination: string;
  current_status: string;
  current_location?: string;
  latest_update?: {
    location?: string;
    description?: string;
    created_at?: string;
  } | null;
}

export const SuperAdminTracking: React.FC = () => {
  const [trackingId, setTrackingId] = React.useState('');
  const [status, setStatus] = React.useState('In Transit');
  const [currentLocation, setCurrentLocation] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [selectedShipment, setSelectedShipment] = React.useState<Shipment | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'O', path: '/admin/super/overview' },
    { id: 'shipments', label: 'Shipments', icon: 'S', path: '/admin/super/shipments' },
    { id: 'users', label: 'Users', icon: 'U', path: '/admin/super/users' },
    { id: 'branches', label: 'Branches', icon: 'B', path: '/admin/super/branches' },
    { id: 'services', label: 'Services', icon: 'V', path: '/admin/super/services' },
    { id: 'tracking', label: 'Tracking Control', icon: 'T', path: '/admin/super/tracking' },
    { id: 'reports', label: 'Reports', icon: 'R', path: '/admin/super/reports' },
    { id: 'notifications', label: 'Notifications', icon: 'N', path: '/admin/super/notifications' },
    { id: 'settings', label: 'Settings', icon: 'G', path: '/admin/super/settings' },
  ];

  const handleSearch = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await shipmentService.trackShipment(trackingId.trim());
      const shipment = response.data as Shipment;

      setSelectedShipment(shipment);
      setStatus(shipment.current_status || 'In Transit');
      setCurrentLocation(
        shipment.latest_update?.location ||
          shipment.current_location ||
          shipment.destination ||
          ''
      );
      setNotes(shipment.latest_update?.description || '');
    } catch (err: any) {
      setSelectedShipment(null);
      setError(err.response?.data?.message || 'Shipment not found');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedShipment) {
      setError('Please search and select a shipment first');
      return;
    }

    if (!currentLocation.trim()) {
      setError('Current location is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await shipmentService.updateShipmentStatus(
        selectedShipment.id,
        status,
        null,
        currentLocation,
        notes
      );

      setSelectedShipment({
        ...selectedShipment,
        current_status: status,
        current_location: currentLocation,
        latest_update: {
          location: currentLocation,
          description: notes,
        },
      });
      setSuccess('Tracking location updated successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update tracking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Tracking Control System"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Search Shipment</h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g., DEX123456ABC)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Update Shipment Status</h3>

          {selectedShipment && (
            <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="font-mono text-sm font-bold text-blue-700">
                {selectedShipment.tracking_number}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Destination: {selectedShipment.destination}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Current Location: {currentLocation || 'Not set'}
              </p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Current Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="In Transit">In Transit</option>
                <option value="At Branch">At Branch</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Failed Delivery">Failed Delivery</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Current Location</label>
              <input
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="e.g., Kampala transit hub"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add an update note visible in tracking history"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading || !selectedShipment}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Tracking Status'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};
