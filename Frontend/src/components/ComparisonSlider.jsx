import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { FiMove } from "react-icons/fi";

const ComparisonSlider = () => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMove = (event) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;

        let position = ((clientX - containerRect.left) / containerRect.width) * 100;
        position = Math.max(0, Math.min(100, position));

        setSliderPosition(position);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchend", handleMouseUp);
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("touchmove", handleMove);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchend", handleMouseUp);
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("touchmove", handleMove);
        };
    }, [isDragging]);

    return (
        <div className="py-20 px-4 bg-gray-50 dark:bg-slate-950">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        AI Magic in Action
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Drag the slider to see the difference
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-10 justify-center items-center">

                    {/* Upscale Demo */}
                    <div className="w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-4 text-center text-blue-500">4x Upscaling</h3>
                        <div
                            ref={containerRef}
                            className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl cursor-col-resize select-none border-4 border-white dark:border-gray-800"
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleMouseDown}
                        >
                            {/* After Image (High Res) */}
                            <img
                                src={assets.sample_img_1}
                                alt="High Res"
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Before Image (Low Res - Simulated with blur) */}
                            <div
                                className="absolute inset-0 w-full h-full overflow-hidden"
                                style={{ width: `${sliderPosition}%` }}
                            >
                                <img
                                    src={assets.sample_img_1}
                                    alt="Low Res"
                                    className="absolute inset-0 w-full h-full object-cover filter blur-sm brightness-90"
                                    style={{ width: '100vw', maxWidth: 'none' }} // Trick to keep image static while container clips
                                />
                                <div className="absolute inset-0 bg-white/10" /> {/* Overlay to differentiate */}
                            </div>

                            {/* Slider Handle */}
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                style={{ left: `${sliderPosition}%` }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-800">
                                    <FiMove />
                                </div>
                            </div>

                            {/* Labels */}
                            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md pointer-events-none">
                                Original
                            </div>
                            <div className="absolute top-4 right-4 bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md pointer-events-none">
                                Upscaled
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ComparisonSlider;
