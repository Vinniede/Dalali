import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout.tsx';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const SuperAdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newMessage, setNewMessage] = React.useState('');
  const [recipients, setRecipients] = React.useState('all');
  const [success, setSuccess] = React.useState('');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/admin/super/overview' },
    { id: 'shipments', label: 'Shipments', icon: '📦', path: '/admin/super/shipments' },
    { id: 'users', label: 'Users', icon: '👥', path: '/admin/super/users' },
    { id: 'branches', label: 'Branches', icon: '🏢', path: '/admin/super/branches' },
    { id: 'services', label: 'Services', icon: '🚚', path: '/admin/super/services' },
    { id: 'tracking', label: 'Tracking Control', icon: '📍', path: '/admin/super/tracking' },
    { id: 'reports', label: 'Reports', icon: '📈', path: '/admin/super/reports' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/admin/super/notifications' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/super/settings' },
  ];

  React.useEffect(() => {
    // Fetch notifications from database or API
    // For now, we'll initialize as empty
    setLoading(false);
  }, []);

  const handleSendNotification = () => {
    if (!newMessage.trim()) {
      return;
    }

    // Here you would call an API to send the notification
    // For now, we'll just add it to the local list as a demo
    const newNotification: Notification = {
      id: Date.now().toString(),
      message: newMessage,
      timestamp: 'just now',
      read: false,
    };

    setNotifications([newNotification, ...notifications]);
    setSuccess('✅ Notification sent successfully!');
    setNewMessage('');
    
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <DashboardLayout
      title="System Notifications"
      menuItems={menuItems}
      userRole="super-admin"
      userName="Super Admin"
    >
      <div className="space-y-6">
        {/* Create Notification */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Send System Notification</h3>
          <div className="space-y-4 mb-4">
            <textarea
              placeholder="Notification message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            ></textarea>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Send to:</label>
              <select
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="branch-admins">All Branch Admins</option>
                <option value="dar">Dar es Salaam Branch</option>
                <option value="entebbe">Entebbe Branch</option>
                <option value="kinshasa">Kinshasa Branch</option>
              </select>
            </div>
          </div>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
            Send Notification
          </button>
        </div>

        {/* Notification History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-bold text-gray-900">Recent Notifications</h3>
          </div>
          <div className="divide-y">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-6 ${notif.read ? 'bg-white' : 'bg-blue-50'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`font-medium ${notif.read ? 'text-gray-700' : 'text-gray-900 font-bold'}`}>
                      {notif.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{notif.timestamp}</p>
                  </div>
                  {!notif.read && <span className="w-3 h-3 bg-blue-600 rounded-full"></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
