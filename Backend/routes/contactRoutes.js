import express from "express";
import nodemailer from "nodemailer";
import contactModel from "../models/contactModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Save to database
    const newContact = await contactModel.create({
      name,
      email,
      message,
      status: "pending",
    });

    // Send email notification to admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"${name}" <${process.env.SENDER_EMAIL}>`, // Send FROM authenticated email, but with user's name
        replyTo: email, // Reply to the user's email
        to: process.env.SENDER_EMAIL,
        subject: "New Contact Form Message - Imagify",
        html: `
          <h2>New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><em>This message has been saved to the dashboard.</em></p>
        `,
      });
      console.log("✅ Email notification sent to admin");
    } catch (emailError) {
      console.error("⚠️ Failed to send email notification:", emailError.message);
      // Continue execution even if email fails, since we saved to DB
    }

    res.json({
      success: true,
      message: "Message sent successfully",
      contactId: newContact._id
    });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    res.json({ success: false, message: "Failed to send message. Please try again." });
  }
});

export default router;

