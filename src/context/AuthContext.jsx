import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { DEMO_CREDENTIALS } from '../constants/app';

/**
 * Frontend-only authentication context.
 * Persists a lightweight user object in localStorage so refreshes stay
 * "logged in". Replace `login` with a real API call when the backend exists.
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

  const login = useCallback(async ({ email, password }) => {
    // Simulate a short network round-trip
    await new Promise((r) => setTimeout(r, 700));
    const ok =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password;

    if (!ok) {
      throw new Error('Invalid credentials. Use the demo login shown below.');
    }

    const nextUser = {
      name: 'Rohan Administrator',
      email: DEMO_CREDENTIALS.email,
      role: 'Super Admin',
      org: 'Directorate of School Education',
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
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
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
