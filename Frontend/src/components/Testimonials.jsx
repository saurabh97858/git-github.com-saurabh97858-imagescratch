import React from 'react'
import { assets, testimonialsData } from '../assets/assets'
import { motion } from 'framer-motion'

const Testimonials = () => {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      
      className="flex flex-col items-center justify-center 
      my-24 py-16 px-6 text-center"
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
        Customer <span className="text-orange-500">Testimonials</span>
      </h1>

      <p className="text-gray-600 dark:text-gray-300 mt-3 mb-14 text-lg">
        Hear what our happy users say about Imagify ✨
      </p>

      <div className="flex flex-wrap justify-center gap-10 w-full max-w-6xl">
        {testimonialsData.map((test, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -6 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white/20 dark:bg-gray-900/30 
            backdrop-blur-xl border border-gray-300/40 dark:border-gray-700/40 
            rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl 
            transition-all flex flex-col items-center"
          >
            {/* Avatar */}
            <img
              src={test.image}
              alt={test.name}
              className="rounded-full w-20 h-20 object-cover border-2 
              border-orange-500 shadow-md"
            />

            {/* Name & Role */}
            <h2 className="text-xl font-semibold mt-3 text-gray-900 dark:text-white">
              {test.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {test.role}
            </p>

            {/* Stars */}
            <div className="flex mb-3">
              {Array(test.stars)
                .fill()
                .map((_, i) => (
                  <img key={i} src={assets.rating_star} alt="rating" className="w-5" />
                ))}
            </div>

            {/* Text */}
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              “{test.text}”
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default Testimonials
