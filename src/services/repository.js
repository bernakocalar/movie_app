import { db, isConfigured } from "./firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

// LocalStorage Keys
const REPO_COMMENTS = "mv_comments";
const REPO_ARCHIVE = "mv_archive";

export const addReview = async (user, movie, title, text, isPrivate) => {
    const review = {
        userId: user.uid,
        userEmail: user.email,
        movieId: movie.imdbID,
        movieTitle: movie.Title,
        title,
        text,
        isPrivate,
        createdAt: new Date().toISOString()
    };

    if (isConfigured) {
        await addDoc(collection(db, "comments"), review); // Keeping "comments" collection name for compatibility or migration ease
    } else {
        // Mock Mode: Save to LocalStorage
        const existing = JSON.parse(localStorage.getItem(REPO_COMMENTS) || "[]");
        existing.push({ ...review, id: Date.now().toString() });
        localStorage.setItem(REPO_COMMENTS, JSON.stringify(existing));
    }
    return review;
};

export const toggleReviewVisibility = async (reviewId, currentStatus) => {
    if (isConfigured) {
        const { doc, updateDoc } = await import("firebase/firestore");
        const reviewRef = doc(db, "comments", reviewId);
        await updateDoc(reviewRef, { isPrivate: !currentStatus });
    } else {
        const all = JSON.parse(localStorage.getItem(REPO_COMMENTS) || "[]");
        const updated = all.map(c => c.id === reviewId ? { ...c, isPrivate: !currentStatus } : c);
        localStorage.setItem(REPO_COMMENTS, JSON.stringify(updated));
    }
};

export const getCommentsForMovie = async (movieId, viewerId = null) => {
    if (isConfigured) {
        // Query 1: Public Comments
        // We sort in JS to avoid Composite Index requirements for now
        const qPublic = query(
            collection(db, "comments"),
            where("movieId", "==", movieId),
            where("isPrivate", "==", false)
        );
        const snapshotPublic = await getDocs(qPublic);
        let results = snapshotPublic.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Query 2: My Private Comments (if logged in)
        if (viewerId) {
            const qPrivate = query(
                collection(db, "comments"),
                where("movieId", "==", movieId),
                where("userId", "==", viewerId),
                where("isPrivate", "==", true)
            );
            const snapshotPrivate = await getDocs(qPrivate);
            const privateDocs = snapshotPrivate.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            results = [...results, ...privateDocs];
        }

        // Sort by date desc (Client side)
        return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
        const all = JSON.parse(localStorage.getItem(REPO_COMMENTS) || "[]");
        // In local storage, we just filter everything simply
        let results = all.filter(c => c.movieId === movieId);

        // Emulate privacy check (optional, but good for consistency)
        if (viewerId) {
            results = results.filter(c => !c.isPrivate || c.userId === viewerId);
        } else {
            results = results.filter(c => !c.isPrivate);
        }

        return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
