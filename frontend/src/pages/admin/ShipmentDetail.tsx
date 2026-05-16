import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout.tsx";
import shipmentService from "../../services/shipmentService";
import authService from "../../services/authService";
import { formatDate } from "../../services/utils";

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_phone?: string;
  sender_address?: string;
  receiver_name: string;
  receiver_phone?: string;
  receiver_address?: string;
  origin_branch_id?: string | null;
  origin_branch_name?: string;
  origin_country?: string;
  destination: string;
  cargo_description?: string;
  weight?: number;
  volume?: number;
  service_type?: string;
  current_status: string;
  created_at: string;
  latest_update?: any;
  history?: any[];
}

export const ShipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = authService.getUser();
  const [shipment, setShipment] = React.useState<Shipment | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [branchName, setBranchName] = React.useState("");

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: "📊",
      path: "/admin/branch/overview",
    },
    {
      id: "my-shipments",
      label: "My Shipments",
      icon: "📦",
      path: "/admin/branch/shipments",
    },
    {
      id: "create",
      label: "Create Shipment",
      icon: "➕",
      path: "/admin/branch/create",
    },
    {
      id: "incoming",
      label: "Incoming Cargo",
      icon: "📥",
      path: "/admin/branch/incoming",
    },
    {
      id: "outgoing",
      label: "Outgoing Cargo",
      icon: "📤",
      path: "/admin/branch/outgoing",
    },
    {
      id: "tracking",
      label: "Tracking Updates",
      icon: "📍",
      path: "/admin/branch/tracking",
    },
    {
      id: "profile",
      label: "Profile",
      icon: "👤",
      path: "/admin/branch/profile",
    },
  ];

  React.useEffect(() => {
    const fetchShipment = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("Shipment ID not found");

        const response = await shipmentService.getShipmentById(id);
        setShipment(response.data);

        if (user?.branch_id) {
          setBranchName("Your Branch");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch shipment");
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
        userName={user?.name || "Branch Admin"}
        branchName={branchName}
      >
        <div className="p-12 text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600"></div>
          </div>
          <p className="font-medium text-gray-600">
            Loading shipment details...
          </p>
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
        userName={user?.name || "Branch Admin"}
        branchName={branchName}
      >
        <div className="mb-6 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error || "Shipment not found"}
        </div>
        <button
          onClick={() => navigate("/admin/branch/shipments")}
          className="btn-primary"
        >
          Back to Shipments
        </button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Shipment ${shipment.tracking_number}`}
      menuItems={menuItems}
      userRole="branch-admin"
      userName={user?.name || "Branch Admin"}
      branchName={branchName}
    >
      <div className="space-y-4 sm:space-y-6">
        <button
          onClick={() => navigate("/admin/branch/shipments")}
          className="flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700"
        >
          Back to Shipments
        </button>

        <div className="card-elevated bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="break-all text-2xl font-bold text-gray-900 sm:text-3xl">
                {shipment.tracking_number}
              </h2>
              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                Created on {formatDate(shipment.created_at)}
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold ${
                shipment.current_status === "Delivered"
                  ? "border border-success border-opacity-20 bg-success bg-opacity-10 text-success"
                  : shipment.current_status === "In Transit"
                    ? "border border-warning border-opacity-20 bg-warning bg-opacity-10 text-warning"
                    : shipment.current_status === "Created"
                      ? "border border-info-300 bg-info-100 text-info-900"
                      : "border border-error border-opacity-20 bg-error bg-opacity-10 text-error"
              }`}
            >
              {shipment.current_status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
          <div className="card-elevated">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Sender Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                  Name
                </p>
                <p className="font-semibold text-gray-900">
                  {shipment.sender_name}
                </p>
              </div>
              {shipment.sender_phone && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                    Phone
                  </p>
                  <p className="text-gray-900">{shipment.sender_phone}</p>
                </div>
              )}
              {shipment.sender_address && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                    Address
                  </p>
                  <p className="text-gray-900 break-words">
                    {shipment.sender_address}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="card-elevated">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Receiver Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                  Name
                </p>
                <p className="font-semibold text-gray-900">
                  {shipment.receiver_name}
                </p>
              </div>
              {shipment.receiver_phone && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                    Phone
                  </p>
                  <p className="text-gray-900">{shipment.receiver_phone}</p>
                </div>
              )}
              {shipment.receiver_address && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                    Address
                  </p>
                  <p className="text-gray-900 break-words">
                    {shipment.receiver_address}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card-elevated">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Cargo Details
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Country of Origin
              </p>
              <p className="font-semibold text-gray-900">
                {shipment.origin_country ||
                  shipment.origin_branch_name ||
                  "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Destination
              </p>
              <p className="font-semibold text-gray-900">
                {shipment.destination}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Current Location
              </p>
              <p className="font-semibold text-gray-900">
                {shipment.latest_update?.location ||
                  shipment.origin_country ||
                  "N/A"}
              </p>
            </div>
            {shipment.service_type && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                  Service Type
                </p>
                <p className="font-semibold text-gray-900">
                  {shipment.service_type}
                </p>
              </div>
            )}
            {shipment.weight && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                  Weight
                </p>
                <p className="font-semibold text-gray-900">
                  {shipment.weight} kg
                </p>
              </div>
            )}
            {shipment.volume && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                  Volume
                </p>
                <p className="font-semibold text-gray-900">
                  {shipment.volume} m3
                </p>
              </div>
            )}
          </div>
          {shipment.cargo_description && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-600">
                Description
              </p>
              <p className="break-words text-gray-900">
                {shipment.cargo_description}
              </p>
            </div>
          )}
        </div>

        {shipment.history && shipment.history.length > 0 && (
          <div className="card-elevated">
            <h3 className="mb-6 text-lg font-bold text-gray-900">
              Tracking History
            </h3>
            <div className="space-y-4">
              {shipment.history.map((event, index) => (
                <div key={index} className="flex gap-3 sm:gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full bg-primary-600"></div>
                    {index < shipment.history!.length - 1 && (
                      <div className="my-2 h-16 w-1 bg-gray-200"></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <span className="font-bold text-gray-900">
                        {event.status}
                      </span>
                      <span className="text-xs text-gray-600 sm:text-sm">
                        {formatDate(event.created_at)}
                      </span>
                    </div>
                    {event.location && (
                      <p className="text-sm text-gray-600">{event.location}</p>
                    )}
                    {event.description && (
                      <p className="mt-1 break-words text-sm text-gray-700">
                        {event.description}
                      </p>
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
