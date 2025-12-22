import { motion, AnimatePresence } from "framer-motion";

export default function AnalyticsModal({ isOpen, onClose, stats }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Analytics Overview 📊</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-black/30 p-6 rounded-xl border border-white/10">
                            <h3 className="text-gray-400 mb-2">Total Revenue</h3>
                            <p className="text-3xl font-bold text-green-400">$1,240.00</p>
                            <p className="text-xs text-green-500 mt-1">↑ 12% from last month</p>
                        </div>
                        <div className="bg-black/30 p-6 rounded-xl border border-white/10">
                            <h3 className="text-gray-400 mb-2">Active Users</h3>
                            <p className="text-3xl font-bold text-blue-400">842</p>
                            <p className="text-xs text-blue-500 mt-1">↑ 5% from last week</p>
                        </div>
                    </div>

                    <div className="bg-black/30 p-6 rounded-xl border border-white/10 mb-6">
                        <h3 className="text-white font-semibold mb-4">Traffic Sources</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300">Direct</span>
                                    <span className="text-gray-400">45%</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 w-[45%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300">Social Media</span>
                                    <span className="text-gray-400">30%</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[30%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300">Referral</span>
                                    <span className="text-gray-400">25%</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[25%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-gray-500 text-sm">
                        * Data is simulated for demonstration purposes.
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
