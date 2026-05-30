"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  signin: async () => {},
  signup: async () => {},
  signout: async () => {},
  clearError: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error restoring user session:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const signup = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const signin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      setUser(data.user);
      setLoading(false);
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const signout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
      });

      if (res.ok) {
        setUser(null);
        router.push("/signin");
        router.refresh();
      }
    } catch (err) {
      console.error("Signout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        signin,
        signout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
