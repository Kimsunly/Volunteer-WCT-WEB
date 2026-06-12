"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { me as apiMe, socialLogin } from "@/lib/services/auth";
import { setAuth } from "@/lib/utils/authState";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();
    const router = useRouter();

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

    // Listen for NextAuth session change to perform social exchange
    useEffect(() => {
        const handleSocialLogin = async () => {
            if (status === "authenticated" && session?.user) {
                const exchangeToast = toast.loading("កំពុងបញ្ចប់ការចូលគណនី...");
                try {
                    setLoading(true);
                    const provider = session.user.provider || "google";
                    const accessToken = session.user.accessToken;

                    if (!accessToken) {
                        console.error("No access token in session:", session);
                        // Some providers might not return accessToken in the same way
                    }

                    const { data, token } = await socialLogin({ provider, accessToken });
                    if (token) {
                        const userRecord = data?.data;
                        const role = userRecord?.role || "user";
                        setAuth({ token, role });
                        setUser(userRecord);

                        toast.success("ចូលគណនីបានជោគជ័យ", { id: exchangeToast });

                        // Sign out of NextAuth to clear cookies/session of next-auth
                        await signOut({ redirect: false });

                        // Redirect to home/homepage or dashboard using router for speed
                        router.push(role === "admin" ? "/admin/dashboard" : "/");
                    }
                } catch (error) {
                    console.error("Social login exchange failed:", error);
                    const errMsg = error?.response?.data?.message || "បរាជ័យក្នុងការចូលគណនីជាមួយបណ្តាញសង្គម";
                    toast.error(errMsg, { id: exchangeToast });
                    // Sign out to prevent loop on failure
                    await signOut({ redirect: false });
                } finally {
                    setLoading(false);
                }
            }
        };

        handleSocialLogin();
    }, [session, status, router]);

    const refreshUser = async () => {
        try {
            const userData = await apiMe();
            if (userData) {
                setUser(userData);
                if (userData.role) {
                    setAuth({ role: userData.role });
                }
                return userData;
            }
        } catch (error) {
            console.error("Auth refresh failed:", error);
        }
        return null;
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
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
