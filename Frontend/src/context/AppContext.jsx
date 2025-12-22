import React, { createContext, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const { getToken } = useAuth();
  const { user } = useUser();

  const [credit, setCredit] = useState(10);
  const [showLogin, setShowLogin] = useState(false);

  const loadCreditsData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${backendUrl}/api/user/credits`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setCredit(data.credits);
      }
    } catch (error) {
      console.error("Failed to load credits:", error);
      toast.error(error.message);
    }
  };

  const generateImage = async ({ prompt, images }) => {
    try {
      const token = await getToken();
      if (!token) return toast.error("Login Required!");

      console.log("📡 AppContext sending to backend:", {
        hasPrompt: !!prompt,
        hasImages: images && images.length > 0,
        imageCount: images ? images.length : 0
      });

      const res = await fetch(`${backendUrl}/api/image/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, images }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return null;
      }

      setCredit(data.creditBalance);
      return data.resultImage;
    } catch (err) {
      toast.error("Server Error!");
    }
  };

  React.useEffect(() => {
    if (user) {
      loadCreditsData();
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{ user, credit, showLogin, setShowLogin, generateImage, loadCreditsData }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
