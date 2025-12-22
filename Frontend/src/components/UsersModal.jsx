import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";

export default function UsersModal({ isOpen, onClose }) {
    const { getToken } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const { data } = await axios.get(`${backendUrl}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Manage Users 👥</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-300">
                                <thead className="bg-black/30 text-xs uppercase text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Credits</th>
                                        <th className="px-6 py-3">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-white/5">
                                            <td className="px-6 py-4 font-medium text-white">{user.name || "N/A"}</td>
                                            <td className="px-6 py-4">{user.email || "N/A"}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                                                    {user.creditBalance}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && (
                                <p className="text-center text-gray-500 py-6">No users found.</p>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
