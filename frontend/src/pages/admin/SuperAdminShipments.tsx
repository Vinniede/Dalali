import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout.tsx";
import shipmentService from "../../services/shipmentService";
import branchService from "../../services/branchService";

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_phone?: string;
  sender_address?: string;
  receiver_name: string;
  receiver_phone?: string;
  receiver_address?: string;
  origin_branch_id: string | null;
  origin_country?: string;
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
  country?: string;
}

interface ShipmentFormData {
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  originCountry: string;
  destination: string;
  cargoDescription: string;
  weight: string;
  volume: string;
  serviceType: string;
  status: string;
}

const initialFormData: ShipmentFormData = {
  trackingNumber: "",
  senderName: "",
  senderPhone: "",
  senderAddress: "",
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  originCountry: "",
  destination: "",
  cargoDescription: "",
  weight: "",
  volume: "",
  serviceType: "Standard",
  status: "Created",
};

const SERVICE_TYPES = ["Standard", "Express", "Overnight", "Economy"];
const CREATE_STATUS_OPTIONS = ["Created", "In Transit"];
const EDIT_STATUS_OPTIONS = ["Created", "In Transit", "Delivered", "Delayed"];

// Comprehensive list of world countries and major cities for shipment destinations
const WORLD_DESTINATIONS = [
  // East Africa (Priority)
  "Nairobi, Kenya",
  "Dar es Salaam, Tanzania",
  "Kampala, Uganda",
  "Kigali, Rwanda",
  "Addis Ababa, Ethiopia",
  "Mogadishu, Somalia",
  "Djibouti, Djibouti",
  "Mombasa, Kenya",
  "Arusha, Tanzania",
  "Goma, Democratic Republic of Congo",

  // Central Africa
  "Kinshasa, Democratic Republic of Congo",
  "Brazzaville, Republic of Congo",
  "Bangui, Central African Republic",
  "N'Djamena, Chad",
  "Douala, Cameroon",
  "Yaoundé, Cameroon",

  // Southern Africa
  "Johannesburg, South Africa",
  "Cape Town, South Africa",
  "Harare, Zimbabwe",
  "Lusaka, Zambia",
  "Lilongwe, Malawi",
  "Gaborone, Botswana",
  "Windhoek, Namibia",

  // West Africa
  "Lagos, Nigeria",
  "Accra, Ghana",
  "Dakar, Senegal",
  "Abidjan, Côte d'Ivoire",
  "Bamako, Mali",
  "Ouagadougou, Burkina Faso",

  // North Africa
  "Cairo, Egypt",
  "Alexandria, Egypt",
  "Casablanca, Morocco",
  "Algiers, Algeria",
  "Tunis, Tunisia",
  "Tripoli, Libya",

  // Middle East
  "Dubai, United Arab Emirates",
  "Abu Dhabi, United Arab Emirates",
  "Doha, Qatar",
  "Riyadh, Saudi Arabia",
  "Jeddah, Saudi Arabia",
  "Kuwait City, Kuwait",
  "Beirut, Lebanon",
  "Tel Aviv, Israel",
  "Istanbul, Turkey",
  "Amman, Jordan",

  // South Asia
  "Mumbai, India",
  "Delhi, India",
  "Bangalore, India",
  "Chennai, India",
  "Kolkata, India",
  "Karachi, Pakistan",
  "Islamabad, Pakistan",
  "Dhaka, Bangladesh",
  "Colombo, Sri Lanka",
  "Kathmandu, Nepal",

  // Southeast Asia
  "Singapore",
  "Bangkok, Thailand",
  "Kuala Lumpur, Malaysia",
  "Jakarta, Indonesia",
  "Manila, Philippines",
  "Hanoi, Vietnam",
  "Ho Chi Minh City, Vietnam",
  "Phnom Penh, Cambodia",
  "Yangon, Myanmar",

  // East Asia
  "Hong Kong",
  "Shanghai, China",
  "Beijing, China",
  "Guangzhou, China",
  "Shenzhen, China",
  "Tokyo, Japan",
  "Seoul, South Korea",
  "Taipei, Taiwan",

  // Europe
  "London, United Kingdom",
  "Manchester, United Kingdom",
  "Paris, France",
  "Frankfurt, Germany",
  "Berlin, Germany",
  "Amsterdam, Netherlands",
  "Rotterdam, Netherlands",
  "Antwerp, Belgium",
  "Brussels, Belgium",
  "Madrid, Spain",
  "Barcelona, Spain",
  "Milan, Italy",
  "Rome, Italy",
  "Lisbon, Portugal",
  "Athens, Greece",
  "Warsaw, Poland",
  "Prague, Czech Republic",
  "Vienna, Austria",
  "Budapest, Hungary",
  "Stockholm, Sweden",
  "Copenhagen, Denmark",
  "Oslo, Norway",
  "Zurich, Switzerland",
  "Geneva, Switzerland",

  // North America
  "New York, United States",
  "Los Angeles, United States",
  "Chicago, United States",
  "Houston, United States",
  "San Francisco, United States",
  "Miami, United States",
  "Dallas, United States",
  "Atlanta, United States",
  "Seattle, United States",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Montreal, Canada",
  "Mexico City, Mexico",

  // South America
  "São Paulo, Brazil",
  "Rio de Janeiro, Brazil",
  "Salvador, Brazil",
  "Buenos Aires, Argentina",
  "Bogotá, Colombia",
  "Lima, Peru",
  "Santiago, Chile",
  "Caracas, Venezuela",
  "Quito, Ecuador",

  // Oceania
  "Sydney, Australia",
  "Melbourne, Australia",
  "Auckland, New Zealand",
  "Fiji",
];

// List of all countries for origin country selection
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Côte d'Ivoire",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of Congo", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
  "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
  "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
  "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Republic of Congo", "Republic of Korea", "Republic of South Sudan",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
  "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
].sort();

export const SuperAdminShipments: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState("all");
  const [shipments, setShipments] = React.useState<Shipment[]>([]);
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [editingShipmentId, setEditingShipmentId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<ShipmentFormData>(initialFormData);

  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊", path: "/admin/super/overview" },
    { id: "shipments", label: "Shipments", icon: "📦", path: "/admin/super/shipments" },
    { id: "users", label: "Users", icon: "👥", path: "/admin/super/users" },
    { id: "branches", label: "Branches", icon: "🏢", path: "/admin/super/branches" },
    { id: "services", label: "Services", icon: "🚚", path: "/admin/super/services" },
    { id: "tracking", label: "Tracking Control", icon: "📍", path: "/admin/super/tracking" },
    { id: "reports", label: "Reports", icon: "📈", path: "/admin/super/reports" },
    { id: "notifications", label: "Notifications", icon: "🔔", path: "/admin/super/notifications" },
    { id: "settings", label: "Settings", icon: "⚙️", path: "/admin/super/settings" },
  ];

  React.useEffect(() => {
    fetchShipments();
    fetchBranches();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await shipmentService.getShipments(100, 0);
      setShipments(response.data.shipments);
    } catch (err) {
      console.error("Failed to fetch shipments:", err);
      setError("Failed to load shipments");
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await branchService.getAllBranches(100, 0);
      setBranches(response.data.branches);
    } catch (err) {
      console.error("Failed to fetch branches:", err);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingShipmentId(null);
    setShowCreateForm(false);
  };

  const saveShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.senderName || !formData.receiverName || !formData.originCountry || !formData.destination) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        trackingNumber: formData.trackingNumber,
        senderName: formData.senderName,
        senderPhone: formData.senderPhone,
        senderAddress: formData.senderAddress,
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        receiverAddress: formData.receiverAddress,
        originCountry: formData.originCountry,
        destination: formData.destination,
        cargoDescription: formData.cargoDescription,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        volume: formData.volume ? parseFloat(formData.volume) : undefined,
        serviceType: formData.serviceType,
        status: formData.status,
      };

      if (editingShipmentId) {
        const response = await shipmentService.updateShipment(editingShipmentId, payload);
        setSuccess(`Shipment ${response.data.tracking_number} updated successfully`);
      } else {
        const response = await shipmentService.createShipment(payload);
        setSuccess(`Shipment created successfully. Tracking: ${response.data.tracking_number}`);
      }

      resetForm();
      await fetchShipments();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save shipment");
    } finally {
      setSaving(false);
    }
  };

  const handleEditShipment = async (shipmentId: string) => {
    try {
      setSaving(true);
      setError("");
      const response = await shipmentService.getShipmentById(shipmentId);
      const shipment = response.data as Shipment;
      setEditingShipmentId(shipment.id);
      setFormData({
        trackingNumber: shipment.tracking_number || "",
        senderName: shipment.sender_name || "",
        senderPhone: shipment.sender_phone || "",
        senderAddress: shipment.sender_address || "",
        receiverName: shipment.receiver_name || "",
        receiverPhone: shipment.receiver_phone || "",
        receiverAddress: shipment.receiver_address || "",
        originCountry: shipment.origin_country || "",
        destination: shipment.destination || "",
        cargoDescription: shipment.cargo_description || "",
        weight: shipment.weight ? String(shipment.weight) : "",
        volume: shipment.volume ? String(shipment.volume) : "",
        serviceType: shipment.service_type || "Standard",
        status: shipment.current_status || "Created",
      });
      setShowCreateForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load shipment details");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteShipment = async (shipment: Shipment) => {
    const confirmed = window.confirm(
      `Delete shipment ${shipment.tracking_number}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await shipmentService.deleteShipment(shipment.id);
      setSuccess(`Shipment ${shipment.tracking_number} deleted successfully`);
      await fetchShipments();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete shipment");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Pending":
      case "Created":
        return "bg-yellow-100 text-yellow-800";
      case "Delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredShipments = shipments.filter((shipment) => {
    if (filter === "all") return true;
    return shipment.current_status.toLowerCase().replace(/\s+/g, "-") === filter;
  });

  return (
    <DashboardLayout
      title="Global Shipments"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-4 sm:space-y-6">
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

        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white shadow sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold sm:text-xl">
                {editingShipmentId ? "Edit Shipment" : "Create New Shipment"}
              </h3>
              <p className="mt-1 text-sm text-blue-100 sm:text-base">
                Admins can create, edit, and delete shipments from here.
              </p>
            </div>
            <button
              onClick={() => {
                if (showCreateForm || editingShipmentId) {
                  resetForm();
                } else {
                  setShowCreateForm(true);
                }
              }}
              className="w-full rounded-lg bg-white px-4 py-3 font-bold text-blue-600 transition hover:bg-gray-100 sm:w-auto sm:px-6"
            >
              {showCreateForm || editingShipmentId ? "Close Form" : "+ Create Shipment"}
            </button>
          </div>
        </div>

        {(showCreateForm || editingShipmentId) && (
          <div className="rounded-lg bg-white p-4 shadow sm:p-6">
            <h3 className="mb-6 text-lg font-bold text-gray-900">
              {editingShipmentId ? "Edit Shipment Details" : "Create New Shipment"}
            </h3>
            <form onSubmit={saveShipment} className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">🆔 Order/Tracking Number (Optional)</label>
                <input
                  type="text"
                  placeholder="Leave empty for auto-generated number"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-600 mt-2">💡 If you leave empty, a unique number will be generated automatically</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Sender Name *</label>
                  <input type="text" value={formData.senderName} onChange={(e) => setFormData({ ...formData, senderName: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Sender Phone</label>
                  <input type="text" value={formData.senderPhone} onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Sender Address</label>
                  <input type="text" value={formData.senderAddress} onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Receiver Name *</label>
                  <input type="text" value={formData.receiverName} onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Receiver Phone</label>
                  <input type="text" value={formData.receiverPhone} onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Receiver Address</label>
                  <input type="text" value={formData.receiverAddress} onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Country of Origin *</label>
                  <select value={formData.originCountry} onChange={(e) => setFormData({ ...formData, originCountry: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={!!editingShipmentId}>
                    <option value="">Select country of origin</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Destination *</label>
                  <select value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select destination (City or Country)</option>
                    <optgroup label="📍 Branch Offices (Recommended)">
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.name}>{branch.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🌍 Worldwide Destinations">
                      {WORLD_DESTINATIONS.map((destination) => (
                        <option key={destination} value={destination}>{destination}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Service Type</label>
                  <select value={formData.serviceType} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {SERVICE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Status {editingShipmentId ? "*" : "(Creation only)"}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {(editingShipmentId ? EDIT_STATUS_OPTIONS : CREATE_STATUS_OPTIONS).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr_1fr]">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Description</label>
                  <textarea value={formData.cargoDescription} onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Weight (kg)</label>
                  <input type="number" min="0" step="0.01" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Volume</label>
                  <input type="number" min="0" step="0.01" value={formData.volume} onChange={(e) => setFormData({ ...formData, volume: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={saving} className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700 disabled:opacity-50">
                  {saving ? "Saving..." : editingShipmentId ? "Save Shipment Changes" : "Create Shipment"}
                </button>
                <button type="button" onClick={resetForm} className="rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-lg bg-white p-4 shadow sm:p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Filter Shipments</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              { id: "all", label: "All", active: "bg-blue-600" },
              { id: "created", label: "Created", active: "bg-yellow-600" },
              { id: "in-transit", label: "In Transit", active: "bg-blue-500" },
              { id: "delivered", label: "Delivered", active: "bg-green-600" },
              { id: "delayed", label: "Delayed", active: "bg-red-600" },
            ].map((item) => (
              <button key={item.id} onClick={() => setFilter(item.id)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${filter === item.id ? `${item.active} text-white` : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          {loading ? (
            <div className="p-6 text-center text-gray-600">Loading shipments...</div>
          ) : filteredShipments.length === 0 ? (
            <div className="p-6 text-center text-gray-600">No shipments found</div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Tracking Number</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Sender</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Receiver</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Destination</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Created</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShipments.map((shipment) => (
                      <tr key={shipment.id} className="border-b transition hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-blue-600">{shipment.tracking_number}</td>
                        <td className="px-6 py-4 text-gray-700">{shipment.sender_name}</td>
                        <td className="px-6 py-4 text-gray-700">{shipment.receiver_name}</td>
                        <td className="px-6 py-4 text-gray-700">{shipment.destination}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(shipment.current_status)}`}>{shipment.current_status}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(shipment.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => navigate(`/admin/branch/shipments/${shipment.id}`)} className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-200">View</button>
                            <button onClick={() => handleEditShipment(shipment.id)} className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-200">Edit</button>
                            <button onClick={() => handleDeleteShipment(shipment)} className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-200">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
                {filteredShipments.map((shipment) => (
                  <div key={shipment.id} className="rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-all text-sm font-bold text-blue-600">{shipment.tracking_number}</p>
                        <p className="mt-1 text-xs text-gray-500">{new Date(shipment.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(shipment.current_status)}`}>{shipment.current_status}</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><span className="font-semibold">Sender:</span> {shipment.sender_name}</p>
                      <p><span className="font-semibold">Receiver:</span> {shipment.receiver_name}</p>
                      <p><span className="font-semibold">Destination:</span> {shipment.destination}</p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button onClick={() => navigate(`/admin/branch/shipments/${shipment.id}`)} className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-200">View</button>
                      <button onClick={() => handleEditShipment(shipment.id)} className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-200">Edit</button>
                      <button onClick={() => handleDeleteShipment(shipment)} className="rounded-lg bg-red-100 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
