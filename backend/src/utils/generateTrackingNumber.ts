export const generateTrackingNumber = (): string => {
  const prefix = 'DEX'; // Dalali Express
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export default generateTrackingNumber;
