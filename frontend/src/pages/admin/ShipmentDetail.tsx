import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';
import shipmentService from '../../services/shipmentService';
import authService from '../../services/authService';
import { formatDate, getStatusBgColor, getStatusTextColor } from '../../services/utils';

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_phone?: string;
  sender_address?: string;
  receiver_name: string;
  receiver_phone?: string;
  receiver_address?: string;
  destination: string;
  cargo_description?: string;
  weight?: number;
  volume?: number;
  service_type?: string;
  current_status: string;
  created_at: string;
  history?: any[];
}

export const ShipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = authService.getUser();
  const [shipment, setShipment] = React.useState<Shipment | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [branchName, setBranchName] = React.useState('');

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
    const fetchShipment = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('Shipment ID not found');
        
        const response = await shipmentService.getShipmentById(id);
        setShipment(response.data);
        
        if (user?.branch_id) {
          setBranchName('Your Branch');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch shipment');
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [id, user]);

  if (loading) {
    return (
      <DashboardLayout
        title="Shipment Details"
        menuItems={menuItems}
        userRole="branch-admin"
        userName={user?.name || 'Branch Admin'}
        branchName={branchName}
      >
        <div className="p-12 text-center">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading shipment details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !shipment) {
    return (
      <DashboardLayout
        title="Shipment Details"
        menuItems={menuItems}
        userRole="branch-admin"
        userName={user?.name || 'Branch Admin'}
        branchName={branchName}
      >
        <div className="alert-error mb-6">
          <span>⚠️ {error || 'Shipment not found'}</span>
        </div>
        <button onClick={() => navigate('/admin/branch/shipments')} className="btn-primary">
          ← Back to Shipments
        </button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Shipment ${shipment.tracking_number}`}
      menuItems={menuItems}
      userRole="branch-admin"
      userName={user?.name || 'Branch Admin'}
      branchName={branchName}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/branch/shipments')}
          className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
        >
          ← Back to Shipments
        </button>

        {/* Header Card */}
        <div className="card-elevated bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{shipment.tracking_number}</h2>
              <p className="text-gray-600 mt-2">Created on {formatDate(shipment.created_at)}</p>
            </div>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
              shipment.current_status === 'Delivered' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-20' :
              shipment.current_status === 'In Transit' ? 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20' :
              shipment.current_status === 'Created' ? 'bg-info-100 text-info-900 border border-info-300' :
              'bg-error bg-opacity-10 text-error border border-error border-opacity-20'
            }`}>
              {shipment.current_status}
            </span>
          </div>
        </div>

        {/* Sender & Receiver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sender */}
          <div className="card-elevated">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              👤 Sender Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Name</p>
                <p className="text-gray-900 font-semibold">{shipment.sender_name}</p>
              </div>
              {shipment.sender_phone && (
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Phone</p>
                  <p className="text-gray-900">{shipment.sender_phone}</p>
                </div>
              )}
              {shipment.sender_address && (
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Address</p>
                  <p className="text-gray-900">{shipment.sender_address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Receiver */}
          <div className="card-elevated">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              📦 Receiver Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Name</p>
                <p className="text-gray-900 font-semibold">{shipment.receiver_name}</p>
              </div>
              {shipment.receiver_phone && (
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Phone</p>
                  <p className="text-gray-900">{shipment.receiver_phone}</p>
                </div>
              )}
              {shipment.receiver_address && (
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Address</p>
                  <p className="text-gray-900">{shipment.receiver_address}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cargo Details */}
        <div className="card-elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            📍 Cargo Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Destination</p>
              <p className="text-gray-900 font-semibold">{shipment.destination}</p>
            </div>
            {shipment.service_type && (
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Service Type</p>
                <p className="text-gray-900 font-semibold">{shipment.service_type}</p>
              </div>
            )}
            {shipment.weight && (
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Weight</p>
                <p className="text-gray-900 font-semibold">{shipment.weight} kg</p>
              </div>
            )}
            {shipment.volume && (
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Volume</p>
                <p className="text-gray-900 font-semibold">{shipment.volume} m³</p>
              </div>
            )}
          </div>
          {shipment.cargo_description && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Description</p>
              <p className="text-gray-900">{shipment.cargo_description}</p>
            </div>
          )}
        </div>

        {/* Tracking History */}
        {shipment.history && shipment.history.length > 0 && (
          <div className="card-elevated">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              📊 Tracking History
            </h3>
            <div className="space-y-4">
              {shipment.history.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
                    {index < shipment.history!.length - 1 && (
                      <div className="w-1 h-16 bg-gray-200 my-2"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-900">{event.status}</span>
                      <span className="text-sm text-gray-600">{formatDate(event.created_at)}</span>
                    </div>
                    {event.location && (
                      <p className="text-sm text-gray-600">📍 {event.location}</p>
                    )}
                    {event.description && (
                      <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
