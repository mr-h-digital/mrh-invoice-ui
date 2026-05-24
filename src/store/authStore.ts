import { create } from 'zustand';

interface AuthUser {
  email: string;
  role: 'admin';
}

interface AuthStore {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = 'mrh_auth';

// Single admin credential — swap this file for API calls when a backend is ready
const ADMIN = {
  email: 'admin@mrhdigital.co.za',
  password: 'password',
  role: 'admin' as const,
};

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthStore>(() => ({
  user: loadUser(),

  login: (email, password) => {
    if (
      email.trim().toLowerCase() === ADMIN.email &&
      password === ADMIN.password
    ) {
      const user: AuthUser = { email: ADMIN.email, role: ADMIN.role };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      useAuthStore.setState({ user });
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    useAuthStore.setState({ user: null });
  },
}));
