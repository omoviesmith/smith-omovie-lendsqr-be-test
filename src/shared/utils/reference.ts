export const generateReference = (prefix: string) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `${prefix.toUpperCase()}_${timestamp}_${random}`;
};
