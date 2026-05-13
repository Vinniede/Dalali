import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout.tsx";
import shipmentService from "../../services/shipmentService";
import branchService from "../../services/branchService";
import authService from "../../services/authService";

interface Branch {
  id: string;
  name: string;
  country: string;
}

const SERVICE_TYPES = ["Standard", "Express", "Overnight", "Economy"];
const CREATE_STATUS_OPTIONS = ["Created", "In Transit"];

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
  "Bangkok, Thailand",
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
  "Istanbul, Turkey",
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

export const BranchAdminCreateShipment: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [branchName, setBranchName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const [formData, setFormData] = React.useState({
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
  });

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
    const fetchBranches = async () => {
      try {
        const response = await branchService.getAllBranches(100, 0);
        const branchList = response.data.branches as Branch[];
        setBranches(branchList);

        if (user?.branch_id) {
          const userBranch = branchList.find((b) => b.id === user.branch_id);
          if (userBranch) {
            setBranchName(userBranch.name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch branches:", err);
      }
    };

    fetchBranches();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    const validationErrors = [];
    
    if (!formData.senderName.trim()) validationErrors.push("Sender name is required");
    if (!formData.senderPhone.trim()) validationErrors.push("Sender phone is required");
    if (!formData.senderAddress.trim()) validationErrors.push("Sender address is required");
    if (!formData.receiverName.trim()) validationErrors.push("Receiver name is required");
    if (!formData.receiverPhone.trim()) validationErrors.push("Receiver phone is required");
    if (!formData.receiverAddress.trim()) validationErrors.push("Receiver address is required");
    if (!formData.originCountry.trim()) validationErrors.push("Country of origin is required - please select from dropdown");
    if (!formData.destination.trim()) validationErrors.push("Destination is required - please select from dropdown");
    if (!formData.cargoDescription.trim()) validationErrors.push("Cargo description is required");
    if (!formData.weight || parseFloat(formData.weight) <= 0) validationErrors.push("Weight must be greater than 0");

    if (validationErrors.length > 0) {
      setError(validationErrors.join("\n"));
      setLoading(false);
      return;
    }

    try {
      if (!user?.branch_id) {
        throw new Error("User branch information not available");
      }

      console.log('[CreateShipment] Submitting form with data:', {
        sender: formData.senderName,
        receiver: formData.receiverName,
        destination: formData.destination,
        branch_id: user.branch_id,
      });

      const response = await shipmentService.createShipment({
        trackingNumber: formData.trackingNumber || undefined,
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
      });

      console.log('[CreateShipment] Response:', response);
      
      setFormData(prevData => ({
        ...prevData,
        trackingNumber: response.data.tracking_number
      }));
      setShowSuccessModal(true);

      // Reset form
      setFormData({
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
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/admin/branch/shipments");
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create shipment";
      console.error('[CreateShipment] Error:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Create New Shipment"
      menuItems={menuItems}
      userRole="branch-admin"
      userName={user?.name || "Branch Admin"}
      branchName={branchName}
    >
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card-elevated max-w-md mx-auto bg-white p-8 text-center transform transition-all">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Shipment Created!
            </h2>
            <p className="text-gray-600 mb-6">
              Your shipment has been successfully created.
            </p>

            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-6 border-2 border-primary-200">
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
                Order Number
              </p>
              <p className="text-3xl font-bold text-primary-600 font-mono break-all mb-2">
                {formData.trackingNumber}
              </p>
              <p className="text-xs text-gray-600">
                Use this number to track your shipment
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
              <p className="text-sm text-blue-800">
                <strong>📌 Share this tracking number:</strong>
                <br />
                Customers can track their shipment on our website by searching
                with this order number.
              </p>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/admin/branch/shipments");
              }}
              className="btn-primary w-full"
            >
              View All Shipments
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="alert-error">
            {error.includes('\n') ? (
              <ul className="list-disc list-inside space-y-1">
                {error.split('\n').map((err, idx) => (
                  <li key={idx}>⚠️ {err}</li>
                ))}
              </ul>
            ) : (
              <span>⚠️ {error}</span>
            )}
          </div>
        )}

        {success && (
          <div className="alert-success">
            <span>{success}</span>
          </div>
        )}

        {/* Tracking Number (Optional) */}
        <div className="card-elevated bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            🆔 Order/Tracking Number (Optional)
          </h3>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Leave empty for auto-generated number (e.g., DEX123456ABC)"
              value={formData.trackingNumber}
              onChange={(e) =>
                setFormData({ ...formData, trackingNumber: e.target.value })
              }
              className="input-field w-full"
            />
            <p className="text-xs text-gray-600 mt-2">
              💡 Tip: If you leave this empty, a unique tracking number will be automatically generated. 
              If you enter a custom number, it must be unique.
            </p>
          </div>
        </div>

        {/* Sender Information */}
        <div className="card-elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            👤 Sender Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.senderName}
                onChange={(e) =>
                  setFormData({ ...formData, senderName: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Phone
              </label>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.senderPhone}
                onChange={(e) =>
                  setFormData({ ...formData, senderPhone: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Address
              </label>
              <input
                type="text"
                placeholder="Address"
                value={formData.senderAddress}
                onChange={(e) =>
                  setFormData({ ...formData, senderAddress: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Receiver Information */}
        <div className="card-elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            📦 Receiver Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.receiverName}
                onChange={(e) =>
                  setFormData({ ...formData, receiverName: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Phone
              </label>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.receiverPhone}
                onChange={(e) =>
                  setFormData({ ...formData, receiverPhone: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Address
              </label>
              <input
                type="text"
                placeholder="Address"
                value={formData.receiverAddress}
                onChange={(e) =>
                  setFormData({ ...formData, receiverAddress: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Cargo Details */}
        <div className="card-elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            📍 Cargo Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Country of Origin *
              </label>
              <select
                value={formData.originCountry}
                onChange={(e) =>
                  setFormData({ ...formData, originCountry: e.target.value })
                }
                className="input-field"
                required
              >
                <option value="">Select country of origin</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Destination
              </label>
              <select
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                className="input-field"
                required
              >
                <option value="">Select Destination (City or Country)</option>
                <optgroup label="📍 Branch Offices (Recommended)">
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.name}>
                      {branch.name} - {branch.country}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🌍 Worldwide Destinations">
                  {WORLD_DESTINATIONS.map((destination) => (
                    <option key={destination} value={destination}>
                      {destination}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Service Type
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) =>
                  setFormData({ ...formData, serviceType: e.target.value })
                }
                className="input-field"
              >
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Initial Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="input-field"
                required
              >
                {CREATE_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Description
            </label>
            <textarea
              placeholder="What are you shipping? (contents, materials, etc.)"
              value={formData.cargoDescription}
              onChange={(e) =>
                setFormData({ ...formData, cargoDescription: e.target.value })
              }
              className="input-field"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Weight
              </label>
              <input
                type="number"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Volume
              </label>
              <input
                type="number"
                placeholder="Volume (m³)"
                value={formData.volume}
                onChange={(e) =>
                  setFormData({ ...formData, volume: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 text-lg"
          >
            {loading ? "⏳ Creating Shipment..." : "✅ Create Shipment"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/branch/shipments")}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};
