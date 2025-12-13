import { createContext, useContext, useEffect, useState } from "react";
import { auth, isConfigured } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock Login Helper
    const mockLogin = (email) => {
        const user = { email, uid: "mock-123", displayName: "Test User" };
        setCurrentUser(user);
        localStorage.setItem("mockUser", JSON.stringify(user));
    };
    const mockLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem("mockUser");
    };

    useEffect(() => {
        if (isConfigured) {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);
                setLoading(false);
            });
            return unsubscribe;
        } else {
            // Mock Initialization
            const savedUser = localStorage.getItem("mockUser");
            if (savedUser) setCurrentUser(JSON.parse(savedUser));
            setLoading(false);
        }
    }, []);

    const value = {
        currentUser,
        // Add these so components can call them if needed, or if we wrap the auth service calls
        mockLogin,
        mockLogout,
        isConfigured
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
