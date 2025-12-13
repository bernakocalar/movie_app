import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/firebase";
import { LogOut, Film, User } from "lucide-react";

export default function Navbar() {
    const { currentUser, mockLogout, isConfigured } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            if (isConfigured) {
                await auth.signOut();
            } else {
                mockLogout();
            }
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-red-600">
                    <Film /> MovieVault
                </Link>
                <div className="flex items-center gap-4">
                    {currentUser ? (
                        <>
                            <Link to="/profile" className="hover:text-red-500 flex items-center gap-1">
                                <User size={18} /> My Archive
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
