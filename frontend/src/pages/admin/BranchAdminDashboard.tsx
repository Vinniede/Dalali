import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout.tsx";
import shipmentService from "../../services/shipmentService";
import authService from "../../services/authService";
import { formatDate } from "../../services/utils";

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
  color: "primary" | "secondary" | "success" | "warning";
  subtitle: string;
}

export const BranchAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [shipments, setShipments] = React.useState<Shipment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [branchName, setBranchName] = React.useState("");

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
    { id: "overview", label: "Overview", icon: "📊", path: "/admin/branch/overview" },
    { id: "my-shipments", label: "My Shipments", icon: "📦", path: "/admin/branch/shipments" },
    { id: "create", label: "Create Shipment", icon: "➕", path: "/admin/branch/create" },
    { id: "incoming", label: "Incoming Cargo", icon: "📥", path: "/admin/branch/incoming" },
    { id: "outgoing", label: "Outgoing Cargo", icon: "📤", path: "/admin/branch/outgoing" },
    { id: "tracking", label: "Tracking Updates", icon: "📍", path: "/admin/branch/tracking" },
    { id: "profile", label: "Profile", icon: "👤", path: "/admin/branch/profile" },
  ];

  const kpis: KPICard[] = [
    { label: "Pending", value: stats.pendingShipments, icon: "P", color: "warning", subtitle: "Ready to process" },
    { label: "In Transit", value: stats.inTransit, icon: "T", color: "secondary", subtitle: "Currently en route" },
    { label: "Delivered", value: stats.delivered, icon: "D", color: "success", subtitle: "Successfully completed" },
    { label: "Today", value: stats.todayDeliveries, icon: "N", color: "primary", subtitle: "Completed today" },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await shipmentService.getShipments(100, 0);
        const allShipments = response.data.shipments;
        setShipments(allShipments.slice(0, 5));

        const pendingCount = allShipments.filter((s) => s.current_status === "Created").length;
        const inTransitCount = allShipments.filter((s) => s.current_status === "In Transit").length;
        const deliveredCount = allShipments.filter((s) => s.current_status === "Delivered").length;

        const today = new Date().toDateString();
        const todayDeliveries = allShipments.filter((s) => {
          const createdDate = new Date(s.created_at).toDateString();
          return createdDate === today && s.current_status === "Delivered";
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
          setBranchName("Your Branch");
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
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
      userName={user?.name || "Branch Admin"}
      branchName={branchName}
    >
      <div className="space-y-5 sm:space-y-8">
        <div className="rounded-lg border border-primary-100 bg-gradient-to-r from-primary-50 to-secondary-50 p-4 sm:p-6">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome back, {user?.name || "Branch Admin"}
          </h2>
          <p className="text-sm text-gray-600 sm:text-base">
            Manage daily operations at {branchName} branch
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="card-elevated transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600">{kpi.label}</p>
                  <p className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">{kpi.value}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700 sm:h-14 sm:w-14">
                  {kpi.icon}
                </span>
              </div>
              <p className={`mt-4 text-xs font-semibold ${
                kpi.color === "primary" ? "text-primary-700" :
                kpi.color === "secondary" ? "text-secondary-700" :
                kpi.color === "success" ? "text-success" :
                "text-warning"
              }`}>
                {kpi.subtitle}
              </p>
            </div>
          ))}
        </div>

        <div className="card-elevated">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate("/admin/branch/create")} className="btn-primary">
              Create Shipment
            </button>
            <button onClick={() => navigate("/admin/branch/tracking")} className="btn-accent">
              Update Tracking
            </button>
            <button onClick={() => navigate("/admin/branch/shipments")} className="btn-outline">
              View Shipments
            </button>
            <button onClick={() => navigate("/admin/branch/profile")} className="btn-ghost">
              Branch Profile
            </button>
          </div>
        </div>

        <div className="card-elevated">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Shipments</h3>
            <button
              onClick={() => navigate("/admin/branch/shipments")}
              className="text-left text-sm font-semibold text-primary-600 hover:text-primary-700 sm:text-right"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="mb-3 inline-block">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600"></div>
              </div>
              <p className="text-gray-600">Loading shipments...</p>
            </div>
          ) : shipments.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-medium text-gray-600">No shipments yet</p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-700">Tracking ID</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-700">Destination</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-700">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {shipments.map((shipment) => (
                      <tr key={shipment.id} className="table-row-hover">
                        <td className="px-4 py-4 font-mono font-bold text-primary-700">{shipment.tracking_number}</td>
                        <td className="px-4 py-4 text-gray-700">{shipment.destination}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${
                            shipment.current_status === "Delivered" ? "bg-success bg-opacity-10 text-success" :
                            shipment.current_status === "In Transit" ? "bg-warning bg-opacity-10 text-warning" :
                            shipment.current_status === "Created" ? "bg-info-100 text-info-900" :
                            "bg-error bg-opacity-10 text-error"
                          }`}>
                            {shipment.current_status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600">{formatDate(shipment.created_at)}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => navigate(`/admin/branch/shipments/${shipment.id}`)}
                            className="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 gap-3 md:hidden">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-all font-mono font-bold text-primary-700">{shipment.tracking_number}</p>
                        <p className="text-xs text-gray-500">{formatDate(shipment.created_at)}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${
                        shipment.current_status === "Delivered" ? "bg-success bg-opacity-10 text-success" :
                        shipment.current_status === "In Transit" ? "bg-warning bg-opacity-10 text-warning" :
                        shipment.current_status === "Created" ? "bg-info-100 text-info-900" :
                        "bg-error bg-opacity-10 text-error"
                      }`}>
                        {shipment.current_status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Destination:</span> {shipment.destination}
                    </p>
                    <button
                      onClick={() => navigate(`/admin/branch/shipments/${shipment.id}`)}
                      className="mt-3 rounded-lg bg-primary-100 px-3 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-200"
                    >
                      View Shipment
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-lg bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-5 text-white shadow-lg sm:p-8">
          <h3 className="mb-6 text-lg font-bold sm:text-xl">This Month's Performance</h3>
          <div className="grid grid-cols-2 gap-4 text-center sm:gap-8 md:grid-cols-4">
            {[
              { label: "Total Shipments", value: stats.totalShipments },
              { label: "On-Time Rate", value: `${stats.onTimeRate}%` },
              { label: "Avg Delivery", value: `${stats.avgDeliveryDays.toFixed(1)}d` },
              { label: "Delayed", value: stats.delayedCount },
            ].map((item) => (
              <div key={item.label}>
                <p className="mb-1 text-xl font-bold sm:text-2xl">{item.value}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-primary-100">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
