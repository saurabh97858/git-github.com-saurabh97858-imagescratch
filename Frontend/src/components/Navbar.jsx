import React, { useState, useContext, useEffect } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { ThemeContext } from "../context/ThemeContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const Navbar = () => {
  const { credit } = useContext(AppContext);
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Debug: Log user metadata
  useEffect(() => {
    if (user) {
      console.log("👤 User Info:", {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        publicMetadata: user.publicMetadata,
        unsafeMetadata: user.unsafeMetadata,
      });
    }
  }, [user]);

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="flex justify-between items-center py-5">

      {/* LOGO */}
      <Link to="/" onClick={closeMenu}>
        <img
          src={assets.logo}
          alt="logo"
          className="w-28 sm:w-36 lg:w-40 dark:invert"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 text-gray-800 dark:text-gray-100 font-medium">

        <Link to="/" className="hover:text-yellow-500 transition">Home</Link>
        <Link to="/about" className="hover:text-yellow-500 transition">About</Link>
        <Link to="/contact" className="hover:text-yellow-500 transition">Contact</Link>
        {isSignedIn && (
          <Link to="/history" className="hover:text-yellow-500 transition">History</Link>
        )}

        {/* Dashboard link - only for admins */}
        {isSignedIn && isAdmin && (
          <Link
            to="/dashboard"
            className="hover:text-yellow-500 transition font-bold text-orange-500"
          >
            🎛️ Dashboard
          </Link>
        )}

        {isSignedIn ? (
          <>
            {/* Credits Button */}
            <button
              onClick={() => navigate("/buy")}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-4 py-2 rounded-full shadow-md hover:scale-105 transition active:scale-95"
            >
              Credits: {credit}
            </button>

            {/* Username */}
            <p className="text-sm whitespace-nowrap">
              Hi, {user.firstName || "User"}
              {isAdmin && <span className="ml-2 text-xs text-orange-500">(Admin)</span>}
            </p>

            {/* Clerk Profile Button */}
            <UserButton appearance={{ baseTheme: darkMode ? "dark" : "light" }} />
          </>
        ) : (
          <SignInButton mode="modal">
            <button className="bg-black dark:bg-white dark:text-black text-white px-6 py-2 rounded-full hover:opacity-90 transition">
              Login
            </button>
          </SignInButton>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-2xl hover:text-yellow-500 transition"
        >
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>

      </div>

      {/* Mobile Menu Icon */}
      <button
        className="text-3xl md:hidden text-gray-900 dark:text-gray-100"
        onClick={toggleMenu}
      >
        {menuOpen ? <IoClose /> : <GiHamburgerMenu />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-20 right-4 bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-6 flex flex-col gap-4 text-gray-800 dark:text-gray-100 z-20">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>

          {/* Dashboard link - only for admins */}
          {isSignedIn && isAdmin && (
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className="font-bold text-orange-500"
            >
              🎛️ Dashboard
            </Link>
          )}

          {isSignedIn ? (
            <>
              <button
                onClick={() => {
                  navigate("/buy");
                  closeMenu();
                }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-3 py-2 rounded-full shadow-md hover:scale-105 transition"
              >
                Credits: {credit}
              </button>

              <UserButton appearance={{ baseTheme: darkMode ? "dark" : "light" }} />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-black dark:bg-white dark:text-black text-white px-6 py-2 rounded-full">
                Login
              </button>
            </SignInButton>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 mt-2"
          >
            {darkMode ? <MdLightMode /> : <MdDarkMode />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
