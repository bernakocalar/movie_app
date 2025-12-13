import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserArchive, getUserComments } from "../services/repository";
import { Film, MessageSquare, ExternalLink } from "lucide-react";

export default function Profile() {
    const { currentUser } = useAuth();
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
            <p>Please <Link to="/login" className="text-red-500 underline">login</Link> to view your profile.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                        {currentUser.email[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{currentUser.email}</h1>
                        <p className="text-gray-400 text-sm">Member since 2024</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800 mb-8">
                    <button
                        onClick={() => setActiveTab("archive")}
                        className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === "archive" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-white"}`}
                    >
                        <Film size={18} /> My Archive
                    </button>
                    <button
                        onClick={() => setActiveTab("comments")}
                        className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === "comments" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-white"}`}
                    >
                        <MessageSquare size={18} /> My Comments
                    </button>
                </div>

                {/* Content */}
                {activeTab === "archive" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {archive.length > 0 ? (
                            archive.map(item => (
                                <Link key={item.id || item.movieId} to={`/movie/${item.movieId}`} className="block group">
                                    <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-800 mb-2">
                                        <img
                                            src={item.poster}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="font-bold truncate group-hover:text-red-500">{item.title}</h3>
                                    <p className="text-xs text-gray-500">{item.year}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                You haven't archived any movies yet.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "comments" && (
                    <div className="space-y-4">
                        {comments.length > 0 ? (
                            comments.map(c => (
                                <div key={c.id || c.date} className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-red-500">{c.movieTitle}</h4>
                                        <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-300 mb-3">"{c.text}"</p>
                                    <div className="flex justify-between items-center text-xs">
                                        {c.isPrivate && <span className="text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">Private</span>}
                                        <Link to={`/movie/${c.movieId}`} className="text-gray-400 hover:text-white flex items-center gap-1">
                                            View Movie <ExternalLink size={12} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                You haven't posted any comments yet.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
