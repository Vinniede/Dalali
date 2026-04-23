export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'In Transit': 'yellow',
    'Delivered': 'green',
    'Delayed': 'red',
    'Created': 'gray',
    'Out for Delivery': 'blue',
    'Cancelled': 'red',
  };
  return colors[status] || 'gray';
};

export const getStatusBgColor = (status: string): string => {
  const bgColors: Record<string, string> = {
    'In Transit': 'bg-yellow-100',
    'Delivered': 'bg-green-100',
    'Delayed': 'bg-red-100',
    'Created': 'bg-gray-100',
    'Out for Delivery': 'bg-blue-100',
    'Cancelled': 'bg-red-100',
  };
  return bgColors[status] || 'bg-gray-100';
};

export const getStatusTextColor = (status: string): string => {
  const textColors: Record<string, string> = {
    'In Transit': 'text-yellow-800',
    'Delivered': 'text-green-800',
    'Delayed': 'text-red-800',
    'Created': 'text-gray-800',
    'Out for Delivery': 'text-blue-800',
    'Cancelled': 'text-red-800',
  };
  return textColors[status] || 'text-gray-800';
};
