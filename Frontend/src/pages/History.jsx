import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiDownload, FiTrash2, FiClock } from "react-icons/fi";

const History = () => {
    const { isSignedIn, getToken } = useUser();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (isSignedIn) {
            fetchHistory();
        }
    }, [isSignedIn]);

    const fetchHistory = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${backendUrl}/api/image/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (data.success) {
                setHistory(data.history);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = await getToken();
            const res = await fetch(`${backendUrl}/api/image/history/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (data.success) {
                setHistory(prev => prev.filter(item => item._id !== id));
                toast.success("Deleted successfully!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    if (!isSignedIn) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <p className="text-gray-600 dark:text-gray-400">Please login to view your history</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading history...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[80vh] px-4 py-8 max-w-7xl mx-auto"
        >
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
                Your Creation History
            </h1>

            {history.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No creations yet. Start generating images!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {history.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            {/* Image */}
                            <div className="relative aspect-square">
                                <img
                                    src={item.imageUrl}
                                    alt={item.prompt}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="p-4">
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                                    {item.prompt}
                                </p>

                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    <FiClock size={12} />
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <a
                                        href={item.imageUrl}
                                        download={`imagify-${item._id}.png`}
                                        className="flex-1 flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded-lg transition-colors"
                                    >
                                        <FiDownload size={14} />
                                        Download
                                    </a>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default History;
