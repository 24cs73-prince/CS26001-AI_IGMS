import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { buildApiUrl } from "../utils/apiConfig";

/**
 * AuthContext for backend JWT authentication.
 */
const AuthContext = createContext(null);

const STORAGE_KEY = "igms.auth.user";

function normalizeUser(userData) {
  if (!userData) return null;
  const safeUserData = { ...userData };
  delete safeUserData.password;
  delete safeUserData.passwordHash;
  delete safeUserData.token;
  const roleKey = userData.roleKey || userData.role || "principal";
  const defaultHome = 
    roleKey === "teacher" ? "/teacher/dashboard" :
    roleKey === "student" ? "/student/home" :
    roleKey === "parent" ? "/parent/dashboard" : "/dashboard";

  return {
    ...safeUserData,
    roleKey,
    role: userData.role || roleKey,
    home: userData.home || defaultHome,
    permissions: userData.permissions || ["school.view", "student.manage", "teacher.manage", "parent.manage", "dashboard.view"],
  };
}

function readStoredUser() {
  try {
    [
      "igms.created_principals",
      "igms.created_students",
      "igms.created_teachers",
      "igms.created_parents",
      "igms.schools",
    ].forEach((key) => localStorage.removeItem(key));

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const user = normalizeUser(JSON.parse(raw));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
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

    let response;
    try {
      response = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password, role }),
      });
    } catch (error) {
      throw new Error(`Unable to reach the authentication service: ${error.message}`);
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || "Invalid email or password.");
    }
    if (!data?.token) {
      throw new Error("Authentication service returned no session token.");
    }

    localStorage.setItem("igms.auth.token", data.token);
    const normalized = normalizeUser(data);
    setUser(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
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

      if (hashPassword(newPassword) === hashPassword(currentPassword)) {
        throw new Error(
          "New password should not be the same as the current password.",
        );
      }

      const token = localStorage.getItem("igms.auth.token");
      if (!token) {
        throw new Error("Password changes require an authenticated backend session.");
      }

      const response = await fetch(buildApiUrl("/api/auth/change-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Unable to update password.");
      }

      const updatedUser = normalizeUser({
        ...user,
        mustChangePassword: false,
      });

      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

      return result;
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
