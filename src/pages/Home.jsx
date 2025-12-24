import { useState, useEffect } from "react";
import { searchMovies, getMovieDetails } from "../services/omdb";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get("q") || "";

    // Local state to manage input value while typing
    const [inputQuery, setInputQuery] = useState(queryParam);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    // Sync input with URL param (e.g. when clicking back or clicking logo)
    useEffect(() => {
        setInputQuery(queryParam);
    }, [queryParam]);

    // Fetch data based on URL query
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            if (queryParam.trim()) {
                // Search Mode
                try {
                    const data = await searchMovies(queryParam);
                    if (data.Response === "True") {
                        setMovies(data.Search);
                    } else {
                        setMovies([]);
                        setError(data.Error);
                    }
                } catch (err) {
                    setError(t('fetch_error'));
                } finally {
                    setLoading(false);
                }
            } else {
                // Default Curated Mode
                try {
                    const curatedIDs = [
                        "tt0468569", // The Dark Knight
                        "tt1375666", // Inception
                        "tt0816692", // Interstellar
                        "tt0111161", // The Shawshank Redemption
                        "tt0068646", // The Godfather
                        "tt0109830", // Forrest Gump
                        "tt0050083", // 12 Angry Men
                        "tt0133093", // The Matrix
                        "tt0167260", // The Lord of the Rings: The Return of the King
                        "tt0110912", // Pulp Fiction
                        "tt0137523", // Fight Club
                        "tt0099685", // Goodfellas
                        "tt0080684", // The Empire Strikes Back
                        "tt0245429", // Spirited Away
                        "tt6751668", // Parasite
                        "tt0172495", // Gladiator
                        "tt0110357", // The Lion King
                        "tt0088763", // Back to the Future
                        "tt0103064", // Terminator 2: Judgment Day
                        "tt0102926", // The Silence of the Lambs
                    ];

                    const promises = curatedIDs.map(id => getMovieDetails(id));
                    const results = await Promise.all(promises);
                    const validMovies = results.filter(m => m && m.Response === "True");
                    setMovies(validMovies);
                } catch (err) {
                    console.error("Failed to load featured movies", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [queryParam, t]); // Re-run whenever the URL 'q' param changes

    const handleSearch = (e) => {
        e.preventDefault();
        if (!inputQuery.trim()) {
            setSearchParams({});
            return;
        }
        setSearchParams({ q: inputQuery });
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 drop-shadow-sm">
                    {queryParam ? t('search_results') : t('find_movies_title')}
                </h1>

                <form onSubmit={handleSearch} className="flex gap-2 mb-12 max-w-2xl mx-auto">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            className="w-full bg-gray-900 border border-gray-700 rounded-full py-4 pl-12 pr-6 text-white text-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-gray-500 shadow-lg"
                            placeholder={t('search_placeholder')}
                            value={inputQuery}
                            onChange={(e) => setInputQuery(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        {t('search_button')}
                    </button>
                </form>

                {loading && <div className="text-center text-xl text-orange-400 animate-pulse">{t('loading_short')}</div>}

                {error && <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg max-w-lg mx-auto border border-red-500/30">{error}</div>}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {movies.map((movie) => (
                        <Link to={`/movie/${movie.imdbID}`} key={movie.imdbID} className="block group">
                            <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800 shadow-xl border border-gray-800 group-hover:border-orange-500/50 transition-all duration-300">
                                {movie.Poster !== "N/A" ? (
                                    <img
                                        src={movie.Poster}
                                        alt={movie.Title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">{t('no_image')}</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">{t('view_details')}</span>
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <h3 className="font-bold text-lg truncate text-gray-200 group-hover:text-orange-400 transition-colors">{movie.Title}</h3>
                                <p className="text-sm text-gray-500">{movie.Year}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
