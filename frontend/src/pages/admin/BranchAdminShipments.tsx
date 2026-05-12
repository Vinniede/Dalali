import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';
import shipmentService from '../../services/shipmentService';
import branchService from '../../services/branchService';
import authService from '../../services/authService';
import { formatDate } from '../../services/utils';

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_phone?: string;
  sender_address?: string;
  receiver_name: string;
  receiver_phone?: string;
  receiver_address?: string;
  origin_branch_id: string;
  destination: string;
  cargo_description?: string;
  weight?: number;
  volume?: number;
  service_type?: string;
  current_status: string;
  created_at: string;
}

interface Branch {
  id: string;
  name: string;
  country: string;
}

interface EditFormData {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  destination: string;
  cargoDescription: string;
  weight: string;
  volume: string;
  serviceType: string;
  status: string;
}

const SERVICE_TYPES = ['Standard', 'Express', 'Overnight', 'Economy'];
const EDIT_STATUS_OPTIONS = ['Created', 'In Transit', 'Delivered', 'Delayed'];

const initialEditForm: EditFormData = {
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
  serviceType: 'Standard',
  status: 'Created',
};

export const BranchAdminShipments: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [shipments, setShipments] = React.useState<Shipment[]>([]);
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [branchName, setBranchName] = React.useState('');
  const [filter, setFilter] = React.useState('All');
  const [editingShipmentId, setEditingShipmentId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<EditFormData>(initialEditForm);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/admin/branch/overview' },
    { id: 'my-shipments', label: 'My Shipments', icon: '📦', path: '/admin/branch/shipments' },
    { id: 'create', label: 'Create Shipment', icon: '➕', path: '/admin/branch/create' },
    { id: 'incoming', label: 'Incoming Cargo', icon: '📥', path: '/admin/branch/incoming' },
    { id: 'outgoing', label: 'Outgoing Cargo', icon: '📤', path: '/admin/branch/outgoing' },
    { id: 'tracking', label: 'Tracking Updates', icon: '📍', path: '/admin/branch/tracking' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/admin/branch/profile' },
  ];

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [shipmentsResponse, branchesResponse] = await Promise.all([
        shipmentService.getShipments(100, 0),
        branchService.getAllBranches(100, 0),
      ]);

      setShipments(shipmentsResponse.data.shipments);
      const branchList = branchesResponse.data.branches as Branch[];
      setBranches(branchList);

      if (user?.branch_id) {
        const currentBranch = branchList.find((branch) => String(branch.id) === String(user.branch_id));
        setBranchName(currentBranch?.name || 'Your Branch');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  }, [user?.branch_id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredShipments = shipments.filter((shipment) => {
    if (filter === 'All') {
      return true;
    }
    return shipment.current_status === filter;
  });

  const canManageShipment = (shipment: Shipment) =>
    String(shipment.origin_branch_id) === String(user?.branch_id);

  const getShipmentFlow = (shipment: Shipment) => {
    if (String(shipment.origin_branch_id) === String(user?.branch_id)) {
      return 'Outgoing';
    }
    return 'Incoming';
  };

  const handleViewShipment = (shipmentId: string) => {
    navigate(`/admin/branch/shipments/${shipmentId}`);
  };

  const handleEditShipment = async (shipmentId: string) => {
    try {
      setSaving(true);
      setError('');
      const response = await shipmentService.getShipmentById(shipmentId);
      const shipment = response.data as Shipment;

      setEditingShipmentId(shipment.id);
      setEditForm({
        senderName: shipment.sender_name || '',
        senderPhone: shipment.sender_phone || '',
        senderAddress: shipment.sender_address || '',
        receiverName: shipment.receiver_name || '',
        receiverPhone: shipment.receiver_phone || '',
        receiverAddress: shipment.receiver_address || '',
        destination: shipment.destination || '',
        cargoDescription: shipment.cargo_description || '',
        weight: shipment.weight ? String(shipment.weight) : '',
        volume: shipment.volume ? String(shipment.volume) : '',
        serviceType: shipment.service_type || 'Standard',
        status: shipment.current_status || 'Created',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load shipment details');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingShipmentId) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await shipmentService.updateShipment(editingShipmentId, {
        senderName: editForm.senderName,
        senderPhone: editForm.senderPhone,
        senderAddress: editForm.senderAddress,
        receiverName: editForm.receiverName,
        receiverPhone: editForm.receiverPhone,
        receiverAddress: editForm.receiverAddress,
        destination: editForm.destination,
        cargoDescription: editForm.cargoDescription,
        weight: editForm.weight ? parseFloat(editForm.weight) : undefined,
        volume: editForm.volume ? parseFloat(editForm.volume) : undefined,
        serviceType: editForm.serviceType,
        status: editForm.status,
      });

      setSuccess('Shipment updated successfully');
      setEditingShipmentId(null);
      setEditForm(initialEditForm);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update shipment');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteShipment = async (shipment: Shipment) => {
    const confirmed = window.confirm(
      `Delete shipment ${shipment.tracking_number}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await shipmentService.deleteShipment(shipment.id);
      setSuccess(`Shipment ${shipment.tracking_number} deleted successfully`);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete shipment');
    } finally {
      setSaving(false);
    }
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

        {success && (
          <div className="alert-success">
            <span>{success}</span>
          </div>
        )}

        {editingShipmentId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="card-elevated max-h-[90vh] w-full max-w-4xl overflow-y-auto bg-white">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Shipment</h2>
                  <p className="text-sm text-gray-600">
                    Update shipment details for the originating branch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingShipmentId(null);
                    setEditForm(initialEditForm);
                  }}
                  className="btn-ghost"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-6">
                <div className="card">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Sender Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <input
                      type="text"
                      value={editForm.senderName}
                      onChange={(e) => setEditForm({ ...editForm, senderName: e.target.value })}
                      className="input-field"
                      placeholder="Sender Name"
                      required
                    />
                    <input
                      type="tel"
                      value={editForm.senderPhone}
                      onChange={(e) => setEditForm({ ...editForm, senderPhone: e.target.value })}
                      className="input-field"
                      placeholder="Sender Phone"
                    />
                    <input
                      type="text"
                      value={editForm.senderAddress}
                      onChange={(e) => setEditForm({ ...editForm, senderAddress: e.target.value })}
                      className="input-field"
                      placeholder="Sender Address"
                    />
                  </div>
                </div>

                <div className="card">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Receiver Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <input
                      type="text"
                      value={editForm.receiverName}
                      onChange={(e) => setEditForm({ ...editForm, receiverName: e.target.value })}
                      className="input-field"
                      placeholder="Receiver Name"
                      required
                    />
                    <input
                      type="tel"
                      value={editForm.receiverPhone}
                      onChange={(e) => setEditForm({ ...editForm, receiverPhone: e.target.value })}
                      className="input-field"
                      placeholder="Receiver Phone"
                    />
                    <input
                      type="text"
                      value={editForm.receiverAddress}
                      onChange={(e) => setEditForm({ ...editForm, receiverAddress: e.target.value })}
                      className="input-field"
                      placeholder="Receiver Address"
                    />
                  </div>
                </div>

                <div className="card">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Cargo Details</h3>
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <select
                      value={editForm.destination}
                      onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">Select Destination</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.name}>
                          {branch.name} - {branch.country}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editForm.serviceType}
                      onChange={(e) => setEditForm({ ...editForm, serviceType: e.target.value })}
                      className="input-field"
                    >
                      {SERVICE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="input-field"
                    >
                      {EDIT_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={editForm.cargoDescription}
                    onChange={(e) => setEditForm({ ...editForm, cargoDescription: e.target.value })}
                    className="input-field mb-4"
                    rows={3}
                    placeholder="Cargo Description"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.weight}
                      onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                      className="input-field"
                      placeholder="Weight (kg)"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.volume}
                      onChange={(e) => setEditForm({ ...editForm, volume: e.target.value })}
                      className="input-field"
                      placeholder="Volume (m³)"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="btn-primary flex-1">
                    {saving ? 'Saving changes...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingShipmentId(null);
                      setEditForm(initialEditForm);
                    }}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card bg-white shadow-base border border-gray-200">
          <div className="flex gap-2 flex-wrap">
            {['All', 'Created', 'In Transit', 'Delivered', 'Delayed'].map((status) => (
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
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Flow</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredShipments.map((shipment) => {
                    const canManage = canManageShipment(shipment);

                    return (
                      <tr key={shipment.id} className="table-row-hover hover:bg-primary-50">
                        <td className="px-6 py-4 font-bold text-primary-700 font-mono">{shipment.tracking_number}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium">{shipment.sender_name}</td>
                        <td className="px-6 py-4 text-gray-700">{shipment.receiver_name}</td>
                        <td className="px-6 py-4 text-gray-700">{shipment.destination}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                              getShipmentFlow(shipment) === 'Outgoing'
                                ? 'bg-primary-100 text-primary-800'
                                : 'bg-secondary-100 text-secondary-800'
                            }`}
                          >
                            {getShipmentFlow(shipment)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            shipment.current_status === 'Delivered'
                              ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-20'
                              : shipment.current_status === 'In Transit'
                                ? 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20'
                                : shipment.current_status === 'Created'
                                  ? 'bg-info-100 text-info-900 border border-info-300'
                                  : 'bg-error bg-opacity-10 text-error border border-error border-opacity-20'
                          }`}>
                            {shipment.current_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-sm">{formatDate(shipment.created_at)}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleViewShipment(shipment.id)}
                              className="px-3 py-1.5 bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg text-xs font-bold transition-colors duration-200"
                            >
                              👁️ View
                            </button>
                            <button
                              onClick={() => handleEditShipment(shipment.id)}
                              disabled={!canManage || saving}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors duration-200 ${
                                canManage
                                  ? 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteShipment(shipment)}
                              disabled={!canManage || saving}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors duration-200 ${
                                canManage
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
