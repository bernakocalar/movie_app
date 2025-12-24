import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { mockLogin, isConfigured } = useAuth(); // Added useAuth hook
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (isConfigured) { // Added conditional check for configuration
                if (isLogin) {
                    await signInWithEmailAndPassword(auth, email, password);
                } else {
                    await createUserWithEmailAndPassword(auth, email, password);
                }
            } else {
                // Use Mock Login
                mockLogin(email);
            }
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"></div>

                <h2 className="text-4xl font-black text-white mb-8 text-center tracking-tight">
                    {isLogin ? t('welcome_back') : t('create_account')}
                </h2>

                {error && <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6 text-sm flex items-center gap-2">⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm font-medium">{t('email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-800/80 border border-gray-700 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm font-medium">{t('password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800/80 border border-gray-700 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-95 transition-all text-lg"
                    >
                        {isLogin ? t('sign_in') : t('sign_up')}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    {isLogin ? t('dont_have_account') : t('already_have_account')}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-orange-500 hover:text-orange-400 font-bold hover:underline ml-1"
                    >
                        {isLogin ? t('sign_up') : t('sign_in')}
                    </button>
                </p>
            </div>
        </div>
    );
}
