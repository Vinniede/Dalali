// User Roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  BRANCH_ADMIN: 'branch_admin',
};

// Shipment Status
export const SHIPMENT_STATUS = {
  CREATED: 'Created',
  IN_TRANSIT: 'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  DELAYED: 'Delayed',
  CANCELLED: 'Cancelled',
};

// Status Color Map
export const STATUS_COLORS: Record<string, string> = {
  'In Transit': 'yellow',
  'Delivered': 'green',
  'Delayed': 'red',
  'Created': 'gray',
  'Out for Delivery': 'blue',
  'Cancelled': 'red',
};
