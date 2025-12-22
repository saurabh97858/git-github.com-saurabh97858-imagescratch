# Admin Dashboard Setup Guide

## 🎯 Overview
This guide will help you set up the admin role in Clerk and access the admin dashboard.

---

## 📋 Steps to Setup Admin Access

### Step 1: Login to Clerk Dashboard
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Login with your account
3. Select your application (Imagify)

### Step 2: Add Admin Role to Your User
1. In the left sidebar, click on **"Users"**
2. Find and click on your user account (the one you want to make admin)
3. Scroll down to the **"Public metadata"** section
4. Click **"Edit"** button
5. Add the following JSON:
   ```json
   {
     "role": "admin"
   }
   ```
6. Click **"Save"** button

### Step 3: Verify Admin Access
1. Logout from your application if already logged in
2. Login again (this refreshes your session with new metadata)
3. You should now see the **"🎛️ Dashboard"** link in the navbar
4. Click on it to access the admin dashboard

---

## 🚀 How It Works

### Unified Login System
- **Same login for everyone**: Both regular users and admins use the same Clerk login
- **Role-based access**: System checks for `publicMetadata.role === "admin"`
- **Automatic detection**: Dashboard link appears automatically for admin users

### Admin Dashboard Features
1. **📊 Statistics Overview**
   - Total messages received
   - Pending messages count
   - Resolved messages count
   - Response rate percentage

2. **🎧 Help Desk**
   - View all contact form submissions
   - Search messages by name, email, or content
   - Filter by status (all/pending/resolved)
   - Respond to customers via email
   - Mark messages as resolved

3. **⚙️ Feature Manager**
   - Add new features
   - Toggle feature on/off
   - Manage application features

4. **🚀 Quick Actions**
   - View Analytics
   - Manage Users
   - Settings
   - Refresh Data

---

## 📝 Contact Form Flow

1. **User submits contact form** → Message saved to MongoDB
2. **Admin receives email notification** → Alert about new message
3. **Admin views in dashboard** → Message appears in Help Desk
4. **Admin responds** → Email sent to customer
5. **Status updated** → Message marked as resolved

---

## 🛡️ Security

- Dashboard route is protected by both authentication AND admin role check
- Only users with `role: "admin"` in public metadata can access
- Regular users are redirected if they try to access `/dashboard`
- All API calls to admin routes require admin authentication

---

## 🎨 Dashboard URL
After setting up admin role, access the dashboard at:
```
http://localhost:5173/dashboard
```

---

## ❓ Troubleshooting

**Q: I added admin role but still can't see Dashboard link**
- A: Logout and login again to refresh your session

**Q: Dashboard link appears but I get Access Denied**
- A: Ensure the role is exactly `"admin"` (lowercase) in public metadata

**Q: Contact messages not showing in dashboard**
- A: Check if backend server is running and MongoDB is connected

---

## 🎯 Next Steps

1. Submit a test message via Contact form
2. Check if it appears in the Help Desk
3. Try responding to the message
4. Verify customer receives the email response

---

**Need Help?** Contact support through the app's contact form!
