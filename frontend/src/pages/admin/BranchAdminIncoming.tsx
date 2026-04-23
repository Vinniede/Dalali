import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';

interface Cargo {
  id: string;
  itemDescription: string;
  weight: number;
  arrivalDate: string;
  sender: string;
  status: 'Received' | 'Processing' | 'Ready';
}

export const BranchAdminIncoming: React.FC = () => {
  const branchName = 'Dar es Salaam';
  const [cargoList, setCargoList] = React.useState<Cargo[]>([
    { id: 'C001', itemDescription: 'Electronics Package', weight: 5.2, arrivalDate: '2024-04-21', sender: 'Entebbe Branch', status: 'Received' },
    { id: 'C002', itemDescription: 'Textile Goods', weight: 12.5, arrivalDate: '2024-04-20', sender: 'Kinshasa Branch', status: 'Processing' },
    { id: 'C003', itemDescription: 'Documents Bundle', weight: 1.2, arrivalDate: '2024-04-19', sender: 'Entebbe Branch', status: 'Ready' },
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
      case 'Received':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateStatus = (id: string, newStatus: Cargo['status']) => {
    setCargoList(cargoList.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  return (
    <DashboardLayout
      title="Incoming Cargo"
      menuItems={menuItems}
      userRole="branch-admin"
      userName="Branch Admin"
      branchName={branchName}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Total Incoming</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{cargoList.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Processing</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{cargoList.filter((c) => c.status === 'Processing').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Ready to Assign</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{cargoList.filter((c) => c.status === 'Ready').length}</p>
          </div>
        </div>

        {/* Cargo Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Item</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Weight (kg)</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">From</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Arrival Date</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cargoList.map((cargo) => (
                <tr key={cargo.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-900">{cargo.itemDescription}</td>
                  <td className="px-6 py-4 text-gray-700">{cargo.weight}</td>
                  <td className="px-6 py-4 text-gray-700">{cargo.sender}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{cargo.arrivalDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cargo.status)}`}>
                      {cargo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {cargo.status === 'Received' && (
                      <button
                        onClick={() => updateStatus(cargo.id, 'Processing')}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm font-medium transition"
                      >
                        Process
                      </button>
                    )}
                    {cargo.status === 'Processing' && (
                      <button
                        onClick={() => updateStatus(cargo.id, 'Ready')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium transition"
                      >
                        Mark Ready
                      </button>
                    )}
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium transition">
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
