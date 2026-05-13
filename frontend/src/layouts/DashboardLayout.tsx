import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  menuItems: MenuItem[];
  userRole: "super-admin" | "branch-admin";
  userName: string;
  branchName?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  menuItems,
  userRole,
  userName,
  branchName,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    setSidebarOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    navigate("/admin/login");
  };

  const getRoleColor = () => {
    return userRole === "super-admin" ? "bg-primary-600" : "bg-secondary-500";
  };

  const getRoleBadgeColor = () => {
    return userRole === "super-admin"
      ? "bg-primary-100 text-primary-800"
      : "bg-secondary-100 text-secondary-800";
  };

  const renderMenu = () =>
    menuItems.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <button
          key={item.id}
          onClick={() => {
            navigate(item.path);
            setSidebarOpen(false);
          }}
          className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
            isActive
              ? "bg-accent-500 text-white shadow-lg"
              : "text-primary-100 hover:bg-primary-600"
          }`}
        >
          <span className="flex-shrink-0 text-lg">{item.icon}</span>
          <span
            className={`text-sm font-medium ${isActive ? "font-semibold" : ""}`}
          >
            {item.label}
          </span>
          {isActive && (
            <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>
          )}
        </button>
      );
    });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="z-40 hidden flex-col bg-gradient-to-b from-primary-700 to-primary-800 text-white shadow-elevation lg:flex lg:w-64">
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-primary-600 p-6">
          <img
            src="/media/Dalali logo.png"
            alt="Dalali Express Logo"
            className="h-10 w-10 object-contain"
          />
          <div>
            <div className="text-lg font-bold">Dalali</div>
            <div
              className={`rounded-full px-2 py-1 text-xs ${getRoleBadgeColor()}`}
            >
              {userRole === "super-admin" ? "System" : "Branch"}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-6">{renderMenu()}</nav>

        <div className="flex flex-shrink-0 flex-col gap-2 border-t border-primary-600 p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-accent-500 py-2 text-sm font-medium shadow-md transition-colors hover:bg-accent-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 max-w-[85vw] flex-col bg-gradient-to-b from-primary-700 to-primary-800 text-white shadow-elevation transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-primary-600 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 font-bold text-primary-700 shadow-md">
            D
          </div>
          <div>
            <div className="text-lg font-bold">Dalali</div>
            <div
              className={`rounded-full px-2 py-1 text-xs ${getRoleBadgeColor()}`}
            >
              {userRole === "super-admin" ? "System" : "Branch"}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-6">{renderMenu()}</nav>

        <div className="flex flex-shrink-0 flex-col gap-2 border-t border-primary-600 p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-accent-500 py-2 text-sm font-medium shadow-md transition-colors hover:bg-accent-600"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-3 py-3 shadow-base sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-start justify-between gap-3 sm:items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="truncate text-base font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                  {title}
                </h1>
                {branchName && userRole === "branch-admin" && (
                  <span className="whitespace-nowrap rounded-full bg-secondary-100 px-2 py-1 text-[10px] font-medium text-secondary-800 sm:px-3 sm:text-sm">
                    {branchName}
                  </span>
                )}
              </div>
              <p className="hidden text-xs text-gray-600 sm:block sm:text-sm">
                {userRole === "super-admin"
                  ? "System Administration Dashboard"
                  : "Branch Operations Dashboard"}
              </p>
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-gray-100 sm:px-4"
              >
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                    {userName}
                  </p>
                  <p className={`text-xs font-medium ${getRoleBadgeColor()}`}>
                    {userRole === "super-admin"
                      ? "Super Admin"
                      : "Branch Admin"}
                  </p>
                </div>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-md sm:h-10 sm:w-10 sm:text-sm ${getRoleColor()}`}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
                <svg
                  className="hidden h-4 w-4 text-gray-600 sm:block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-gray-200 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {userRole === "super-admin"
                        ? "System Admin"
                        : "Branch Admin"}
                    </p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100">
                    Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100">
                    Help & Support
                  </button>
                  <div className="mt-1 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
          <div className="mx-auto min-w-0 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
