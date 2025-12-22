import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = ({ progress = 0, message = "Generating your masterpiece..." }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
                {/* Animated Icon */}
                <div className="flex justify-center mb-6">
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1, repeat: Infinity },
                        }}
                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                    >
                        <span className="text-2xl">✨</span>
                    </motion.div>
                </div>

                {/* Message */}
                <p className="text-center text-gray-700 dark:text-gray-200 font-medium mb-4">
                    {message}
                </p>

                {/* Progress Bar */}
                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="absolute h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    />
                </div>

                {/* Percentage */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {Math.round(progress)}%
                </p>

                {/* Shimmer Effect */}
                <div className="mt-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                            style={{ width: `${100 - i * 15}%` }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default LoadingAnimation;
