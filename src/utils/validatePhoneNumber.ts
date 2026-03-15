export const isValidPhone = (phone: string): boolean => {
  let formatPhone = phone.replace(/[\s\-+]/g, '');
    if (formatPhone.startsWith('+234')) {
    formatPhone = '0' + formatPhone.substring(4);
  }
  return /^\d{11}$/.test(formatPhone);
};