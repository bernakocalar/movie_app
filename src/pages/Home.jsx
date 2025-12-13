import { useState, useEffect } from "react";
import { searchMovies } from "../services/omdb";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function Home() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const data = await searchMovies(query);
            if (data.Response === "True") {
                setMovies(data.Search);
            } else {
                setMovies([]);
                setError(data.Error);
            }
        } catch (err) {
            setError("Failed to fetch movies.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-red-600">Find Movies & TV Series</h1>

                <form onSubmit={handleSearch} className="flex gap-2 mb-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-600"
                            placeholder="Search for a movie (e.g. Matrix, Breaking Bad)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
                    >
                        Search
                    </button>
                </form>

                {loading && <div className="text-center text-xl">Loading...</div>}

                {error && <div className="text-center text-red-400">{error}</div>}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <Link to={`/movie/${movie.imdbID}`} key={movie.imdbID} className="block group">
                            <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-800">
                                {movie.Poster !== "N/A" ? (
                                    <img
                                        src={movie.Poster}
                                        alt={movie.Title}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <span className="text-white font-semibold">View Details</span>
                                </div>
                            </div>
                            <h3 className="mt-2 font-bold truncate group-hover:text-red-500">{movie.Title}</h3>
                            <p className="text-sm text-gray-400">{movie.Year}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
