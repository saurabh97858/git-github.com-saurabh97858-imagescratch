import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function FeatureManager() {
    const [features, setFeatures] = useState([
        { id: 1, name: "AI Image Generation", enabled: true },
        { id: 2, name: "Background Removal", enabled: true },
        { id: 3, name: "Image Enhancement", enabled: false },
        { id: 4, name: "Batch Processing", enabled: false },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newFeatureName, setNewFeatureName] = useState("");

    const toggleFeature = (id) => {
        setFeatures((prev) =>
            prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
        );
        toast.success("Feature status updated");
    };

    const addFeature = () => {
        if (!newFeatureName.trim()) {
            toast.error("Please enter a feature name");
            return;
        }

        const newFeature = {
            id: Date.now(),
            name: newFeatureName,
            enabled: false,
        };

        setFeatures([...features, newFeature]);
        setNewFeatureName("");
        setShowAddModal(false);
        toast.success("Feature added successfully");
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Feature Manager ⚙️</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform font-medium"
                >
                    + Add Feature
                </button>
            </div>

            <div className="space-y-3">
                {features.map((feature) => (
                    <motion.div
                        key={feature.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between bg-black/20 border border-white/10 rounded-xl p-4 hover:bg-black/30 transition-all"
                    >
                        <span className="text-white font-medium">{feature.name}</span>
                        <button
                            onClick={() => toggleFeature(feature.id)}
                            className={`relative w-14 h-7 rounded-full transition-colors ${feature.enabled ? "bg-green-500" : "bg-gray-600"
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${feature.enabled ? "translate-x-7" : ""
                                    }`}
                            />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Add Feature Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowAddModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Add New Feature</h3>
                        <input
                            type="text"
                            value={newFeatureName}
                            onChange={(e) => setNewFeatureName(e.target.value)}
                            placeholder="Feature name..."
                            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:border-purple-500 mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={addFeature}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
                            >
                                Add Feature
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
