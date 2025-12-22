import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const CommunityFeed = () => {
    // Duplicate images to create seamless loop
    const images = [
        assets.sample_img_1,
        assets.sample_img_2,
        assets.sample_img_1,
        assets.sample_img_2,
        assets.sample_img_1,
        assets.sample_img_2,
        assets.sample_img_1,
        assets.sample_img_2,
    ];

    return (
        <div className="py-20 bg-white dark:bg-slate-900 overflow-hidden relative">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                    Community Creations
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    See what others are creating right now
                </p>
            </div>

            {/* Row 1 - Left to Right */}
            <div className="flex mb-4 relative">
                <motion.div
                    className="flex gap-4 min-w-full"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 20,
                            ease: "linear",
                        },
                    }}
                >
                    {[...images, ...images, ...images].map((img, index) => (
                        <div
                            key={index}
                            className="relative w-64 h-64 flex-shrink-0 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                        >
                            <img
                                src={img}
                                alt={`Community ${index}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Row 2 - Right to Left */}
            <div className="flex relative">
                <motion.div
                    className="flex gap-4 min-w-full"
                    animate={{ x: [-1000, 0] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 25,
                            ease: "linear",
                        },
                    }}
                >
                    {[...images, ...images, ...images].map((img, index) => (
                        <div
                            key={index}
                            className="relative w-64 h-64 flex-shrink-0 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                        >
                            <img
                                src={img}
                                alt={`Community ${index}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Gradient Overlays for Fade Effect */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10" />
        </div>
    );
};

export default CommunityFeed;
