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

const emptyForm = {
  name: "",
  country: "",
  phone: "",
};

export const SuperAdminBranches: React.FC = () => {
  const user = authService.getUser();
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [formLoading, setFormLoading] = React.useState(false);
  const [editingBranchId, setEditingBranchId] = React.useState<string | null>(
    null,
  );
  const [formData, setFormData] = React.useState(emptyForm);

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

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingBranchId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setError("");
    setSuccess("");
    setFormData(emptyForm);
    setEditingBranchId(null);
    setShowForm(true);
  };

  const handleSubmitBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFormLoading(true);

    try {
      if (editingBranchId) {
        await branchService.updateBranch(
          editingBranchId,
          formData.name,
          formData.country,
          formData.phone,
        );
        setSuccess(`Branch "${formData.name}" updated successfully.`);
      } else {
        await branchService.createBranch(
          formData.name,
          formData.country,
          formData.phone,
        );
        setSuccess(`Branch "${formData.name}" created successfully.`);
      }

      resetForm();
      await fetchBranches();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Failed to ${editingBranchId ? "update" : "create"} branch`,
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditBranch = (branch: Branch) => {
    setError("");
    setSuccess("");
    setEditingBranchId(branch.id);
    setFormData({
      name: branch.name,
      country: branch.country,
      phone: branch.phone,
    });
    setShowForm(true);
  };

  const handleDeleteBranch = async (branch: Branch) => {
    const confirmed = window.confirm(
      `Delete branch "${branch.name}"? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await branchService.deleteBranch(branch.id);

      if (editingBranchId === branch.id) {
        resetForm();
      }

      setSuccess(`Branch "${branch.name}" deleted successfully.`);
      await fetchBranches();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete branch");
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
        {success && (
          <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {showForm && (
          <div className="card-elevated bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBranchId ? "Edit Branch" : "Create New Branch"}
              </h3>
              <button
                onClick={resetForm}
                className="text-2xl text-gray-500 hover:text-gray-700"
                aria-label="Close branch form"
              >
                x
              </button>
            </div>

            <form onSubmit={handleSubmitBranch} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
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
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
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
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
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

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-primary flex-1"
                >
                  {formLoading
                    ? editingBranchId
                      ? "Updating..."
                      : "Creating..."
                    : editingBranchId
                      ? "Save Changes"
                      : "Create Branch"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center">
            <div className="mb-4 inline-block">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600"></div>
            </div>
            <p className="text-gray-600">Loading branches...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="card-elevated bg-gradient-to-br from-blue-50 to-blue-100">
                <p className="text-sm font-semibold text-gray-600">
                  Total Branches
                </p>
                <p className="mt-1 text-3xl font-bold text-blue-600">
                  {branches.length}
                </p>
              </div>
              <div className="card-elevated bg-gradient-to-br from-green-50 to-green-100">
                <p className="text-sm font-semibold text-gray-600">Active</p>
                <p className="mt-1 text-3xl font-bold text-green-600">
                  {branches.length}
                </p>
              </div>
              <div className="card-elevated bg-gradient-to-br from-purple-50 to-purple-100">
                <p className="text-sm font-semibold text-gray-600">Countries</p>
                <p className="mt-1 text-3xl font-bold text-purple-600">
                  {new Set(branches.map((branch) => branch.country)).size}
                </p>
              </div>
              <div className="card-elevated">
                <button
                  onClick={openCreateForm}
                  className="w-full rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 px-4 py-6 text-center font-bold text-white transition hover:shadow-lg"
                >
                  + Add Branch
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {branches.length > 0 ? (
                branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="card-elevated border-l-4 border-primary-600 transition hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900">
                          Branch: {branch.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Country: {branch.country}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                        Active
                      </span>
                    </div>

                    <div className="mb-4 space-y-2 border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-600">
                          Phone:
                        </span>
                        <p className="break-all font-mono text-gray-900">
                          {branch.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => handleEditBranch(branch)}
                        className="flex-1 rounded-lg bg-primary-100 px-3 py-2 text-sm font-bold text-primary-700 transition hover:bg-primary-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(branch)}
                        className="flex-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-lg bg-white py-12 text-center">
                  <p className="mb-2 text-3xl">Branches</p>
                  <p className="font-medium text-gray-600">No branches found</p>
                  <button
                    onClick={openCreateForm}
                    className="mt-4 rounded-lg bg-primary-600 px-4 py-2 font-bold text-white transition hover:bg-primary-700"
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
