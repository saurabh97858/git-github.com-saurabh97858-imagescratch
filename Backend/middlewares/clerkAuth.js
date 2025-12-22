import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

const clerkAuth = ClerkExpressWithAuth({
  onError: (err, req, res) => {
    console.error("Clerk Auth Error:", err);
    res.status(401).json({ success: false, message: "Not Authorized" });
  },
});

export default clerkAuth;
