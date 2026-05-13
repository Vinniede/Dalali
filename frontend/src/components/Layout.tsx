import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

interface HeaderProps {
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getUser();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const getLinkClass = (path: string) => {
    const baseClass = "font-medium transition-colors duration-200";
    const activeClass = isActive(path)
      ? "text-white bg-white/20 px-3 py-2 rounded-lg"
      : "hover:text-primary-100 hover:bg-white/10 px-3 py-2 rounded-lg";
    return `${baseClass} ${activeClass}`;
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <img
              src="/media/Dalali logo.png"
              alt="Dalali Express Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="brand-name inline max-w-[11rem] truncate text-sm font-bold leading-tight sm:max-w-none sm:text-xl">
              Dalali Express
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isAdmin && user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10">
                  <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs text-primary-100 capitalize">
                      {user.role?.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-600 rounded-lg font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className={getLinkClass("/")}>
                  Home
                </Link>
                <Link to="/services" className={getLinkClass("/services")}>
                  Services
                </Link>
                <Link to="/track" className={getLinkClass("/track")}>
                  Track Shipment
                </Link>
                <Link to="/contact" className={getLinkClass("/contact")}>
                  Contact
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
          >
            <svg
              className="w-6 h-6"
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
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {isAdmin && user ? (
              <>
                <div className="px-3 py-2 text-sm">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-primary-100 capitalize">
                    {user.role?.replace("_", " ")}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-accent-500 hover:bg-accent-600 rounded-lg font-medium transition text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-lg transition ${isActive("/") ? "bg-white/20 text-white" : "hover:bg-white/10"}`}
                >
                  Home
                </Link>
                <Link
                  to="/services"
                  className={`block px-3 py-2 rounded-lg transition ${isActive("/services") ? "bg-white/20 text-white" : "hover:bg-white/10"}`}
                >
                  Services
                </Link>
                <Link
                  to="/track"
                  className={`block px-3 py-2 rounded-lg transition ${isActive("/track") ? "bg-white/20 text-white" : "hover:bg-white/10"}`}
                >
                  Track Shipment
                </Link>
                <Link
                  to="/contact"
                  className={`block px-3 py-2 rounded-lg transition ${isActive("/contact") ? "bg-white/20 text-white" : "hover:bg-white/10"}`}
                >
                  Contact
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-100 py-8 sm:py-12 mt-0">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Footer Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {/* Brand Section */}
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <img
              src="/media/Dalali logo.png"
              alt="Dalali Express Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-sm sm:text-base">Dalali Express</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm leading-tight">
            Your trusted logistics partner in Africa.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xs sm:text-sm font-bold mb-3 text-white uppercase tracking-wide">
            Services
          </h3>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li>
              <Link
                to="/services"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                Air Freight
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                Sea Freight
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                Land Freight
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                Clearing & Forwarding
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs sm:text-sm font-bold mb-3 text-white uppercase tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/track"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                Track
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="hidden sm:block">
          <h3 className="text-xs sm:text-sm font-bold mb-3 text-white uppercase tracking-wide">
            Contact
          </h3>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
            <p>
              📧{" "}
              <a
                href="mailto:support@dalaliexpress.com"
                className="hover:text-primary-400 transition"
              >
                support@dalaliexpress.com
              </a>
            </p>
            <p>
              📞{" "}
              <a
                href="tel:+201234567890"
                className="hover:text-primary-400 transition"
              >
                +20 (0)2 1234 5678
              </a>
            </p>
            <p>📍 Cairo, Egypt</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            &copy; 2026 Dalali Express. All rights reserved.
          </p>
          <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-primary-400 transition"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-primary-400 transition"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
