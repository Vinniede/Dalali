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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile, visible on lg+ */}
      <aside
        className={`hidden lg:flex lg:w-64 bg-gradient-to-b from-primary-700 to-primary-800 text-white transition-all duration-300 flex-col shadow-elevation z-40`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-primary-600 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center font-bold text-primary-700 shadow-md">
            D
          </div>
          <div>
            <div className="font-bold text-lg">Dalali</div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor()}`}
            >
              {userRole === "super-admin" ? "System" : "Branch"}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 rounded-lg transition-all duration-200 mb-1 ${
                  isActive
                    ? "bg-accent-500 text-white shadow-lg"
                    : "hover:bg-primary-600 text-primary-100"
                }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <span
                  className={`font-medium text-sm ${isActive ? "font-semibold" : ""}`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-primary-600 p-4 flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full bg-accent-500 hover:bg-accent-600 py-2 rounded-lg text-sm transition-colors font-medium shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-primary-700 to-primary-800 text-white transition-transform duration-300 flex flex-col shadow-elevation z-40 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-primary-600 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center font-bold text-primary-700 shadow-md">
            D
          </div>
          <div>
            <div className="font-bold text-lg">Dalali</div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor()}`}
            >
              {userRole === "super-admin" ? "System" : "Branch"}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 rounded-lg transition-all duration-200 mb-1 ${
                  isActive
                    ? "bg-accent-500 text-white shadow-lg"
                    : "hover:bg-primary-600 text-primary-100"
                }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <span
                  className={`font-medium text-sm ${isActive ? "font-semibold" : ""}`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-primary-600 p-4 flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full bg-accent-500 hover:bg-accent-600 py-2 rounded-lg text-sm transition-colors font-medium shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-base border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-30">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition mr-2"
          >
            <svg
              className="w-6 h-6 text-gray-700"
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

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                {title}
              </h1>
              {branchName && userRole === "branch-admin" && (
                <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-secondary-100 text-secondary-800 rounded-full font-medium whitespace-nowrap">
                  {branchName}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              {userRole === "super-admin"
                ? "🔧 System Administration Dashboard"
                : "🏢 Branch Operations Dashboard"}
            </p>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative ml-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2 sm:px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                  {userName}
                </p>
                <p className={`text-xs font-medium ${getRoleBadgeColor()}`}>
                  {userRole === "super-admin" ? "Super Admin" : "Branch Admin"}
                </p>
              </div>
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 ${getRoleColor()} rounded-full flex items-center justify-center text-white font-bold shadow-md text-xs sm:text-sm`}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              <svg
                className="w-4 h-4 text-gray-600 hidden sm:block"
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

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {userRole === "super-admin"
                      ? "System Admin"
                      : "Branch Admin"}
                  </p>
                </div>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700 text-sm">
                  ⚙️ Settings
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700 text-sm">
                  ℹ️ Help & Support
                </button>
                <div className="border-t border-gray-200 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors text-red-600 font-medium text-sm"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
