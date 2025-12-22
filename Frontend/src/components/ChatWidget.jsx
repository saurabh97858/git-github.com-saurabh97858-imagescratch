import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const ChatWidget = () => {
    const [messages, setMessages] = useState([
        { text: "Hi there! 👋 I'm your AI assistant. How can I help you create art today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        const currentHistory = [...messages, { text: userMessage, isBot: false }];
        setMessages(currentHistory);
        setInput("");
        setIsTyping(true);

        try {
            const token = await window.Clerk?.session?.getToken();
            if (!token) {
                setMessages(prev => [...prev, { text: "Please login to chat with me! 🔒", isBot: true }]);
                setIsTyping(false);
                return;
            }

            const { data } = await axios.post(
                `${backendUrl}/api/chat/ask`,
                {
                    message: userMessage,
                    history: messages // Pass previous history
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
            } else {
                setMessages(prev => [...prev, { text: "Oops! My brain is foggy. Try again later. 😵‍💫", isBot: true }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: "Connection error. Please check your internet. 🌐", isBot: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(249,115,22,0.18)] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                    <div>
                        <h3 className="font-bold text-lg tracking-wide">AI Support Assistant</h3>
                        <p className="text-xs text-gray-400">Always online • Ask me anything</p>
                    </div>
                </div>
                <FiMessageSquare size={24} className="text-orange-500 opacity-80" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                    >
                        <div
                            className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.isBot
                                ? "bg-white/10 text-gray-200 border border-white/5 rounded-tl-none"
                                : "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-tr-none shadow-lg"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1.5">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 border-t border-white/10 flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question here..."
                    className="flex-1 bg-black/30 text-white px-5 py-3.5 rounded-xl outline-none border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition placeholder-gray-500"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="bg-gradient-to-r from-orange-500 to-yellow-400 text-black p-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-orange-500/25"
                >
                    <FiSend size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatWidget;
