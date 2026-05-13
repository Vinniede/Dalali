import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      if (response.success) {
        const user = response.data.user;
        if (user.role === "super_admin") {
          navigate("/admin/super/overview");
        } else if (user.role === "branch_admin") {
          navigate("/admin/branch/overview");
        } else {
          setError("Unknown user role");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary-700 via-primary-800 to-slate-950 p-10 text-white">
            <div>
              <img
                src="/media/Dalali logo.png"
                alt="Dalali Express Logo"
                className="mb-6 h-14 w-14 rounded-full object-cover"
              />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">
                Admin Portal
              </p>
              <h1 className="mb-4 text-4xl font-bold leading-tight">
                Manage Dalali operations from one responsive workspace.
              </h1>
              <p className="max-w-md text-sm leading-6 text-blue-100/90">
                Access branch activity, shipment tracking, and daily operations
                with the same dashboard across desktop, tablet, and mobile.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">24/7</p>
                <p className="mt-1 text-sm text-blue-100">
                  Operational visibility
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">1</p>
                <p className="mt-1 text-sm text-blue-100">
                  Unified admin workspace
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 text-center lg:text-left">
                <img
                  src="/media/Dalali logo.png"
                  alt="Dalali Express Logo"
                  className="mx-auto mb-4 h-14 w-14 rounded-full object-cover lg:mx-0"
                />
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Dalali Admin Login
                </h1>
                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                  Sign in to manage shipments, branches, and tracking updates.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm sm:text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm sm:text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 sm:text-base"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Test credentials</p>
                <p className="mt-2 break-all">Email: admin@dalali.com</p>
                <p className="break-all">Password: Admin@2024!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
