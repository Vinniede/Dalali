import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout.tsx";
import shipmentService from "../../services/shipmentService";
import userService from "../../services/userService";

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  current_status: string;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface KPIStats {
  totalShipments: number;
  activeDeliveries: number;
  deliveredToday: number;
  delayedShipments: number;
}

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = React.useState<Shipment[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [stats, setStats] = React.useState<KPIStats>({
    totalShipments: 0,
    activeDeliveries: 0,
    deliveredToday: 0,
    delayedShipments: 0,
  });

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: "📊",
      path: "/admin/super/overview",
    },
    {
      id: "shipments",
      label: "Shipments",
      icon: "📦",
      path: "/admin/super/shipments",
    },
    { id: "users", label: "Users", icon: "👥", path: "/admin/super/users" },
    {
      id: "branches",
      label: "Branches",
      icon: "🏢",
      path: "/admin/super/branches",
    },
    {
      id: "services",
      label: "Services",
      icon: "🚚",
      path: "/admin/super/services",
    },
    {
      id: "tracking",
      label: "Tracking Control",
      icon: "📍",
      path: "/admin/super/tracking",
    },
    {
      id: "reports",
      label: "Reports",
      icon: "📈",
      path: "/admin/super/reports",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "🔔",
      path: "/admin/super/notifications",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      path: "/admin/super/settings",
    },
  ];

  // Fetch data on component mount
  React.useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch shipments
      const shippingResponse = await shipmentService.getShipments(100, 0);
      const allShipments = shippingResponse.data.shipments || [];
      setShipments(allShipments.slice(0, 5));

      // Fetch users
      const usersResponse = await userService.getAllUsers(100, 0);
      const allUsers = usersResponse.data.users || [];
      setUsers(allUsers.slice(0, 5));

      // Calculate statistics from actual data
      const today = new Date().toDateString();
      const deliveredToday = allShipments.filter(
        (s) =>
          new Date(s.created_at).toDateString() === today &&
          s.current_status === "Delivered"
      ).length;

      const inTransit = allShipments.filter(
        (s) => s.current_status === "In Transit"
      ).length;
      const delayed = allShipments.filter(
        (s) => s.current_status === "Delayed"
      ).length;

      setStats({
        totalShipments: allShipments.length,
        activeDeliveries: inTransit,
        deliveredToday,
        delayedShipments: delayed,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Dashboard Overview"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            Welcome, Super Admin
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Manage the entire Dalali Express logistics network
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-600">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium">
                      Total Shipments
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                      {stats.totalShipments}
                    </p>
                  </div>
                  <span className="text-2xl sm:text-4xl">📦</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-green-600">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium">
                      Active Deliveries
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                      {stats.activeDeliveries}
                    </p>
                  </div>
                  <span className="text-2xl sm:text-4xl">🚚</span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mt-3 sm:mt-4">
                  Currently in transit
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-purple-600">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium">
                      Delivered Today
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                      {stats.deliveredToday}
                    </p>
                  </div>
                  <span className="text-2xl sm:text-4xl">✅</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-red-600">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium">
                      Delayed Shipments
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                      {stats.delayedShipments}
                    </p>
                  </div>
                  <span className="text-2xl sm:text-4xl">⚠️</span>
                </div>
                <p className="text-red-600 text-xs sm:text-sm mt-3 sm:mt-4">
                  Require attention
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button 
                  onClick={() => navigate("/admin/super/shipments")}
                  className="px-3 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm sm:text-base"
                >
                  + Create Shipment
                </button>
                <button className="px-3 sm:px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-sm sm:text-base">
                  + Add Branch
                </button>
                <button 
                  onClick={() => navigate("/admin/super/users")}
                  className="px-3 sm:px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition text-sm sm:text-base"
                >
                  + Add Branch Admin
                </button>
                <button 
                  onClick={() => navigate("/admin/super/reports")}
                  className="px-3 sm:px-6 py-2 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition text-sm sm:text-base"
                >
                  📊 View Reports
                </button>
              </div>
            </div>

            {/* Recent Shipments & Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Shipments */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  Recent Shipments
                </h3>
                {shipments && shipments.length > 0 ? (
                  <div className="space-y-3">
                    {shipments.map((shipment) => (
                      <div
                        key={shipment.id}
                        className="flex items-start gap-3 pb-3 border-b last:border-b-0"
                      >
                        <div className="text-lg flex-shrink-0">📦</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {shipment.tracking_number}
                          </p>
                          <p className="text-xs text-gray-600">
                            {shipment.sender_name} → {shipment.receiver_name}
                          </p>
                          <span
                            className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                              shipment.current_status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : shipment.current_status === "In Transit"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {shipment.current_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No shipments yet</p>
                )}
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  Recent Branch Admins
                </h3>
                {users && users.length > 0 ? (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-start gap-3 pb-3 border-b last:border-b-0"
                      >
                        <div className="text-lg flex-shrink-0">👤</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {user.email}
                          </p>
                          <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">
                            {user.role?.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No users yet</p>
                )}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow text-white p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                System Overview
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">{users.length}</p>
                  <p className="text-blue-100 text-xs sm:text-sm">Active Users</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">{stats.totalShipments}</p>
                  <p className="text-blue-100 text-xs sm:text-sm">Total Shipments</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">{stats.activeDeliveries}</p>
                  <p className="text-blue-100 text-xs sm:text-sm">In Transit</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">99.9%</p>
                  <p className="text-blue-100 text-xs sm:text-sm">Uptime</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
