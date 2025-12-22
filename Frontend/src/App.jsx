import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import BuyCredit from "./pages/BuyCredit";
import Result from "./pages/Result";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import DebugUser from "./pages/DebugUser";
import History from "./pages/History";
import Purchase from "./pages/Purchase";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import AppContextProvider from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppContextProvider>
          <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50 dark:from-slate-900 dark:to-slate-950 text-gray-900 dark:text-gray-100 transition-colors">
            <ToastContainer position="bottom-right" />
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} />

              <Route
                path="/buy"
                element={
                  <ProtectedRoute>
                    <BuyCredit />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/purchase/:planId"
                element={
                  <ProtectedRoute>
                    <Purchase />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/result"
                element={
                  <ProtectedRoute>
                    <Result />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  </ProtectedRoute>
                }
              />

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Debug route - remove after testing */}
              <Route
                path="/debug"
                element={
                  <ProtectedRoute>
                    <DebugUser />
                  </ProtectedRoute>
                }
              />
            </Routes>

            <Footer />
          </div>
        </AppContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

