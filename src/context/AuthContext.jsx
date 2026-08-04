import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ROLES } from '../constants/app';

/**
 * Frontend-only authentication context.
 * Persists a lightweight user object in localStorage so refreshes stay
 * "logged in". Each role (principal / teacher / student) has its own demo
 * credentials — see ROLES in constants/app.js. Replace `login` with a real
 * API call when the backend exists.
 */
const AuthContext = createContext(null);

const STORAGE_KEY = 'igms.auth.user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback(async ({ email, password, role = 'principal' }) => {
    // Simulate a short network round-trip
    await new Promise((r) => setTimeout(r, 700));

    const config = ROLES[role];
    if (!config) {
      throw new Error('Please select a valid role.');
    }

    const ok =
      email.trim().toLowerCase() === config.credentials.email &&
      password === config.credentials.password;

    if (!ok) {
      throw new Error(
        `Invalid ${config.label} credentials. Use the demo login shown below.`
      );
    }

    const nextUser = {
      ...config.profile,
      email: config.credentials.email,
      roleKey: config.key,
      home: config.home,
    };
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      roleKey: user?.roleKey ?? null,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
