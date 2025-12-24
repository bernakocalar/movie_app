import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserArchive, getUserComments, toggleReviewVisibility } from "../services/repository";
import { Film, MessageSquare, ExternalLink, Lock, Globe } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

export default function Profile() {
    const { currentUser } = useAuth();
    const { t } = useTranslation();
    const [archive, setArchive] = useState([]);
    const [comments, setComments] = useState([]);
    const [activeTab, setActiveTab] = useState("archive"); // 'archive' or 'comments'

    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser]);

    const loadData = async () => {
        const userArchive = await getUserArchive(currentUser.uid);
        const userComments = await getUserComments(currentUser.uid);
        setArchive(userArchive);
        setComments(userComments);
    };

    if (!currentUser) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
            <p>
                <Trans i18nKey="login_to_view_profile">
                    Please <Link to="/login" className="text-red-500 underline">login</Link> to view your profile.
                </Trans>
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-6 mb-12 bg-gray-900/40 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-xl">
                    <div className="bg-gradient-to-br from-orange-500 to-yellow-500 w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg text-white">
                        {currentUser.email[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">{currentUser.email}</h1>
                        <p className="text-orange-400 text-sm font-medium bg-orange-500/10 px-3 py-1 rounded-full w-fit border border-orange-500/20">{t('member_since')} 2024</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800 mb-10">
                    <button
                        onClick={() => setActiveTab("archive")}
                        className={`px-8 py-4 font-bold flex items-center gap-3 transition-all relative ${activeTab === "archive" ? "text-orange-500" : "text-gray-400 hover:text-white"}`}
                    >
                        <Film size={20} /> {t('my_archive')}
                        {activeTab === "archive" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab("comments")}
                        className={`px-8 py-4 font-bold flex items-center gap-3 transition-all relative ${activeTab === "comments" ? "text-orange-500" : "text-gray-400 hover:text-white"}`}
                    >
                        <MessageSquare size={20} /> {t('my_comments')}
                        {activeTab === "comments" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-t-full"></div>}
                    </button>
                </div>

                {/* Content */}
                {activeTab === "archive" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {archive.length > 0 ? (
                            archive.map(item => (
                                <Link key={item.id || item.movieId} to={`/movie/${item.movieId}`} className="block group">
                                    <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800 mb-3 shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-gray-800 group-hover:border-orange-500/30">
                                        <img
                                            src={item.poster}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h3 className="font-bold truncate text-gray-200 group-hover:text-orange-400 transition-colors text-lg">{item.title}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{item.year}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 text-gray-500 bg-gray-900/30 rounded-2xl border border-gray-800/50 border-dashed">
                                <Film size={48} className="mx-auto mb-4 opacity-50" />
                                {t('no_archived_movies')}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "comments" && (
                    <div className="space-y-6">
                        {comments.length > 0 ? (
                            comments.map(c => (
                                <div key={c.id || c.date} className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-orange-500/30 transition-colors shadow-sm group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <Link to={`/movie/${c.movieId}`} className="font-bold text-orange-500 mb-1 hover:text-orange-400 text-sm flex items-center gap-1">
                                                {c.movieTitle} <ExternalLink size={12} />
                                            </Link>
                                            <h3 className="text-xl font-bold text-white group-hover:text-gray-100">{c.title || t('untitled_review')}</h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500 font-medium bg-gray-800 px-2 py-1 rounded">{new Date(c.createdAt).toLocaleDateString()}</span>
                                            <button
                                                onClick={async () => {
                                                    await toggleReviewVisibility(c.id, c.isPrivate);
                                                    loadData();
                                                }}
                                                className="text-gray-500 hover:text-white transition p-2 hover:bg-gray-800 rounded-lg"
                                                title={t('toggle_visibility')}
                                            >
                                                {c.isPrivate ? <Lock size={16} className="text-orange-400" /> : <Globe size={16} className="text-green-400" />}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-4 whitespace-pre-wrap leading-relaxed">{c.text}</p>
                                    <div className="flex justify-between items-center text-xs border-t border-gray-800 pt-4 mt-2">
                                        <div className="flex items-center gap-2">
                                            {c.isPrivate ? (
                                                <span className="text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded flex items-center gap-1 font-medium">
                                                    <Lock size={10} /> {t('private_review')}
                                                </span>
                                            ) : (
                                                <span className="text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded flex items-center gap-1 font-medium">
                                                    <Globe size={10} /> Public
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 text-gray-500 bg-gray-900/30 rounded-2xl border border-gray-800/50 border-dashed">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                                {t('no_profile_reviews')}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
