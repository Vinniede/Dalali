import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, TrackingPage, ServicesPage, ContactPage } from './pages/Public';
import { LoginPage } from './pages/Admin';
import authService from './services/authService';

// Super Admin Pages
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard';
import { SuperAdminShipments } from './pages/admin/SuperAdminShipments';
import { SuperAdminUsers } from './pages/admin/SuperAdminUsers';
import { SuperAdminBranches } from './pages/admin/SuperAdminBranches';
import { SuperAdminServices } from './pages/admin/SuperAdminServices';
import { SuperAdminTracking } from './pages/admin/SuperAdminTracking';
import { SuperAdminReports } from './pages/admin/SuperAdminReports';
import { SuperAdminNotifications } from './pages/admin/SuperAdminNotifications';
import { SuperAdminSettings } from './pages/admin/SuperAdminSettings';

// Branch Admin Pages
import { BranchAdminDashboard } from './pages/admin/BranchAdminDashboard';
import { BranchAdminShipments } from './pages/admin/BranchAdminShipments';
import { BranchAdminCreateShipment } from './pages/admin/BranchAdminCreateShipment';
import { BranchAdminTracking } from './pages/admin/BranchAdminTracking';
import { BranchAdminIncoming } from './pages/admin/BranchAdminIncoming';
import { BranchAdminOutgoing } from './pages/admin/BranchAdminOutgoing';
import { BranchAdminProfile } from './pages/admin/BranchAdminProfile';

// Protected Route Component
interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRoles }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const user = authService.getUser();
    if (!user || !requiredRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return element;
};

function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/track" element={<TrackingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Auth Routes */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Super Admin Routes */}
        <Route path="/admin/super/overview" element={<ProtectedRoute element={<SuperAdminDashboard />} requiredRoles={['super_admin']} />} />
        <Route path="/admin/super/shipments" element={<ProtectedRoute element={<SuperAdminShipments />} requiredRoles={['super_admin']} />} />
        <Route path="/admin/super/users" element={<ProtectedRoute element={<SuperAdminUsers />} requiredRoles={['super_admin']} />} />
        <Route path="/admin/super/branches" element={<ProtectedRoute element={<SuperAdminBranches />} requiredRoles={['super_admin']} />} />
        <Route path="/admin/super/services" element={<ProtectedRoute element={<SuperAdminServices />} requiredRoles={['super_admin']} />} />
        <Route path="/admin/super/tracking" element={<ProtectedRoute element={<SuperAdminTracking />} requiredRoles={['super_admin']} />} />
        <Route path="/admin/super/reports" element={<ProtectedRoute element={<SuperAdminReports />} requiredRoles={['super_admin']} />} />
        <Route path="/admin/super/notifications" element={<ProtectedRoute element={<SuperAdminNotifications />} requiredRoles={['super_admin']} />} />
        <Route path="/admin/super/settings" element={<ProtectedRoute element={<SuperAdminSettings />} requiredRoles={['super_admin']} />} />

        {/* Branch Admin Routes */}
        <Route path="/admin/branch/overview" element={<ProtectedRoute element={<BranchAdminDashboard />} requiredRoles={['branch_admin']} />} />
        <Route path="/admin/branch/shipments" element={<ProtectedRoute element={<BranchAdminShipments />} requiredRoles={['branch_admin']} />} />
        <Route path="/admin/branch/create" element={<ProtectedRoute element={<BranchAdminCreateShipment />} requiredRoles={['branch_admin']} />} />
        <Route path="/admin/branch/tracking" element={<ProtectedRoute element={<BranchAdminTracking />} requiredRoles={['branch_admin']} />} />
        <Route path="/admin/branch/incoming" element={<ProtectedRoute element={<BranchAdminIncoming />} requiredRoles={['branch_admin']} />} />
        <Route path="/admin/branch/outgoing" element={<ProtectedRoute element={<BranchAdminOutgoing />} requiredRoles={['branch_admin']} />} />
        <Route path="/admin/branch/profile" element={<ProtectedRoute element={<BranchAdminProfile />} requiredRoles={['branch_admin']} />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
