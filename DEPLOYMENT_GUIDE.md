# Deploying to Vercel

This project is ready for deployment on Vercel. Follow these steps to deploy both the Frontend and Backend.

## Prerequisites
1.  A [GitHub account](https://github.com/).
2.  A [Vercel account](https://vercel.com/signup).
3.  Install **Vercel CLI** (optional but recommended): `npm i -g vercel`.

## 1. Push Code to GitHub
Ensure all your latest changes (including `vercel.json` files) are pushed to GitHub.
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## 2. Deploy Backend
1.  Go to your Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2.  Import your GitHub repository.
3.  **Root Directory**: Click "Edit" and select `Backend`.
4.  **Environment Variables**: Add the following variables (copy values from your local `.env`):
    *   `MONGODB_URI`
    *   `JWT_SECRET`
    *   `CLERK_PUBLISHABLE_KEY`
    *   `CLERK_SECRET_KEY`
    *   `RAZORPAY_KEY_ID`
    *   `RAZORPAY_KEY_SECRET`
    *   `SMTP_HOST`
    *   `SMTP_PORT`
    *   `SMTP_USER`
    *   `SMTP_PASS`
    *   `CLIPDROP_API`
5.  Click **Deploy**.
6.  **Note the URL**: After deployment, you will get a URL like `https://your-backend.vercel.app`. You will need this for the Frontend.

## 3. Deploy Frontend
1.  Go to your Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2.  Import the **same** GitHub repository again.
3.  **Project Name**: Give it a different name (e.g., `imagescratch-frontend`).
4.  **Root Directory**: Click "Edit" and select `Frontend`.
5.  **Framework Preset**: It should auto-detect "Vite". If not, select it.
6.  **Environment Variables**:
    *   `VITE_BACKEND_URL`: Set this to your **Backend URL** from Step 2 (e.g., `https://your-backend.vercel.app`).
    *   `VITE_RAZORPAY_KEY_ID`: Copy from local `.env`.
    *   `VITE_CLERK_PUBLISHABLE_KEY`: Copy from local `.env`.
7.  Click **Deploy**.

## 4. Final Configuration (CORS)
Once your Frontend is deployed, you will have a Frontend URL (e.g., `https://imagescratch-frontend.vercel.app`).
1.  Go back to your **Backend Project** in Vercel.
2.  Go to **Settings** -> **Environment Variables**.
3.  Add/Update `FRONTEND_URL` to be your new Frontend URL (no trailing slash).
    *   *Note: Ensure your backend code uses this variable in CORS settings.*
4.  Redeploy the Backend for changes to take effect (Go to **Deployments** -> **Redeploy** on the latest build).

## Done! 🚀
Your Full Stack MERN application should now be live.
