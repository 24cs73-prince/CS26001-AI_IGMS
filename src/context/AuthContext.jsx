import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ROLES } from '../constants/app';

/**
 * Frontend-only authentication context with 3 roles: principal, teacher, student.
 * The `login` function expects { role, email, password }.
 * Persisted in localStorage so refreshes stay logged in.
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

  const login = useCallback(async ({ role, email, password }) => {
    await new Promise((r) => setTimeout(r, 600));

    const roleCfg = ROLES[role];
    if (!roleCfg) throw new Error(`Unknown role: ${role}`);

    // Students are blocked – the button stays but login does nothing real
    if (role === 'student') {
      throw new Error('Student portal is coming soon. Please check back later.');
    }

    const ok =
      email.trim().toLowerCase() === roleCfg.email &&
      password === roleCfg.password;

    if (!ok) {
      throw new Error('Invalid credentials. Click a role card to auto-fill demo credentials.');
    }

    const nextUser = {
      name: roleCfg.name,
      email: roleCfg.email,
      role: roleCfg.role,
      roleKey: roleCfg.key,
      home: roleCfg.home,
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
