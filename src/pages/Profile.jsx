export default function Profile() {
    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">My Archive</h1>
                <p className="text-gray-400">Your saved movies and comments will appear here.</p>
                {/* TODO: Implement Firestore fetching for user's archive */}
            </div>
        </div>
    );
}
