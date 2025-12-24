import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/firebase";
import { LogOut, Film, User } from "lucide-react";

export default function Navbar() {
    const { currentUser, mockLogout, isConfigured } = useAuth();
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const { t } = useTranslation();
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
        <nav className="bg-gray-950/90 backdrop-blur-md border-b border-gray-800 text-white p-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 hover:opacity-80 transition-opacity">
                    <Film className="text-orange-500" /> MovieVault
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'tr' : 'en')}
                        className="text-gray-400 hover:text-white font-bold text-sm border border-gray-700 hover:border-orange-500 rounded px-3 py-1 transition-colors"
                    >
                        {i18n.language === 'en' ? 'TR' : 'EN'}
                    </button>
                    {currentUser ? (
                        <>
                            <Link to="/profile" className="hover:text-orange-400 flex items-center gap-1 transition-colors font-medium">
                                <User size={18} /> {t('my_archive')}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all border border-gray-700 hover:border-gray-600"
                            >
                                <LogOut size={16} /> {t('logout')}
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 px-5 py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all text-white">
                            {t('login')}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
