import "dotenv/config";

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
    console.error("❌ CLERK_SECRET_KEY is missing");
    process.exit(1);
}

const updateUserRole = async () => {
    try {
        // 1. Fetch latest users
        const response = await fetch("https://api.clerk.com/v1/users?limit=5", {
            headers: {
                Authorization: `Bearer ${CLERK_SECRET_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const users = await response.json();

        if (users.length === 0) {
            console.log("⚠️ No users found in Clerk.");
            return;
        }

        console.log(`🔍 Found ${users.length} users.`);

        console.log(`🔍 Found ${users.length} users.`);

        // Loop through ALL users and make them admin
        for (const targetUser of users) {
            console.log(`👤 Targeting User: ${targetUser.id} (${targetUser.email_addresses[0]?.email_address})`);

            const updateResponse = await fetch(`https://api.clerk.com/v1/users/${targetUser.id}/metadata`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${CLERK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    public_metadata: {
                        role: "admin",
                    },
                }),
            });

            if (!updateResponse.ok) {
                const err = await updateResponse.json();
                console.error(`❌ Failed to update user ${targetUser.id}:`, err);
            } else {
                const updatedUser = await updateResponse.json();
                console.log(`✅ User ${targetUser.id} updated successfully! Role: ${updatedUser.public_metadata.role}`);
            }
        }

        console.log("👉 Please ask the user to sign out and sign in again (or just refresh) to see changes.");

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
};

updateUserRole();
