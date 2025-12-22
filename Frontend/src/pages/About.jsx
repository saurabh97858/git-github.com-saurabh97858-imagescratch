import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <div className="bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      {/* ===== HERO SECTION ===== */}
      <motion.section
        className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.9 }}
      >
        {/* Left Content */}
        <div className="flex-1">
          <p className="uppercase tracking-[0.25em] text-xs text-gray-400 mb-4">
            About Imagify
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Turn imagination into  
            <span className="block mt-2 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(249,115,22,0.45)]">
              stunning visuals ⚡
            </span>
          </h1>

          <p className="mt-5 text-gray-300 text-base sm:text-lg max-w-xl">
            Imagify is your AI creative studio. Generate artwork, concepts,
            banners, thumbnails and more — just by describing what you imagine.
            No design skills required. Only ideas.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center justify-center lg:justify-start">
            <button className="px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-400 text-sm sm:text-base font-semibold shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-transform hover:-translate-y-0.5">
              Try Imagify Free
            </button>
            <p className="text-xs sm:text-sm text-gray-400">
              No credit card required · Start in seconds
            </p>
          </div>
        </div>

        {/* Right Visual */}
        <motion.div
          className="flex-1 flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-gradient-to-br from-orange-500/70 via-purple-600/60 to-blue-500/50 shadow-[0_0_40px_rgba(249,115,22,0.45)] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#ffffff33,_transparent_60%)]" />
            <img
              src={assets.sample_img_1}
              alt="Imagify sample"
              className="relative rounded-2xl w-44 sm:w-56 border border-white/20 shadow-xl"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 text-xs text-gray-100">
              “Describe it. We’ll create it.”
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ===== STATS SECTION ===== */}
      <motion.section
        className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-2 md:grid-cols-4 gap-5"
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.15 }}
      >
        {[
          { value: "10K+", label: "Active creators" },
          { value: "80K+", label: "Images generated" },
          { value: "120+", label: "Countries reached" },
          { value: "4.9★", label: "User satisfaction" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            variants={fadeUp}
            className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl py-5 px-4 text-center shadow-[0_0_25px_rgba(0,0,0,0.4)]"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-400">
              {item.value}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-300">
              {item.label}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* ===== WHY IMAGIFY SECTION ===== */}
      <motion.section
        className="max-w-6xl mx-auto px-6 pb-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Why creators love <span className="text-orange-400">Imagify</span>
        </h2>
        <p className="text-center text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-10">
          Carefully designed for designers, students, marketers and founders who
          want speed, quality and full control over their visuals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Lightning-fast AI",
              desc: "Generate multiple HD images in seconds so your ideas never lose momentum.",
            },
            {
              title: "Creative control",
              desc: "Tweak prompts, rerun generations and explore endless variations until it's perfect.",
            },
            {
              title: "Ready-to-use exports",
              desc: "Download instantly and use images for social posts, thumbnails, banners and more.",
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 shadow-[0_0_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(249,115,22,0.55)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500/20 rounded-full blur-3xl" />
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== STORY + HQ SECTION ===== */}
      <motion.section
        className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8 }}
      >
        {/* Story */}
        <motion.div variants={fadeUp}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Our story & mission
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3">
            Imagify was born from a simple idea — <span className="text-orange-300">everyone</span> should
            have the power to create beautiful visuals, even without design
            skills or heavy software.
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3">
            From students working on projects to brands building campaigns, we
            want to make visual storytelling effortless, fast and fun.
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Our mission is to make AI-assisted creativity accessible to millions,
            starting from India and reaching the world.
          </p>
        </motion.div>

        {/* HQ Card */}
        <motion.div
          variants={fadeUp}
          className="relative bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.7)] flex gap-4 items-center"
        >
          <div className="bg-orange-500/90 rounded-2xl p-4 shadow-[0_0_30px_rgba(249,115,22,0.8)] flex items-center justify-center">
            <img
              src={assets.star_icon}
              alt="Imagify office"
              className="w-10 h-10"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold mb-1">Imagify Headquarters</h3>
            <p className="text-sm text-gray-200">
              Kanpur Nagar, Uttar Pradesh <br />
              India — 208021
            </p>
            <p className="text-xs text-orange-300 mt-2">
              Built in India 🇮🇳 · Created for the world 🌍
            </p>
          </div>

          <div className="absolute -bottom-8 -right-6 w-24 h-24 bg-orange-500/15 rounded-full blur-3xl" />
        </motion.div>
      </motion.section>

      {/* ===== GLOBAL STRIP ===== */}
      <section className="border-t border-white/10 bg-black/60">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-300">
            Imagify is crafted for creators, developers, founders, students and
            teams who want to move faster.
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            “Your imagination. Our intelligence.” ✨
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
