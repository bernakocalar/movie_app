const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = `https://www.omdbapi.com/`;

export const searchMovies = async (query, page = 1) => {
    if (!query) return;
    const response = await fetch(`${BASE_URL}?s=${query}&page=${page}&apikey=${API_KEY}`);
    const data = await response.json();
    return data;
};

export const getMovieDetails = async (id) => {
    if (!id) return;
    const response = await fetch(`${BASE_URL}?i=${id}&plot=full&apikey=${API_KEY}`);
    const data = await response.json();
    return data;
};
