import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { ROLES } from "../constants/app";

/**
 * AuthContext supporting both Backend API JWT Auth and local demo auth fallback.
 */
const AuthContext = createContext(null);

const STORAGE_KEY = "igms.auth.user";

function normalizeUser(userData) {
  if (!userData) return null;
  const roleKey = userData.roleKey || userData.role || "principal";
  const defaultHome = 
    roleKey === "teacher" ? "/teacher/dashboard" :
    roleKey === "student" ? "/student/home" :
    roleKey === "parent" ? "/parent/dashboard" : "/dashboard";

  return {
    ...userData,
    roleKey,
    role: userData.role || roleKey,
    home: userData.home || defaultHome,
    permissions: userData.permissions || ["school.view", "student.manage", "teacher.manage", "parent.manage", "dashboard.view"],
  };
}

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return normalizeUser(JSON.parse(raw));
    }
  } catch (err) {
    console.error("Error restoring auth session:", err);
  }
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
    if (!email || !email.trim()) {
      throw new Error("Email address is required.");
    }

    if (!emailIsValid(email.trim())) {
      throw new Error("Enter a valid email address.");
    }

    if (!password || !password.trim()) {
      throw new Error("Password is required.");
    }

    const cleanEmail = email.trim().toLowerCase();

    // Try real backend Express API first
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";

      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("igms.auth.token", data.token);
        }
        const normalized = normalizeUser(data);
        setUser(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      } else {
        const errData = await response.json().catch(() => ({}));
        if (errData.message) {
          throw new Error(errData.message);
        }
      }
    } catch (err) {
      if (err.message && !err.message.includes("Failed to fetch")) {
        throw err;
      }
      console.warn("Backend server unreachable. Using fallback local authentication.");
    }

    // Check dynamically created Principal accounts in localStorage
    try {
      const createdPrincipals = JSON.parse(localStorage.getItem("igms.created_principals") || "[]");
      const matchedPrincipal = createdPrincipals.find(
        (p) => p.email.toLowerCase() === cleanEmail && p.password === password
      );

      if (matchedPrincipal) {
        const nextUser = normalizeUser(matchedPrincipal);
        setUser(nextUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        return nextUser;
      }
    } catch (e) {}

    // Fallback to local mock auth config
    const config = ROLES[role];
    if (!config) {
      throw new Error("Please select a valid role.");
    }

    const expectedEmail = config.credentials.email.toLowerCase();
    const expectedHash = config.credentials.passwordHash;
    const suppliedHash = hashPassword(password);

    const ok =
      cleanEmail === expectedEmail && suppliedHash === expectedHash;

    if (!ok) {
      throw new Error(
        `Invalid ${config.label} credentials. Please verify your email and password.`,
      );
    }

    const profile = config.profile;
    if (profile.isActive === false) {
      throw new Error(
        "Your account is inactive or suspended. Please contact support.",
      );
    }

    const nextUser = normalizeUser({
      ...profile,
      email: config.credentials.email,
      roleKey: config.key,
      role: profile.role,
      school_id: profile.school_id ?? null,
      mustChangePassword: profile.mustChangePassword ?? false,
      home: config.home,
      permissions: profile.permissions ?? [],
    });

    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("igms.auth.token");
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

      const updatedUser = normalizeUser({
        ...user,
        mustChangePassword: false,
        passwordHash: hashPassword(newPassword),
      });

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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
