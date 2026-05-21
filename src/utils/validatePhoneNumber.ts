export const isValidPhone = (phone: string): string | null => {
  let cleaned = phone.replace(/[\s()-]/g, "");

  if (cleaned.startsWith("+234")) {
    cleaned = `0${cleaned.slice(4)}`;
  } else if (cleaned.startsWith("234")) {
    cleaned = `0${cleaned.slice(3)}`;
  }

  return /^0\d{10}$/.test(cleaned) ? cleaned : null;
};

