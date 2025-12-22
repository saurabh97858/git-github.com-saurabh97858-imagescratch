import React, { useState, useContext, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { FiImage, FiX, FiRefreshCw, FiDownload, FiMaximize2, FiUploadCloud, FiMic, FiZap, FiScissors, FiBox, FiLayers, FiZoomIn, FiEye } from "react-icons/fi";
import LoadingAnimation from "../components/LoadingAnimation";
import Lightbox from "../components/Lightbox";
import StyleSelector from "../components/StyleSelector";
import axios from "axios";

const Result = () => {
  const { isSignedIn } = useUser();
  const { generateImage, backendUrl } = useContext(AppContext);

  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [input, setInput] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const [upscaling, setUpscaling] = useState(false);
  const [varying, setVarying] = useState(false);
  const [describing, setDescribing] = useState(false);

  const fileInputRef = useRef(null);

  // Simulate progress during loading
  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingProgress(0);
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
    } else {
      setLoadingProgress(100);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const processFiles = (files) => {
    const totalCount = uploadedImages.length + files.length;

    if (totalCount > 4) {
      toast.error(`Maximum 4 images allowed! You have ${uploadedImages.length} selected.`);
      return;
    }

    const promises = files.map((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return null;
      }
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises.filter(p => p !== null)).then((newImages) => {
      setUploadedImages(prev => [...prev, ...newImages]);
      toast.success(`${newImages.length} image(s) added successfully!`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      processFiles(files);
    } else {
      toast.error("Please drop image files only");
    }
  };

  const handleReset = () => {
    setUploadedImages([]);
    setInput("");
    setIsImageLoaded(false);
    setImage(assets.sample_img_1);
    toast.success("Reset complete!");
  };

  // Voice Input Handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      return toast.error("Voice input not supported in this browser");
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("Listening... Speak now!");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? " " : "") + transcript);
    };

    recognition.start();
  };

  // Magic Prompt Enhancer
  const handleEnhancePrompt = async () => {
    if (!input.trim()) return toast.error("Please enter a prompt first!");
    if (!isSignedIn) return toast.error("Please login first!");

    setEnhancing(true);
    try {
      const token = await window.Clerk.session.getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/image/enhance-prompt`,
        { prompt: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setInput(data.enhancedPrompt);
        toast.success("✨ Prompt enhanced with AI magic!");
      } else {
        toast.error(data.message || "Failed to enhance prompt");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to AI service");
    }
    setEnhancing(false);
  };

  // Surprise Me Handler
  const handleSurpriseMe = () => {
    const prompts = [
      "A futuristic city on Mars with neon lights, 8k resolution",
      "A cute robot gardening in a greenhouse, studio ghibli style",
      "An astronaut riding a horse on the moon, cinematic lighting",
      "A magical library floating in the clouds, fantasy art",
      "A cyberpunk street food vendor in Tokyo, rain, night time",
      "A portrait of a wise old owl wearing reading glasses, oil painting",
      "A underwater castle made of coral and pearls, vibrant colors"
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setInput(randomPrompt);
  };

  // Remove Background Handler
  const handleRemoveBackground = async () => {
    if (!isImageLoaded) return;
    if (!isSignedIn) return toast.error("Please login first!");

    setRemovingBg(true);
    const toastId = toast.loading("Removing background...");

    try {
      const token = await window.Clerk.session.getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/image/remove-background`,
        { image: image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setImage(data.resultImage);
        toast.success("Background removed successfully!", { id: toastId });
      } else {
        toast.error(data.message || "Failed to remove background", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove background", { id: toastId });
    }
    setRemovingBg(false);
  };

  // Upscale Handler
  const handleUpscale = async () => {
    if (!isImageLoaded) return;
    if (!isSignedIn) return toast.error("Please login first!");

    setUpscaling(true);
    const toastId = toast.loading("Upscaling image (4x)...");

    try {
      const token = await window.Clerk.session.getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/image/upscale`,
        { image: image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setImage(data.resultImage);
        toast.success("Image upscaled successfully!", { id: toastId });
      } else {
        toast.error(data.message || "Failed to upscale image", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upscale image", { id: toastId });
    }
    setUpscaling(false);
  };

  // Variations Handler
  const handleVariations = async () => {
    if (!isImageLoaded) return;
    if (!isSignedIn) return toast.error("Please login first!");

    setVarying(true);
    const toastId = toast.loading("Generating variations...");

    try {
      const token = await window.Clerk.session.getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/image/variations`,
        { image: image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setImage(data.resultImage);
        toast.success("Variation generated!", { id: toastId });
      } else {
        toast.error(data.message || "Failed to generate variations", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate variations", { id: toastId });
    }
    setVarying(false);
  };

  // Image to Prompt Handler
  const handleImageToPrompt = async () => {
    if (uploadedImages.length === 0) return toast.error("Please upload an image first!");
    if (!isSignedIn) return toast.error("Please login first!");

    setDescribing(true);
    const toastId = toast.loading("Analyzing image...");

    try {
      const token = await window.Clerk.session.getToken();
      // Use the first uploaded image
      const imageToAnalyze = uploadedImages[0];

      const { data } = await axios.post(
        `${backendUrl}/api/image/image-to-prompt`,
        { image: imageToAnalyze },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setInput(data.prompt);
        toast.success("Prompt generated!", { id: toastId });
      } else {
        toast.error(data.message || "Failed to analyze image", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze image", { id: toastId });
    }
    setDescribing(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!isSignedIn) return toast.error("Please login first!");
    if (!input.trim()) return toast.error("Please enter a prompt!");

    setLoading(true);

    const result = await generateImage({
      prompt: input,
      images: uploadedImages
    });

    if (result) {
      setImage(result);
      setIsImageLoaded(true);
      setUploadedImages([]);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col min-h-[90vh] justify-center items-center px-4 py-8"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-500/20 backdrop-blur-sm z-40 flex items-center justify-center border-4 border-blue-500 border-dashed m-4 rounded-3xl pointer-events-none"
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-bounce">
              <FiUploadCloud size={64} className="text-blue-500 mb-4" />
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">Drop images here</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Animation */}
      <AnimatePresence>
        {loading && (
          <LoadingAnimation
            progress={loadingProgress}
            message={uploadedImages.length > 0 ? "Creating your collage..." : "Generating your masterpiece..."}
          />
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        image={image}
        prompt={input}
      />

      {/* Generated Image Display */}
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 group cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        onClick={() => isImageLoaded && setLightboxOpen(true)}
      >
        <img
          src={image}
          alt="Generated Result"
          className="max-w-2xl w-full rounded-2xl aspect-video object-cover"
        />

        {/* Hover Overlay for Lightbox */}
        {isImageLoaded && (
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
              <FiMaximize2 size={24} />
            </div>
          </div>
        )}
      </motion.div>

      {/* Image Preview Grid */}
      {uploadedImages.length > 0 && !isImageLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex gap-3 flex-wrap justify-center max-w-xl"
        >
          {uploadedImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative group"
            >
              <img
                src={img}
                alt={`Selected ${i + 1}`}
                className="w-24 h-24 object-cover rounded-xl border-2 border-blue-400 shadow-md"
              />
              <button
                type="button"
                onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <FiX size={14} />
              </button>
            </motion.div>
          ))}

          {/* Describe Image Button */}
          <motion.button
            type="button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleImageToPrompt}
            disabled={describing}
            className={`w-24 h-24 rounded-xl border-2 border-dashed border-purple-400 flex flex-col items-center justify-center gap-2 text-purple-500 hover:bg-purple-50 transition-colors ${describing ? 'animate-pulse' : ''}`}
            title="Describe Image with AI"
          >
            {describing ? <FiRefreshCw className="animate-spin" size={20} /> : <FiEye size={20} />}
            <span className="text-xs font-medium">Describe</span>
          </motion.button>
        </motion.div>
      )}

      {/* Input Form */}
      {!isImageLoaded && (
        <motion.form
          onSubmit={onSubmitHandler}
          className="w-full max-w-2xl relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Style Selector */}
          <StyleSelector onSelect={(style) => setInput(prev => prev + style)} />

          <div className={`flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 p-2 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Gallery Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Select images (max 4)"
            >
              <FiImage className="text-gray-600 dark:text-gray-300" size={20} />
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Reset all"
            >
              <FiRefreshCw className="text-gray-600 dark:text-gray-300" size={20} />
            </button>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
              title="Voice Input"
            >
              <FiMic size={20} />
            </button>

            {/* Surprise Me Button */}
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-pink-500"
              title="Surprise Me!"
            >
              <FiBox size={20} />
            </button>

            {/* Magic Prompt Button */}
            <button
              type="button"
              onClick={handleEnhancePrompt}
              disabled={enhancing}
              className={`p-3 rounded-full transition-colors ${enhancing ? 'bg-purple-100 text-purple-500 animate-spin' : 'hover:bg-purple-50 dark:hover:bg-gray-700 text-purple-500'}`}
              title="Enhance Prompt with AI"
            >
              <FiZap size={20} />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                uploadedImages.length > 0
                  ? `${uploadedImages.length} image(s) selected - Describe what to create...`
                  : "Describe what you want to create..."
              }
              className="flex-1 bg-transparent outline-none px-4 text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Generate
            </button>
          </div>

          {/* Image Counter */}
          {uploadedImages.length > 0 && (
            <p className="text-xs text-center text-gray-500 mt-2">
              {uploadedImages.length}/4 images selected
            </p>
          )}

          {/* Drag Hint */}
          {uploadedImages.length === 0 && (
            <p className="text-xs text-center text-gray-400 mt-2 opacity-50">
              Tip: You can drag & drop images anywhere on the screen
            </p>
          )}
        </motion.form>
      )}

      {/* Action Buttons After Generation */}
      {isImageLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 flex-wrap justify-center mt-6"
        >
          <button
            onClick={() => {
              setIsImageLoaded(false);
              setInput("");
              setUploadedImages([]);
            }}
            className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
          >
            Generate Another
          </button>

          <button
            onClick={handleRemoveBackground}
            disabled={removingBg}
            className={`flex items-center gap-2 px-8 py-3 border-2 border-pink-500 text-pink-500 rounded-full hover:bg-pink-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium ${removingBg ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {removingBg ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <FiScissors size={18} />
            )}
            Remove BG
          </button>

          <button
            onClick={handleUpscale}
            disabled={upscaling}
            className={`flex items-center gap-2 px-8 py-3 border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium ${upscaling ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {upscaling ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <FiZoomIn size={18} />
            )}
            Upscale 4x
          </button>

          <button
            onClick={handleVariations}
            disabled={varying}
            className={`flex items-center gap-2 px-8 py-3 border-2 border-purple-500 text-purple-500 rounded-full hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium ${varying ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {varying ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <FiLayers size={18} />
            )}
            Variations
          </button>

          <a
            href={image}
            download="imagify-creation.png"
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md"
          >
            <FiDownload size={18} />
            Download
          </a>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Result;
