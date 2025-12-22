import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import StatsCards from "../components/StatsCards";
import HelpDesk from "../components/HelpDesk";
import FeatureManager from "../components/FeatureManager";
import AnalyticsModal from "../components/AnalyticsModal";
import UsersModal from "../components/UsersModal";
import SettingsModal from "../components/SettingsModal";

export default function Dashboard() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [stats, setStats] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await getToken();

            // Fetch stats
            const statsRes = await axios.get(`${backendUrl}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsRes.data.stats);

            // Fetch contacts
            const contactsRes = await axios.get(`${backendUrl}/api/admin/contacts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContacts(contactsRes.data.contacts);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error(error.response?.data?.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-10 min-h-screen"
        >
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-8"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                    Admin Dashboard 🎛️
                </h1>
                <p className="text-gray-400 text-lg">
                    Welcome back, <span className="text-orange-500 font-semibold">{user?.firstName || "Admin"}</span>!
                    Here's what's happening today.
                </p>
            </motion.div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Help Desk - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <HelpDesk contacts={contacts} onUpdate={fetchData} />
                </div>

                {/* Feature Manager - Takes 1 column */}
                <div>
                    <FeatureManager />
                </div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
                <h2 className="text-2xl font-bold text-white mb-4">Quick Actions 🚀</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => setShowAnalytics(true)}
                        className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
                    >
                        📊 View Analytics
                    </button>
                    <button
                        onClick={() => setShowUsers(true)}
                        className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
                    >
                        👥 Manage Users
                    </button>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
                    >
                        ⚙️ Settings
                    </button>
                    <button
                        onClick={fetchData}
                        className="p-4 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl text-black font-semibold hover:scale-105 transition-transform"
                    >
                        🔄 Refresh Data
                    </button>
                </div>
            </motion.div>

            {/* Footer Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center text-gray-500 text-sm"
            >
                Last updated: {new Date().toLocaleString()} | Imagify Admin Panel v1.0
            </motion.div>

            {/* Modals */}
            <AnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} />
            <UsersModal isOpen={showUsers} onClose={() => setShowUsers(false)} />
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </motion.div>
    );
}
