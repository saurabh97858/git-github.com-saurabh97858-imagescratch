import { useUser } from "@clerk/clerk-react";

export default function AdminRoute({ children }) {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // Check if user has admin role in public metadata
    const isAdmin = user?.publicMetadata?.role === "admin";

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
                <p className="text-gray-400 text-lg">
                    You don't have permission to access this page.
                </p>
                <a
                    href="/"
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold rounded-xl hover:scale-105 transition-transform"
                >
                    Go to Home
                </a>
            </div>
        );
    }

    return children;
}
