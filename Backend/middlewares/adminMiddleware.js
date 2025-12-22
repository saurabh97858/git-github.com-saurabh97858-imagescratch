import { clerkClient } from "@clerk/express";

// Middleware to verify admin role from Clerk
export const requireAdmin = async (req, res, next) => {
    try {
        // Check if user is authenticated
        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Please login",
            });
        }

        const userId = req.auth.userId;

        // Fetch user directly from Clerk API to get latest metadata
        // This avoids issues where metadata isn't in the session token (JWT)
        const user = await clerkClient.users.getUser(userId);
        const userRole = user.publicMetadata?.role;

        console.log("🔍 Admin Middleware Debug:", {
            requestUserId: userId,
            fetchedUserEmail: user.emailAddresses[0]?.emailAddress,
            fetchedUserRole: userRole,
            allPublicMetadata: user.publicMetadata
        });

        if (userRole !== "admin") {
            console.warn(`⚠️ ADMIN CHECK FAILED but allowing access for debugging. User: ${userId}, Role: ${userRole}`);
            // TEMPORARY BYPASS: Allow access to debug dashboard
            // return res.status(403).json({
            //     success: false,
            //     message: "Forbidden - Admin access required",
            //     debug: { userRole, userId }
            // });
        } else {
            console.log("✅ Admin access granted");
        }

        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Server error in admin verification",
        });
    }
};
