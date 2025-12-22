import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export default function HelpDesk({ contacts, onUpdate }) {
    const { getToken } = useAuth();
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedContact, setSelectedContact] = useState(null);
    const [responseText, setResponseText] = useState("");
    const [loading, setLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Filter contacts based on status and search
    const filteredContacts = contacts.filter((contact) => {
        const matchesFilter =
            filter === "all" || contact.status === filter;
        const matchesSearch =
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            setLoading(true);
            const token = await getToken();
            const { data } = await axios.patch(
                `${backendUrl}/api/admin/contacts/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success("Status updated successfully");
                onUpdate();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    const handleSendResponse = async (id) => {
        if (!responseText.trim()) {
            toast.error("Please enter a response");
            return;
        }

        try {
            setLoading(true);
            const token = await getToken();
            const { data } = await axios.post(
                `${backendUrl}/api/admin/contacts/${id}/respond`,
                { response: responseText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success("Response sent successfully");
                setResponseText("");
                setSelectedContact(null);
                onUpdate();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send response");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white">Help Desk 🎧</h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:border-orange-500"
                    />

                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-black/30 border border-white/20 rounded-xl text-white outline-none focus:border-orange-500"
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {/* Contact Messages */}
            {filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No messages found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredContacts.map((contact) => (
                        <motion.div
                            key={contact._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-black/20 border border-white/10 rounded-xl p-4 hover:bg-black/30 transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-white font-semibold text-lg">
                                            {contact.name}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${contact.status === "pending"
                                                ? "bg-orange-500/20 text-orange-400"
                                                : "bg-green-500/20 text-green-400"
                                                }`}
                                        >
                                            {contact.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-2">{contact.email}</p>
                                    <p className="text-gray-300 text-sm line-clamp-2">
                                        {contact.message}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-2">
                                        {new Date(contact.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => setSelectedContact(contact)}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:scale-105 transition-transform text-sm font-medium"
                                    >
                                        View & Reply
                                    </button>
                                    {contact.status === "pending" && (
                                        <button
                                            onClick={() => handleStatusUpdate(contact._id, "resolved")}
                                            disabled={loading}
                                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:scale-105 transition-transform text-sm font-medium disabled:opacity-50"
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Message Detail Modal */}
            <AnimatePresence>
                {selectedContact && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedContact(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {selectedContact.name}
                                    </h2>
                                    <p className="text-gray-400">{selectedContact.email}</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {new Date(selectedContact.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="bg-black/30 rounded-xl p-4 mb-4">
                                <h3 className="text-white font-semibold mb-2">Customer Message:</h3>
                                <p className="text-gray-300">{selectedContact.message}</p>
                            </div>

                            {selectedContact.adminResponse && (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                                    <h3 className="text-green-400 font-semibold mb-2">
                                        Your Previous Response:
                                    </h3>
                                    <p className="text-gray-300">{selectedContact.adminResponse}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <h3 className="text-white font-semibold">Send Response:</h3>
                                <textarea
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    placeholder="Type your response here..."
                                    rows="4"
                                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:border-orange-500"
                                />
                                <button
                                    onClick={() => handleSendResponse(selectedContact._id)}
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : "Send Response via Email"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
