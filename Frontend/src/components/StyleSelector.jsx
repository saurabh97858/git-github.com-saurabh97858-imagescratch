import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiCpu, FiBox, FiDroplet, FiGrid, FiWind } from 'react-icons/fi';

const styles = [
    {
        id: 'anime',
        name: 'Anime',
        icon: <FiWind size={24} />,
        prompt: ', anime style, vibrant colors, studio ghibli inspired',
        color: 'hover:text-pink-500 hover:border-pink-500'
    },
    {
        id: 'realistic',
        name: 'Realistic',
        icon: <FiCamera size={24} />,
        prompt: ', photorealistic, 8k resolution, cinematic lighting, highly detailed',
        color: 'hover:text-blue-500 hover:border-blue-500'
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        icon: <FiCpu size={24} />,
        prompt: ', cyberpunk, neon lights, futuristic, high tech, night city',
        color: 'hover:text-purple-500 hover:border-purple-500'
    },
    {
        id: '3d',
        name: '3D Render',
        icon: <FiBox size={24} />,
        prompt: ', 3d render, unreal engine 5, octane render, isometric',
        color: 'hover:text-orange-500 hover:border-orange-500'
    },
    {
        id: 'oil',
        name: 'Oil Painting',
        icon: <FiDroplet size={24} />,
        prompt: ', oil painting, textured, vincent van gogh style, classic art',
        color: 'hover:text-yellow-500 hover:border-yellow-500'
    },
    {
        id: 'pixel',
        name: 'Pixel Art',
        icon: <FiGrid size={24} />,
        prompt: ', pixel art, 16-bit, retro game style',
        color: 'hover:text-green-500 hover:border-green-500'
    },
];

const StyleSelector = ({ onSelect }) => {
    const [activeId, setActiveId] = useState(null);

    const handleClick = (style) => {
        setActiveId(style.id);
        onSelect(style.prompt);
    };

    return (
        <div className="w-full max-w-2xl mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium px-1">Choose a Style</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {styles.map((style) => (
                    <motion.button
                        key={style.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleClick(style)}
                        className={`
                            flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200
                            ${activeId === style.id
                                ? 'bg-white dark:bg-gray-800 border-blue-500 shadow-md'
                                : 'bg-transparent border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800'
                            }
                            ${style.color}
                        `}
                    >
                        <div className={`mb-2 ${activeId === style.id ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}>
                            {style.icon}
                        </div>
                        <span className={`text-xs font-semibold ${activeId === style.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {style.name}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default StyleSelector;
