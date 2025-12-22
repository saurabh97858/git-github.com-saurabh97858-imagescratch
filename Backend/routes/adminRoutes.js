import express from "express";
import contactModel from "../models/contactModel.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// GET all contact messages
router.get("/contacts", async (req, res) => {
    try {
        const contacts = await contactModel
            .find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            contacts,
            total: contacts.length,
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch contacts",
        });
    }
});

// GET dashboard statistics
router.get("/stats", async (req, res) => {
    try {
        const total = await contactModel.countDocuments();
        const pending = await contactModel.countDocuments({ status: "pending" });
        const resolved = await contactModel.countDocuments({ status: "resolved" });

        res.json({
            success: true,
            stats: {
                total,
                pending,
                resolved,
                responseRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0,
            },
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
        });
    }
});

// PATCH update contact status
router.patch("/contacts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "resolved"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const updatedContact = await contactModel.findByIdAndUpdate(
            id,
            {
                status,
                ...(status === "resolved" && { respondedAt: new Date() })
            },
            { new: true }
        );

        if (!updatedContact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        res.json({
            success: true,
            message: "Status updated successfully",
            contact: updatedContact,
        });
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update contact",
        });
    }
});

// POST respond to customer
router.post("/contacts/:id/respond", async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        if (!response) {
            return res.status(400).json({
                success: false,
                message: "Response message is required",
            });
        }

        const contact = await contactModel.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        // Send email response
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: contact.email,
            subject: "Response to Your Query - Imagify Support",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Hello ${contact.name},</h2>
          <p>Thank you for contacting Imagify. Here's our response to your query:</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #f97316; margin: 20px 0;">
            <strong>Your Message:</strong>
            <p>${contact.message}</p>
          </div>

          <div style="background: #fff7ed; padding: 15px; border-left: 4px solid #fb923c; margin: 20px 0;">
            <strong>Our Response:</strong>
            <p>${response}</p>
          </div>

          <p>If you have any more questions, feel free to reach out!</p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best Regards,<br>
            Imagify Support Team
          </p>
        </div>
      `,
        });

        // Update contact with response
        const updatedContact = await contactModel.findByIdAndUpdate(
            id,
            {
                adminResponse: response,
                status: "resolved",
                respondedAt: new Date(),
            },
            { new: true }
        );

        res.json({
            success: true,
            message: "Response sent successfully",
            contact: updatedContact,
        });
    } catch (error) {
        console.error("Error sending response:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send response",
        });
    }
});

// GET all users
router.get("/users", async (req, res) => {
    try {
        // Fetch users from MongoDB
        // Assuming you have a userModel imported. If not, I need to import it.
        // Let's check imports first. Ah, I need to import userModel.
        // Wait, I should check if userModel is imported. It is not.
        // I will add the import in a separate edit or assume I can add it here if I replace the top of the file.
        // For now, let's just add the route logic assuming userModel will be imported.

        // Actually, I should probably use the replace_file_content to add the import too.
        // But I can't do two non-contiguous edits with replace_file_content.
        // I will use multi_replace_file_content instead.
        // Wait, I am using replace_file_content.
        // I will add the route here and then add the import in the next step.

        // Re-reading instructions: "Use this tool ONLY when you are making a SINGLE CONTIGUOUS block of edits".
        // Okay, I will add the route here.

        const users = await import("../models/userModel.js").then(m => m.default.find().sort({ createdAt: -1 }));

        res.json({
            success: true,
            users,
            total: users.length,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
});

export default router;
