import React from 'react';
import { Header } from '../components/Layout.tsx';
import { LoginForm } from '../components/Auth.tsx';
import { Dashboard } from '../components/Dashboard.tsx';
import { ShipmentsList } from '../components/Shipments.tsx';
import authService from '../services/authService.ts';
import shipmentService from '../services/shipmentService.ts';

export const LoginPage: React.FC = () => {
  return <LoginForm />;
};

interface AdminPageProps {
  children: React.ReactNode;
}

export const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser && !authService.isAuthenticated()) {
      window.location.href = '/admin/login';
    } else {
      setUser(currentUser);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Header isAdmin={true} />
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
};

export const DashboardPage: React.FC = () => {
  return (
    <AdminPage>
      <Dashboard />
    </AdminPage>
  );
};

export const ShipmentsPage: React.FC = () => {
  const [shipments, setShipments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const response = await shipmentService.getShipments(50);
      setShipments(response.data.shipments);
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPage>
      <ShipmentsList shipments={shipments} onSelectId={setSelectedId} loading={loading} />
    </AdminPage>
  );
};
