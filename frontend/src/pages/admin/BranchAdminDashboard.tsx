import React from 'react';
import { useNavigate } from 'react-router-dom';
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
}

interface KPICard {
  label: string;
  value: number | string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'warning';
  subtitle: string;
}

export const BranchAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [shipments, setShipments] = React.useState<Shipment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [branchName, setBranchName] = React.useState('');

  const [stats, setStats] = React.useState({
    pendingShipments: 0,
    inTransit: 0,
    delivered: 0,
    todayDeliveries: 0,
    totalShipments: 0,
    onTimeRate: 0,
    avgDeliveryDays: 0,
    delayedCount: 0,
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

  const kpis: KPICard[] = [
    {
      label: 'Pending',
      value: stats.pendingShipments,
      icon: '⏳',
      color: 'warning',
      subtitle: 'Ready to process',
    },
    {
      label: 'In Transit',
      value: stats.inTransit,
      icon: '🚚',
      color: 'secondary',
      subtitle: 'Currently en route',
    },
    {
      label: 'Delivered',
      value: stats.delivered,
      icon: '✅',
      color: 'success',
      subtitle: 'Successfully completed',
    },
    {
      label: 'Today',
      value: stats.todayDeliveries,
      icon: '📅',
      color: 'primary',
      subtitle: 'Completed today',
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await shipmentService.getShipments(100, 0);
        const allShipments = response.data.shipments;
        setShipments(allShipments.slice(0, 5));

        // Calculate stats
        const pendingCount = allShipments.filter((s) => s.current_status === 'Created').length;
        const inTransitCount = allShipments.filter((s) => s.current_status === 'In Transit').length;
        const deliveredCount = allShipments.filter((s) => s.current_status === 'Delivered').length;

        // Count today's deliveries
        const today = new Date().toDateString();
        const todayDeliveries = allShipments.filter((s) => {
          const createdDate = new Date(s.created_at).toDateString();
          return createdDate === today && s.current_status === 'Delivered';
        }).length;

        setStats({
          pendingShipments: pendingCount,
          inTransit: inTransitCount,
          delivered: deliveredCount,
          todayDeliveries,
          totalShipments: allShipments.length,
          onTimeRate: 95,
          avgDeliveryDays: 2.1,
          delayedCount: 3,
        });

        if (user?.branch_id) {
          setBranchName('Your Branch');
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <DashboardLayout
      title="Branch Operations"
      menuItems={menuItems}
      userRole="branch-admin"
      userName={user?.name || 'Branch Admin'}
      branchName={branchName}
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'Branch Admin'} 👋</h2>
          <p className="text-gray-600">Manage daily operations at {branchName} branch</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="card-elevated hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{kpi.label}</p>
                  <p className="text-4xl font-bold text-gray-900 mt-3">{kpi.value}</p>
                </div>
                <span className="text-5xl opacity-75">{kpi.icon}</span>
              </div>
              <p className={`text-xs font-semibold mt-4 ${
                kpi.color === 'primary' ? 'text-primary-700' :
                kpi.color === 'secondary' ? 'text-secondary-700' :
                kpi.color === 'success' ? 'text-success' :
                'text-warning'
              }`}>
                {kpi.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card-elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/admin/branch/create')}
              className="btn-primary"
            >
              ➕ Create Shipment
            </button>
            <button className="btn-accent">
              📍 Update Tracking
            </button>
            <button className="btn-outline">
              📋 View Inventory
            </button>
            <button className="btn-ghost">
              📊 Today's Report
            </button>
          </div>
        </div>

        {/* Recent Shipments */}
        <div className="card-elevated">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Shipments</h3>
            <a href="/admin/branch/shipments" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
              View All →
            </a>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block mb-3">
                  <div className="w-8 h-8 border-3 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600">Loading shipments...</p>
              </div>
            ) : shipments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl mb-2">📦</p>
                <p className="text-gray-600 font-medium">No shipments yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Tracking ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Destination</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shipments.map((shipment) => (
                    <tr key={shipment.id} className="table-row-hover">
                      <td className="px-4 py-4 font-bold text-primary-700 font-mono">{shipment.tracking_number}</td>
                      <td className="px-4 py-4 text-gray-700">{shipment.destination}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                          shipment.current_status === 'Delivered' ? 'bg-success bg-opacity-10 text-success' :
                          shipment.current_status === 'In Transit' ? 'bg-warning bg-opacity-10 text-warning' :
                          shipment.current_status === 'Created' ? 'bg-info-100 text-info-900' :
                          'bg-error bg-opacity-10 text-error'
                        }`}>
                          {shipment.current_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600">{formatDate(shipment.created_at)}</td>
                      <td className="px-4 py-4">
                        <button className="text-primary-600 hover:text-primary-700 font-semibold text-xs transition-colors">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-lg text-white p-8 shadow-lg">
          <h3 className="text-xl font-bold mb-8">This Month's Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Total Shipments', value: stats.totalShipments, icon: '📦' },
              { label: 'On-Time Rate', value: `${stats.onTimeRate}%`, icon: '📈' },
              { label: 'Avg Delivery', value: `${stats.avgDeliveryDays.toFixed(1)}d`, icon: '⏱️' },
              { label: 'Delayed', value: stats.delayedCount, icon: '⚠️' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-2xl font-bold mb-1">{item.value}</p>
                <p className="text-primary-100 text-xs font-medium uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
