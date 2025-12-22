import React, { useContext, useRef, useState, useEffect } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { FiGift, FiX } from "react-icons/fi";

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

// --- Tilt Card Component ---
const TiltCard = ({ item, index, isSignedIn }) => {
  const ref = useRef(null);
  const navigate = useNavigate();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handlePurchaseClick = () => {
    if (isSignedIn) {
      navigate(`/purchase/${item.id}`);
    } else {
      toast.error("Please Login First!");
      navigate("/sign-in");
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-96 w-72 rounded-xl bg-gradient-to-br from-indigo-300 to-violet-300"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className={`absolute inset-4 grid place-content-center rounded-xl shadow-lg 
        ${index === 1
            ? "bg-gradient-to-br from-gray-900 to-black border border-orange-500/50"
            : "bg-gray-900 border border-white/10"
          }`}
      >
        {/* Holographic Overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {index === 1 && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform-gpu" style={{ transform: "translateZ(50px)" }}>
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-xs font-bold px-3 py-1 rounded-full text-white shadow-lg shadow-orange-500/40">
              MOST POPULAR 🔥
            </span>
          </div>
        )}

        <div className="text-center p-6" style={{ transform: "translateZ(50px)" }}>
          <img
            src={assets.logo_icon}
            width={40}
            className="mx-auto mb-4 opacity-80"
            alt=""
          />

          <h3 className="text-2xl font-bold text-white mb-1">{item.id}</h3>
          <p className="text-gray-400 text-xs mb-6">{item.desc}</p>

          <div className="mb-6">
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              ${item.price}
            </span>
            <span className="text-gray-500 text-sm ml-1">/ {item.credits} credits</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePurchaseClick}
            className={`w-full py-2.5 rounded-lg font-bold text-sm shadow-xl transition-all
            ${index === 1
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-orange-500/25"
                : "bg-white/10 text-white hover:bg-white/20"
              }`}
          >
            {isSignedIn ? "Purchase Now" : "Get Started"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Lucky Wheel Component ---
const LuckyWheel = ({ onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);

  const prizes = [
    { label: "10% OFF", color: "#F97316" }, // Orange
    { label: "20 Credits", color: "#EC4899" }, // Pink
    { label: "Try Again", color: "#64748B" }, // Gray
    { label: "Free Upscale", color: "#8B5CF6" }, // Purple
    { label: "50 Credits", color: "#10B981" }, // Green
    { label: "Jackpot!", color: "#EAB308" }, // Yellow
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const randomDeg = Math.floor(Math.random() * 360) + 360 * 5; // At least 5 spins
    setRotation(randomDeg);

    setTimeout(() => {
      setIsSpinning(false);
      // Calculate prize based on rotation
      // This is a simple approximation
      setPrize("10% OFF"); // For demo, always win 10% OFF
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border border-white/10 p-8 rounded-3xl max-w-md w-full relative shadow-2xl shadow-orange-500/20"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <FiX size={24} />
        </button>

        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-2">Spin & Win! 🎰</h3>
          <p className="text-gray-400">Try your luck to get exclusive rewards.</p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-8 text-white drop-shadow-lg">
            ▼
          </div>

          {/* Wheel */}
          <motion.div
            className="w-full h-full rounded-full border-4 border-white/20 overflow-hidden relative"
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: "circOut" }}
            style={{
              background: `conic-gradient(
                ${prizes[0].color} 0deg 60deg,
                ${prizes[1].color} 60deg 120deg,
                ${prizes[2].color} 120deg 180deg,
                ${prizes[3].color} 180deg 240deg,
                ${prizes[4].color} 240deg 300deg,
                ${prizes[5].color} 300deg 360deg
              )`
            }}
          >
            {/* Segments (Visual only for now) */}
          </motion.div>

          {/* Center Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning || prize}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center font-bold text-black border-4 border-gray-200 z-10 hover:scale-105 transition active:scale-95"
          >
            {isSpinning ? "..." : prize ? "Win!" : "SPIN"}
          </button>
        </div>

        {prize && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-xl text-white font-bold mb-4">
              🎉 You Won: <span className="text-orange-500">{prize}</span>
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition"
            >
              Claim Reward
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

const BuyCredit = () => {
  const { isSignedIn } = useUser();
  const [showWheel, setShowWheel] = useState(false);

  useEffect(() => {
    // Show wheel after 5 seconds
    const timer = setTimeout(() => {
      setShowWheel(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">

      <div className="pt-20 pb-12 px-4 relative">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6"
            >
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">Power</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              Unlock the full potential of AI generation with our premium credit packs.
              Hover over the cards to experience the magic. ✨
            </motion.p>
          </div>

          {/* Cards Grid */}
          <div className="flex flex-wrap justify-center gap-12 perspective-1000">
            {plans.map((item, index) => (
              <TiltCard
                key={index}
                item={item}
                index={index}
                isSignedIn={isSignedIn}
              />
            ))}
          </div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-24"
          >
            <p className="text-gray-500 text-sm uppercase tracking-widest font-medium">
              Trusted by 10,000+ Creators Worldwide
            </p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showWheel && <LuckyWheel onClose={() => setShowWheel(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default BuyCredit;
