import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiZoomIn, FiZoomOut } from 'react-icons/fi';

const Lightbox = ({ image, isOpen, onClose, prompt }) => {
    const [zoom, setZoom] = React.useState(1);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
                >
                    <FiX size={24} />
                </button>

                {/* Zoom Controls */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setZoom(Math.min(zoom + 0.5, 3));
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                    >
                        <FiZoomIn size={20} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setZoom(Math.max(zoom - 0.5, 0.5));
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                    >
                        <FiZoomOut size={20} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setZoom(1);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-full transition-colors text-sm"
                    >
                        Reset
                    </button>
                </div>

                {/* Download Button */}
                <a
                    href={image}
                    download="imagify.png"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:brightness-110 transition z-10"
                >
                    <FiDownload size={20} />
                    Download
                </a>

                {/* Image */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-6xl max-h-[90vh] overflow-auto"
                >
                    <img
                        src={image}
                        alt={prompt || "Generated"}
                        style={{ transform: `scale(${zoom})` }}
                        className="rounded-lg transition-transform duration-300"
                    />
                </motion.div>

                {/* Prompt */}
                {prompt && (
                    <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg max-w-md">
                        <p className="text-sm">{prompt}</p>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default Lightbox;
