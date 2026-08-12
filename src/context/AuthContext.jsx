import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { ROLES } from "../constants/app";

/**
 * Frontend-only auth simulation that mirrors the requested hierarchy:
 * Super Admin -> School/Principal assignment -> Principal -> teacher/student/parent assignment.
 * The real backend would replace this object and keep server-side permission checks.
 */
const AuthContext = createContext(null);

const STORAGE_KEY = "igms.auth.user";

/**
 * Always start fresh at the login page on every page load / dev server restart.
 * The session is kept in memory while navigating within the app, but cleared
 * on full reload so `npm run dev` always lands on the login screen.
 */
function readStoredUser() {
  // Clear any previous session so the app always starts at login
  localStorage.removeItem(STORAGE_KEY);
  return null;
}

function emailIsValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function passwordIsValid(password) {
  if (!password || password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

function hashPassword(value) {
  try {
    return btoa(String(value));
  } catch {
    return String(value);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback(async ({ email, password, role = "principal" }) => {
    await new Promise((r) => setTimeout(r, 700));

    if (!email || !email.trim()) {
      throw new Error("Email address is required.");
    }

    if (!emailIsValid(email.trim())) {
      throw new Error("Enter a valid email address.");
    }

    if (!password || !password.trim()) {
      throw new Error("Password is required.");
    }

    const config = ROLES[role];
    if (!config) {
      throw new Error("Please select a valid role.");
    }

    const expectedEmail = config.credentials.email;
    const expectedHash = config.credentials.passwordHash;
    const suppliedHash = hashPassword(password);

    const ok =
      email.trim().toLowerCase() === expectedEmail &&
      suppliedHash === expectedHash;

    if (!ok) {
      throw new Error(
        `Invalid ${config.label} credentials. Please verify your details.`,
      );
    }

    const profile = config.profile;
    if (profile.isActive === false) {
      throw new Error(
        "Your account is inactive or suspended. Please contact support.",
      );
    }

    const nextUser = {
      ...profile,
      email: config.credentials.email,
      roleKey: config.key,
      role: profile.role,
      school_id: profile.school_id ?? null,
      mustChangePassword: profile.mustChangePassword ?? false,
      home: config.home,
      permissions: profile.permissions ?? [],
    };

    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const changePassword = useCallback(
    async ({ currentPassword, newPassword, confirmPassword }) => {
      if (!user) {
        throw new Error("You must be signed in to change your password.");
      }

      if (!currentPassword || !currentPassword.trim()) {
        throw new Error("Current password is required.");
      }

      if (!newPassword || !confirmPassword) {
        throw new Error("New password and confirmation are required.");
      }

      if (!passwordIsValid(newPassword)) {
        throw new Error(
          "Password must be at least 8 characters, include uppercase, lowercase, number, and a special character.",
        );
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Confirm password must match the new password.");
      }

      if (hashPassword(currentPassword) === user.passwordHash) {
        throw new Error("Current password is invalid.");
      }

      if (hashPassword(newPassword) === hashPassword(currentPassword)) {
        throw new Error(
          "New password should not be the same as the current password.",
        );
      }

      const updatedUser = {
        ...user,
        mustChangePassword: false,
        passwordHash: hashPassword(newPassword),
      };

      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

      return { message: "Password changed successfully." };
    },
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      roleKey: user?.roleKey ?? null,
      login,
      logout,
      changePassword,
    }),
    [user, login, logout, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
