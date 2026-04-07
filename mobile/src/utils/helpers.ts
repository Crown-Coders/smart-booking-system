// src/utils/helpers.ts
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const formatCurrency = (amount: number) => {
  return `R${amount.toFixed(2)}`;
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));