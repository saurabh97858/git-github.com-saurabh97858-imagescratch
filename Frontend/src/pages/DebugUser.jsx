import { useUser } from "@clerk/clerk-react";

export default function DebugUser() {
    const { user, isSignedIn, isLoaded } = useUser();

    if (!isLoaded) {
        return <div className="p-8">Loading...</div>;
    }

    if (!isSignedIn) {
        return <div className="p-8">Please login first!</div>;
    }

    const isAdmin = user?.publicMetadata?.role === "admin";

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-white">🔍 User Debug Info</h1>

            <div className="bg-gray-800 rounded-lg p-6 mb-4">
                <h2 className="text-xl font-semibold mb-3 text-orange-500">Basic Info:</h2>
                <pre className="text-sm text-gray-300">
                    {JSON.stringify({
                        id: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    }, null, 2)}
                </pre>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-4">
                <h2 className="text-xl font-semibold mb-3 text-orange-500">Public Metadata:</h2>
                <pre className="text-sm text-gray-300">
                    {JSON.stringify(user.publicMetadata, null, 2)}
                </pre>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-4">
                <h2 className="text-xl font-semibold mb-3 text-orange-500">Admin Status:</h2>
                <div className="text-2xl">
                    {isAdmin ? (
                        <span className="text-green-400">✅ You are ADMIN!</span>
                    ) : (
                        <span className="text-red-400">❌ You are NOT admin</span>
                    )}
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-3 text-orange-500">Full User Object:</h2>
                <pre className="text-xs text-gray-300 overflow-auto max-h-96">
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div>

            <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-500 rounded-lg">
                <h3 className="font-bold text-yellow-500 mb-2">📋 Instructions:</h3>
                <p className="text-gray-300 text-sm">
                    If "Public Metadata" shows <code className="bg-gray-700 px-1 rounded">{`{ "role": "admin" }`}</code>
                    but you're still not admin, try:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
                    <li>Logout completely from the app</li>
                    <li>Clear browser cache (Ctrl+Shift+Delete)</li>
                    <li>Login again</li>
                </ul>
            </div>
        </div>
    );
}
