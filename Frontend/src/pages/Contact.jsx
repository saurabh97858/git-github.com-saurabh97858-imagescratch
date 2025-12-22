import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import ChatWidget from "../components/ChatWidget";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Thanks for reaching out! We'll get back soon 🚀");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (err) {
      toast.error("Something went wrong...");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="py-28 px-6 min-h-screen bg-gradient-to-b from-gray-950 to-black"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-extrabold text-white tracking-tight">
          Need <span className="text-orange-500">Help?</span> 🙋‍♂️
        </h2>
        <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
          If you’re stuck somewhere or have questions — we’re here to assist!
          Just fill this form and our support team will get in touch quickly.
        </p>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Left Column: Contact Form */}
        <motion.div
          className="p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(249,115,22,0.18)]"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-white text-2xl font-bold mb-6 text-center">
            Send us a Message ✉️
          </h3>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Your Name"
              className="bg-black/30 text-white border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              placeholder="Your Email"
              className="bg-black/30 text-white border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <motion.textarea
              rows="4"
              placeholder="Describe your issue or question..."
              whileFocus={{ scale: 1.02 }}
              className="bg-black/30 text-white border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold py-3.5 rounded-xl shadow-lg hover:from-orange-600 hover:to-yellow-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>

        {/* Right Column: AI Chat Widget */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <ChatWidget />
        </motion.div>

      </div>

      {/* Social Media Support */}
      <motion.div
        className="text-center mt-14 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-gray-300 text-sm sm:text-base font-medium tracking-wide">
          Prefer a faster reply? Chat with us on Instagram 👇
        </p>

        <motion.a
          href="https://www.instagram.com/theaayanshgupta?igsh=MWJmM205OHkzY2Rvag=="
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.3 }}
          className="cursor-pointer"
        >
          <img
            src={assets.instagram_icon}
            alt="Instagram"
            className="w-12 invert"
          />
        </motion.a>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="text-center text-gray-500 mt-10 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Imagify | We turn imagination into reality ✨
      </motion.div>
    </motion.div>
  );
}
