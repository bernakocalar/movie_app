import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/omdb";
import { useAuth } from "../context/AuthContext";
import { addReview, getCommentsForMovie, addToArchive, toggleReviewVisibility } from "../services/repository";
import { Star, Calendar, Clock, MessageSquare, Plus, Check, Lock, Globe } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

export default function MovieDetails() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const { t } = useTranslation();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewTitle, setReviewTitle] = useState("");
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [archived, setArchived] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            const data = await getMovieDetails(id);
            setMovie(data);

            // Load comments
            const movieComments = await getCommentsForMovie(id, currentUser?.uid);
            setComments(movieComments);

            setLoading(false);
        };
        fetchDetails();
    }, [id, currentUser]); // Added currentUser to dependency to refresh if auth state changes

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim() || !currentUser) return;

        await addReview(currentUser, movie, reviewTitle, comment, isPrivate);

        // Refresh comments
        const updated = await getCommentsForMovie(id, currentUser.uid);
        setComments(updated);
        setComment("");
        setReviewTitle("");
    };

    const handleArchive = async () => {
        if (!currentUser) return;
        await addToArchive(currentUser, movie);
        setArchived(true);
    };

    if (loading) return <div className="text-white text-center p-10">{t('loading')}</div>;
    if (!movie) return <div className="text-white text-center p-10">{t('movie_not_found')}</div>;

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Movie Info Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-12 bg-gray-900/40 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm">
                    <div className="w-full md:w-1/3">
                        <img
                            src={movie.Poster !== "N/A" ? movie.Poster : ""}
                            alt={movie.Title}
                            className="w-full rounded-xl shadow-2xl border border-gray-800 group-hover:border-orange-500/50 transition-all"
                        />
                    </div>
                    <div className="w-full md:w-2/3">
                        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">{movie.Title}</h1>
                        <div className="flex items-center gap-4 text-gray-400 mb-8 font-medium">
                            <span className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full"><Calendar size={16} className="text-orange-500" /> {movie.Year}</span>
                            <span className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full"><Clock size={16} className="text-orange-500" /> {movie.Runtime}</span>
                            <span className="flex items-center gap-1 text-yellow-500 bg-gray-800 px-3 py-1 rounded-full"><Star size={16} fill="currentColor" /> {movie.imdbRating}</span>
                            <span className="border border-orange-500/30 px-3 py-1 rounded-full text-xs text-orange-400">{movie.Rated}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {movie.Genre.split(", ").map(g => (
                                <span key={g} className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold hover:border-orange-500/50 transition-colors">{g}</span>
                            ))}
                        </div>

                        <p className="text-lg leading-relaxed mb-8 text-gray-300 font-light tracking-wide">{movie.Plot}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-10 text-sm border-t border-gray-800 pt-6">
                            <div className="flex gap-2"><span className="text-gray-500 font-bold min-w-[80px]">{t('director')}:</span> <span className="text-gray-200">{movie.Director}</span></div>
                            <div className="flex gap-2"><span className="text-gray-500 font-bold min-w-[80px]">{t('cast')}:</span> <span className="text-gray-200">{movie.Actors}</span></div>
                            <div className="flex gap-2"><span className="text-gray-500 font-bold min-w-[80px]">{t('writer')}:</span> <span className="text-gray-200">{movie.Writer}</span></div>
                            <div className="flex gap-2"><span className="text-gray-500 font-bold min-w-[80px]">{t('awards')}:</span> <span className="text-gray-200">{movie.Awards}</span></div>
                        </div>

                        {currentUser && (
                            <button
                                onClick={handleArchive}
                                disabled={archived}
                                className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg transform hover:scale-105 active:scale-95 ${archived ? "bg-green-600/20 text-green-500 border border-green-500/50 cursor-default" : "bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white"} `}
                            >
                                {archived ? <><Check size={20} /> {t('archived')}</> : <><Plus size={20} /> {t('add_to_archive')}</>}
                            </button>
                        )}
                    </div>
                </div>

                {/* Reviews / Blog Section */}
                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
                        <MessageSquare className="text-orange-500" /> {t('reviews_section_title')}
                    </h2>

                    {currentUser ? (
                        <form onSubmit={handleAddComment} className="mb-12 bg-gray-950/50 p-6 rounded-xl border border-gray-800 focus-within:border-orange-500/50 transition-colors">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={reviewTitle}
                                    onChange={(e) => setReviewTitle(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-bold text-xl placeholder-gray-600 transition-all"
                                    placeholder={t('review_title_placeholder')}
                                />
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 mb-6 placeholder-gray-600 transition-all text-lg"
                                placeholder={t('review_content_placeholder')}
                                rows="5"
                            />
                            <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg border border-gray-800">
                                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-400 hover:text-white transition group select-none">
                                    <div className={`w-5 h-5 flex items-center justify-center border rounded transition-colors ${isPrivate ? 'bg-orange-500 border-orange-500' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                        {isPrivate && <Check size={14} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isPrivate}
                                        onChange={(e) => setIsPrivate(e.target.checked)}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-2">
                                        {isPrivate ? <Lock size={16} className="text-orange-400" /> : <Globe size={16} className="text-green-400" />}
                                        <span className={isPrivate ? "text-orange-100" : "text-gray-300"}>{t('private_review')}</span>
                                    </div>
                                </label>
                                <button type="submit" className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 px-8 py-3 rounded-lg text-white font-bold transition shadow-lg transform hover:-translate-y-0.5">
                                    {t('post_review')}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-gray-800/30 p-8 rounded-xl text-center mb-8 border border-gray-800 border-dashed">
                            <p className="text-gray-400 text-lg">
                                <Trans i18nKey="login_to_review">
                                    Please <a href="/login" className="text-orange-500 font-bold hover:underline hover:text-orange-400">login</a> to add a review.
                                </Trans>
                            </p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {comments.length > 0 ? (
                            comments.map(c => (
                                <div key={c.id} className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 hover:border-orange-500/30 transition shadow-sm group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-100 transition-colors">{c.title || t('untitled_review')}</h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-400 bg-gray-900/50 w-fit px-3 py-1.5 rounded-full border border-gray-800">
                                                <span className="text-orange-400 font-medium">@{c.userEmail?.split('@')[0]}</span>
                                                <span className="text-gray-600">•</span>
                                                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                                {c.isPrivate && (
                                                    <>
                                                        <span className="text-gray-600">•</span>
                                                        <span className="flex items-center gap-1 text-xs text-orange-300 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                                                            <Lock size={10} /> {t('private_review')}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {currentUser?.uid === c.userId && (
                                            <button
                                                onClick={async () => {
                                                    await toggleReviewVisibility(c.id, c.isPrivate);
                                                    // Refresh comments
                                                    const updated = await getCommentsForMovie(id, currentUser.uid);
                                                    setComments(updated);
                                                }}
                                                className="text-gray-500 hover:text-white transition p-2 hover:bg-gray-700 rounded-lg"
                                                title={t('toggle_visibility')}
                                            >
                                                {c.isPrivate ? <Lock size={18} className="text-orange-400" /> : <Globe size={18} className="text-green-400" />}
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                                        {c.text}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-gray-800/20 rounded-xl border border-gray-800/50">
                                <MessageSquare size={48} className="mx-auto text-gray-700 mb-4" />
                                <p className="text-gray-500 text-lg">{t('no_reviews')}</p>
                            </div>
                        )}
                    </div>
                </div >
            </div >
        </div >
    );
}
