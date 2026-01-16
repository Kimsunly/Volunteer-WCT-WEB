"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { me as apiMe } from "@/lib/services/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, check if user is logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Use backend /api/auth/me to get full profile (role, status, etc.)
                const userData = await apiMe();
                if (userData) {
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
