"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, check if user is logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Call your API to get current user
                const response = await fetch("/api/auth/me", {
                    credentials: "include", // Include cookies
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData); // { id, name, role, profileImage, ... }
                }
            } catch (error) {
                console.error("Auth check failed:", error);
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
