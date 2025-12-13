import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/omdb";
import { useAuth } from "../context/AuthContext";
import { addComment, getCommentsForMovie, addToArchive } from "../services/repository";
import { Star, Calendar, Clock, MessageSquare, Plus, Check } from "lucide-react";

export default function MovieDetails() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [archived, setArchived] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            const data = await getMovieDetails(id);
            setMovie(data);

            // Load comments
            const movieComments = await getCommentsForMovie(id);
            setComments(movieComments);

            setLoading(false);
        };
        fetchDetails();
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim() || !currentUser) return;

        await addComment(currentUser, movie, comment, isPrivate);

        // Refresh comments
        const updated = await getCommentsForMovie(id);
        setComments(updated);
        setComment("");
    };

    const handleArchive = async () => {
        if (!currentUser) return;
        await addToArchive(currentUser, movie);
        setArchived(true);
    };

    if (loading) return <div className="text-white text-center p-10">Loading details...</div>;
    if (!movie) return <div className="text-white text-center p-10">Movie not found.</div>;

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Movie Info Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    <div className="w-full md:w-1/3">
                        <img
                            src={movie.Poster !== "N/A" ? movie.Poster : ""}
                            alt={movie.Title}
                            className="w-full rounded-lg shadow-2xl"
                        />
                    </div>
                    <div className="w-full md:w-2/3">
                        <h1 className="text-4xl font-bold mb-2">{movie.Title}</h1>
                        <div className="flex items-center gap-4 text-gray-400 mb-6">
                            <span className="flex items-center gap-1"><Calendar size={16} /> {movie.Year}</span>
                            <span className="flex items-center gap-1"><Clock size={16} /> {movie.Runtime}</span>
                            <span className="flex items-center gap-1 text-yellow-500"><Star size={16} /> {movie.imdbRating}</span>
                            <span className="border border-gray-700 px-2 py-0.5 rounded text-xs">{movie.Rated}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.Genre.split(", ").map(g => (
                                <span key={g} className="bg-gray-800 px-3 py-1 rounded-full text-sm">{g}</span>
                            ))}
                        </div>

                        <p className="text-lg leading-relaxed mb-6 text-gray-300">{movie.Plot}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm">
                            <div><span className="text-gray-500">Director:</span> {movie.Director}</div>
                            <div><span className="text-gray-500">Cast:</span> {movie.Actors}</div>
                            <div><span className="text-gray-500">Writer:</span> {movie.Writer}</div>
                            <div><span className="text-gray-500">Awards:</span> {movie.Awards}</div>
                        </div>

                        {currentUser && (
                            <button
                                onClick={handleArchive}
                                disabled={archived}
                                className={`px - 6 py - 3 rounded - lg font - bold flex items - center gap - 2 transition ${archived ? "bg-green-600 cursor-default" : "bg-red-600 hover:bg-red-700 text-white"} `}
                            >
                                {archived ? <><Check size={20} /> Archived</> : <><Plus size={20} /> Add to Archive</>}
                            </button>
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-gray-900 rounded-xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <MessageSquare /> Comments
                    </h2>

                    {currentUser ? (
                        <form onSubmit={handleAddComment} className="mb-8">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-gray-800 border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-red-600"
                                placeholder="Leave your comment here..."
                                rows="3"
                            />
                            <div className="flex justify-between items-center mt-2">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400">
                                    <input
                                        type="checkbox"
                                        checked={isPrivate}
                                        onChange={(e) => setIsPrivate(e.target.checked)}
                                        className="accent-red-600"
                                    />
                                    Private Comment (Only visible to you)
                                </label>
                                <button type="submit" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-white transition">
                                    Post Comment
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-gray-800/50 p-4 rounded text-center mb-8">
                            <p>Please <a href="/login" className="text-red-500 underline">login</a> to add comments.</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {comments.length > 0 ? (
                            comments.map(c => (
                                <div key={c.id} className="border-b border-gray-800 pb-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-red-500">{c.userEmail}</span>
                                        <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-300">{c.text}</p>
                                    {c.isPrivate && <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded mt-2 inline-block">Private</span>}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No comments yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
