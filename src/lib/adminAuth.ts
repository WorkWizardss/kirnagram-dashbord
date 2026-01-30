const AUTH_STORAGE_KEY = "kg_admin_authed";
const ADMIN_EMAIL = "admin@kirnagrma";
const ADMIN_PASSWORD = "1234567890";

export const isAdminAuthenticated = () => localStorage.getItem(AUTH_STORAGE_KEY) === "true";

export const setAdminAuthenticated = (value: boolean) => {
  localStorage.setItem(AUTH_STORAGE_KEY, value ? "true" : "false");
};

export const clearAdminAuthenticated = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const validateAdminCredentials = (email: string, password: string) =>
  email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;
