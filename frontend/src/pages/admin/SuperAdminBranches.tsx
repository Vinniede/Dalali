import React from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout.tsx";
import authService from "../../services/authService";
import branchService from "../../services/branchService";

interface Branch {
  id: string;
  name: string;
  country: string;
  phone: string;
  created_at?: string;
}

export const SuperAdminBranches: React.FC = () => {
  const user = authService.getUser();
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [formLoading, setFormLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    country: "",
    phone: "",
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

  React.useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await branchService.getAllBranches(100, 0);
      setBranches(response.data.branches || []);
    } catch (err: any) {
      console.error("Failed to fetch branches:", err);
      setError("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFormLoading(true);

    try {
      const response = await branchService.createBranch(
        formData.name,
        formData.country,
        formData.phone,
      );

      setSuccess(`✅ Branch "${formData.name}" created successfully!`);
      setFormData({ name: "", country: "", phone: "" });
      setShowForm(false);

      // Refresh branches list
      await fetchBranches();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create branch");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Branch Management"
      menuItems={menuItems}
      userRole="super-admin"
      userName={user?.name || "Super Admin"}
    >
      <div className="space-y-6">
        {/* Success Alert */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Add Branch Form */}
        {showForm && (
          <div className="card-elevated bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Create New Branch
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dar es Salaam"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tanzania"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
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
                    placeholder="e.g., +255 654 321 987"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-primary flex-1"
                >
                  {formLoading ? "⏳ Creating..." : "✅ Create Branch"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Branches List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block mb-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading branches...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card-elevated bg-gradient-to-br from-blue-50 to-blue-100">
                <p className="text-gray-600 text-sm font-semibold">
                  Total Branches
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {branches.length}
                </p>
              </div>
              <div className="card-elevated bg-gradient-to-br from-green-50 to-green-100">
                <p className="text-gray-600 text-sm font-semibold">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {branches.length}
                </p>
              </div>
              <div className="card-elevated bg-gradient-to-br from-purple-50 to-purple-100">
                <p className="text-gray-600 text-sm font-semibold">Countries</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {new Set(branches.map((b) => b.country)).size}
                </p>
              </div>
              <div className="card-elevated">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full px-4 py-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition font-bold text-center"
                >
                  + Add Branch
                </button>
              </div>
            </div>

            {/* Branch Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches && branches.length > 0 ? (
                branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="card-elevated border-l-4 border-primary-600 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          🏢 {branch.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          📍 {branch.country}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-semibold">📞</span>
                        <p className="text-gray-900 font-mono">
                          {branch.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg text-sm font-bold transition">
                        ✏️ Edit
                      </button>
                      <button className="flex-1 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-bold transition">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-lg">
                  <p className="text-3xl mb-2">🏢</p>
                  <p className="text-gray-600 font-medium">No branches found</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-bold"
                  >
                    Create First Branch
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
