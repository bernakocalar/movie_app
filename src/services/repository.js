import { db, isConfigured } from "./firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

// LocalStorage Keys
const REPO_COMMENTS = "mv_comments";
const REPO_ARCHIVE = "mv_archive";

export const addComment = async (user, movie, text, isPrivate) => {
    const comment = {
        userId: user.uid,
        userEmail: user.email,
        movieId: movie.imdbID,
        movieTitle: movie.Title,
        text,
        isPrivate,
        createdAt: new Date().toISOString()
    };

    if (isConfigured) {
        await addDoc(collection(db, "comments"), comment);
    } else {
        // Mock Mode: Save to LocalStorage
        const existing = JSON.parse(localStorage.getItem(REPO_COMMENTS) || "[]");
        existing.push({ ...comment, id: Date.now().toString() });
        localStorage.setItem(REPO_COMMENTS, JSON.stringify(existing));
    }
    return comment;
};

export const getCommentsForMovie = async (movieId) => {
    if (isConfigured) {
        const q = query(
            collection(db, "comments"),
            where("movieId", "==", movieId),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
        const all = JSON.parse(localStorage.getItem(REPO_COMMENTS) || "[]");
        return all
            .filter(c => c.movieId === movieId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
};

export const getUserComments = async (userId) => {
    if (isConfigured) {
        const q = query(
            collection(db, "comments"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
        const all = JSON.parse(localStorage.getItem(REPO_COMMENTS) || "[]");
        return all
            .filter(c => c.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
};

export const addToArchive = async (user, movie) => {
    const item = {
        userId: user.uid,
        movieId: movie.imdbID,
        title: movie.Title,
        poster: movie.Poster,
        year: movie.Year,
        addedAt: new Date().toISOString()
    };

    if (isConfigured) {
        await addDoc(collection(db, "archive"), item);
    } else {
        const existing = JSON.parse(localStorage.getItem(REPO_ARCHIVE) || "[]");
        // Check duplicate
        if (!existing.find(i => i.userId === user.uid && i.movieId === movie.imdbID)) {
            existing.push(item);
            localStorage.setItem(REPO_ARCHIVE, JSON.stringify(existing));
        }
    }
};

export const getUserArchive = async (userId) => {
    if (isConfigured) {
        const q = query(collection(db, "archive"), where("userId", "==", userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
        const all = JSON.parse(localStorage.getItem(REPO_ARCHIVE) || "[]");
        return all.filter(c => c.userId === userId);
    }
};
