import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';

interface OutgoingCargo {
  id: string;
  trackingId: string;
  destination: string;
  weight: number;
  readyDate: string;
  status: 'Ready' | 'Dispatched' | 'In Transit';
}

export const BranchAdminOutgoing: React.FC = () => {
  const branchName = 'Dar es Salaam';
  const [cargoList, setCargoList] = React.useState<OutgoingCargo[]>([
    { id: 'O001', trackingId: 'XF27-001', destination: 'Entebbe', weight: 5.2, readyDate: '2024-04-21', status: 'Ready' },
    { id: 'O002', trackingId: 'XF27-002', destination: 'Kinshasa', weight: 12.5, readyDate: '2024-04-20', status: 'Dispatched' },
    { id: 'O003', trackingId: 'XF27-003', destination: 'Entebbe', weight: 8.7, readyDate: '2024-04-19', status: 'In Transit' },
  ]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/admin/branch/overview' },
    { id: 'my-shipments', label: 'My Shipments', icon: '📦', path: '/admin/branch/shipments' },
    { id: 'create', label: 'Create Shipment', icon: '➕', path: '/admin/branch/create' },
    { id: 'incoming', label: 'Incoming Cargo', icon: '📥', path: '/admin/branch/incoming' },
    { id: 'outgoing', label: 'Outgoing Cargo', icon: '📤', path: '/admin/branch/outgoing' },
    { id: 'tracking', label: 'Tracking Updates', icon: '📍', path: '/admin/branch/tracking' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/admin/branch/profile' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-800';
      case 'Dispatched':
        return 'bg-blue-100 text-blue-800';
      case 'In Transit':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateStatus = (id: string, newStatus: OutgoingCargo['status']) => {
    setCargoList(cargoList.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  return (
    <DashboardLayout
      title="Outgoing Cargo"
      menuItems={menuItems}
      userRole="branch-admin"
      userName="Branch Admin"
      branchName={branchName}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Ready to Dispatch</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{cargoList.filter((c) => c.status === 'Ready').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">In Transit</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{cargoList.filter((c) => c.status === 'In Transit').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Total Weight (kg)</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {cargoList.reduce((sum, c) => sum + c.weight, 0).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Outgoing Cargo Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Tracking ID</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Destination</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Weight (kg)</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Ready Date</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cargoList.map((cargo) => (
                <tr key={cargo.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-900">{cargo.trackingId}</td>
                  <td className="px-6 py-4 text-gray-700">{cargo.destination}</td>
                  <td className="px-6 py-4 text-gray-700">{cargo.weight}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{cargo.readyDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cargo.status)}`}>
                      {cargo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {cargo.status === 'Ready' && (
                      <button
                        onClick={() => updateStatus(cargo.id, 'Dispatched')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium transition"
                      >
                        Dispatch
                      </button>
                    )}
                    {cargo.status === 'Dispatched' && (
                      <button
                        onClick={() => updateStatus(cargo.id, 'In Transit')}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm font-medium transition"
                      >
                        Ship
                      </button>
                    )}
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Export Manifest</h3>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
              📋 Print Manifest
            </button>
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
              📊 Export to Excel
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
