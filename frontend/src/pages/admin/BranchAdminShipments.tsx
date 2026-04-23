import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';
import shipmentService from '../../services/shipmentService';
import authService from '../../services/authService';
import { formatDate, getStatusBgColor, getStatusTextColor } from '../../services/utils';

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  destination: string;
  current_status: string;
  created_at: string;
}

export const BranchAdminShipments: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [shipments, setShipments] = React.useState<Shipment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [branchName, setBranchName] = React.useState('');
  const [filter, setFilter] = React.useState('All');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/admin/branch/overview' },
    { id: 'my-shipments', label: 'My Shipments', icon: '📦', path: '/admin/branch/shipments' },
    { id: 'create', label: 'Create Shipment', icon: '➕', path: '/admin/branch/create' },
    { id: 'incoming', label: 'Incoming Cargo', icon: '📥', path: '/admin/branch/incoming' },
    { id: 'outgoing', label: 'Outgoing Cargo', icon: '📤', path: '/admin/branch/outgoing' },
    { id: 'tracking', label: 'Tracking Updates', icon: '📍', path: '/admin/branch/tracking' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/admin/branch/profile' },
  ];

  const statusColors = {
    Created: 'bg-info-100 text-info-900 border border-info-300',
    'In Transit': 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20',
    Delivered: 'bg-success bg-opacity-10 text-success border border-success border-opacity-20',
    Pending: 'bg-error bg-opacity-10 text-error border border-error border-opacity-20',
  };

  React.useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        const response = await shipmentService.getShipments(20, 0);
        setShipments(response.data.shipments);
        
        if (user?.branch_id) {
          setBranchName('Your Branch');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch shipments');
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [user]);

  const filteredShipments = shipments.filter((s) => {
    if (filter === 'All') return true;
    return s.current_status === filter;
  });

  const handleViewShipment = (shipmentId: string) => {
    navigate(`/admin/branch/shipments/${shipmentId}`);
  };

  return (
    <DashboardLayout
      title="My Shipments"
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

        {/* Filter Tabs */}
        <div className="card bg-white shadow-base border border-gray-200">
          <div className="flex gap-2 flex-wrap">
            {['All', 'Created', 'In Transit', 'Delivered', 'Pending'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  filter === status
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-600 mt-4 uppercase tracking-widest">
            Showing {filteredShipments.length} of {shipments.length} shipments
          </p>
        </div>

        {/* Shipments Table */}
        <div className="card-elevated overflow-hidden shadow-base">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block mb-4">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading shipments...</p>
            </div>
          ) : filteredShipments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-gray-600 font-medium">No shipments found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Tracking ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Sender</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Receiver</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Destination</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="table-row-hover hover:bg-primary-50">
                      <td className="px-6 py-4 font-bold text-primary-700 font-mono">{shipment.tracking_number}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{shipment.sender_name}</td>
                      <td className="px-6 py-4 text-gray-700">{shipment.receiver_name}</td>
                      <td className="px-6 py-4 text-gray-700">{shipment.destination}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          shipment.current_status === 'Delivered' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-20' :
                          shipment.current_status === 'In Transit' ? 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20' :
                          shipment.current_status === 'Created' ? 'bg-info-100 text-info-900 border border-info-300' :
                          'bg-error bg-opacity-10 text-error border border-error border-opacity-20'
                        }`}>
                          {shipment.current_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">{formatDate(shipment.created_at)}</td>
                      <td className="px-6 py-4 space-x-2 flex items-center">
                        <button
                          onClick={() => handleViewShipment(shipment.id)}
                          className="px-3 py-1.5 bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg text-xs font-bold transition-colors duration-200"
                        >
                          👁️ View
                        </button>
                        <button className="px-3 py-1.5 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 rounded-lg text-xs font-bold transition-colors duration-200">
                          ✏️ Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
