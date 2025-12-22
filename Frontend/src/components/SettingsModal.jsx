import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function SettingsModal({ isOpen, onClose }) {
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        emailNotifications: true,
        autoApproveComments: false,
        darkModeDefault: true
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        toast.success("Setting updated");
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-lg w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Settings ⚙️</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                            <div>
                                <h3 className="text-white font-medium">Maintenance Mode</h3>
                                <p className="text-gray-500 text-sm">Disable access for regular users</p>
                            </div>
                            <button
                                onClick={() => toggleSetting('maintenanceMode')}
                                className={`w-12 h-6 rounded-full relative transition-colors ${settings.maintenanceMode ? 'bg-orange-500' : 'bg-gray-700'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                            <div>
                                <h3 className="text-white font-medium">Email Notifications</h3>
                                <p className="text-gray-500 text-sm">Receive alerts for new messages</p>
                            </div>
                            <button
                                onClick={() => toggleSetting('emailNotifications')}
                                className={`w-12 h-6 rounded-full relative transition-colors ${settings.emailNotifications ? 'bg-green-500' : 'bg-gray-700'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.emailNotifications ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                            <div>
                                <h3 className="text-white font-medium">Auto-Approve Comments</h3>
                                <p className="text-gray-500 text-sm">Skip moderation for comments</p>
                            </div>
                            <button
                                onClick={() => toggleSetting('autoApproveComments')}
                                className={`w-12 h-6 rounded-full relative transition-colors ${settings.autoApproveComments ? 'bg-green-500' : 'bg-gray-700'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.autoApproveComments ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <button className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-colors">
                            Clear System Cache
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
