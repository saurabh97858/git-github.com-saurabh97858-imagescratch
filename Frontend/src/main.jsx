import { ClerkProvider } from "@clerk/clerk-react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    appearance={{
      variables: {
        colorPrimary: "#f59e0b",
        colorText: "#e2e8f0",
        colorBackground: "#020617",
        colorInputBackground: "#0f172a",
        borderRadius: "18px",
      },

      layout: {
        logoPlacement: "inside",
        socialButtonsPlacement: "bottom",
      },

      elements: {
        // ⭐ MAIN ACCOUNT MODAL
        card:
          "bg-gray-900/70 text-white backdrop-blur-3xl shadow-[0_0_40px_rgba(249,115,22,0.25)] border border-gray-700/60 p-8 rounded-3xl animate-[fadeIn_0.4s_ease-out]",

        headerTitle: "text-white font-extrabold text-3xl tracking-tight",
        headerSubtitle: "text-gray-400 text-sm mb-4",

        // ❌ Close button styling
        closeButton: "hover:brightness-150 cursor-pointer",

        avatarImage:
          "rounded-full border-4 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] hover:scale-105 duration-200",

        formFieldLabel: "text-gray-300 text-[0.9rem] font-medium",

        formFieldInput:
          "bg-gray-800 text-white border-gray-700 rounded-xl px-4 py-3 shadow-inner focus:ring-2 focus:ring-orange-500 focus:border-orange-500 duration-300",

        formButtonPrimary:
          "bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold w-full rounded-xl py-3 shadow-xl hover:scale-[1.03] hover:shadow-2xl hover:brightness-110 transition-all",

        formButtonSecondary:
          "bg-gray-700 text-gray-200 hover:bg-gray-600 transition duration-200",

        // ⭐ LEFT SIDE NAVIGATION (Account / Security)
        navbar:
          "bg-transparent backdrop-blur-3xl border-r border-gray-800 text-gray-300",

        navbarItem:
          "hover:bg-gray-800/50 hover:text-white transition rounded-lg px-3 py-2",

        tabsList: "border-b border-gray-700 mb-3",

        tab:
          "px-3 py-1 text-gray-400 hover:text-white transition cursor-pointer data-[state=active]:text-orange-400 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 font-medium",

        footer: "text-gray-500 text-xs mt-4",

        // ⭐ DROPDOWN USER MENU (Manage account / Logout)
        userButtonPopoverCard:
          "bg-gray-900 text-white border border-gray-700/50 rounded-2xl shadow-xl backdrop-blur-2xl p-4 animate-[fadeIn_0.2s_ease-out]",

        userButtonPopoverActionButton:
          "text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-3 py-2 cursor-pointer transition-all",

        userButtonPopoverActionButton__manageAccount:
          "font-medium text-sm",

        userButtonPopoverActionButton__signOut:
          "font-medium text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all",

        userButtonAvatar:
          "rounded-full border-2 border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.7)]",

        scrollBox: "scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent",
      },
    }}
  >
    <App />
  </ClerkProvider>
);
