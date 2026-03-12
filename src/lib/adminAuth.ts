const AUTH_STORAGE_KEY = "kg_admin_authed";
const ADMIN_ROLE_STORAGE_KEY = "kg_admin_role";
const MAIN_ADMIN_PASSWORD_STORAGE_KEY = "kg_main_admin_password";
const CLIENT_ADMIN_PASSWORD_STORAGE_KEY = "kg_client_admin_password";

const MAIN_ADMIN_EMAIL = "admin@wwi.org.in";
const DEFAULT_MAIN_ADMIN_PASSWORD = "admin@wwi";
export const CLIENT_ADMIN_EMAIL = "admin@kirnagram.com";
const DEFAULT_CLIENT_ADMIN_PASSWORD = "kirnagram.com@s";

export type AdminRole = "main-admin" | "client-admin";

const getStoredMainAdminPassword = () =>
  localStorage.getItem(MAIN_ADMIN_PASSWORD_STORAGE_KEY) || DEFAULT_MAIN_ADMIN_PASSWORD;

const getStoredClientAdminPassword = () =>
  localStorage.getItem(CLIENT_ADMIN_PASSWORD_STORAGE_KEY) || DEFAULT_CLIENT_ADMIN_PASSWORD;

const getCurrentPasswordByRole = (role: AdminRole) =>
  role === "main-admin" ? getStoredMainAdminPassword() : getStoredClientAdminPassword();

const setPasswordByRole = (role: AdminRole, newPassword: string) => {
  const storageKey = role === "main-admin" ? MAIN_ADMIN_PASSWORD_STORAGE_KEY : CLIENT_ADMIN_PASSWORD_STORAGE_KEY;
  localStorage.setItem(storageKey, newPassword);
};

export const isAdminAuthenticated = () => localStorage.getItem(AUTH_STORAGE_KEY) === "true";

export const setAdminAuthenticated = (role: AdminRole) => {
  localStorage.setItem(AUTH_STORAGE_KEY, "true");
  localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, role);
};

export const clearAdminAuthenticated = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(ADMIN_ROLE_STORAGE_KEY);
};

export const getAuthenticatedAdminRole = (): AdminRole | null => {
  if (!isAdminAuthenticated()) {
    return null;
  }

  const role = localStorage.getItem(ADMIN_ROLE_STORAGE_KEY);
  if (role === "main-admin" || role === "client-admin") {
    return role;
  }
  return null;
};

export const validateAdminCredentials = (email: string, password: string): AdminRole | null => {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === MAIN_ADMIN_EMAIL.toLowerCase() && password === getStoredMainAdminPassword()) {
    return "main-admin";
  }

  if (normalizedEmail === CLIENT_ADMIN_EMAIL.toLowerCase() && password === getStoredClientAdminPassword()) {
    return "client-admin";
  }

  return null;
};

export const changeAdminPassword = (role: AdminRole, oldPassword: string, newPassword: string) => {
  const currentPassword = getCurrentPasswordByRole(role);

  if (oldPassword !== currentPassword) {
    return { success: false, message: "Old password is incorrect." };
  }

  if (newPassword.trim().length < 6) {
    return { success: false, message: "New password must be at least 6 characters." };
  }

  if (newPassword === currentPassword) {
    return { success: false, message: "New password must be different from old password." };
  }

  setPasswordByRole(role, newPassword);
  return { success: true };
};
