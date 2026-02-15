# Daily Diary - Deployment Guide

This guide will walk you through deploying your Daily Diary application with the **frontend on Vercel** and **backend on Render**.

## 📋 Prerequisites

- GitHub account (for connecting to Vercel and Render)
- Git installed locally
- Your code pushed to a GitHub repository

---

## 🗄️ Step 1: Choose and Set Up Your Database

You have several **free** options for hosting your database:

### Option A: MongoDB Atlas (Recommended ✅)

**Best for:** Easiest setup, no code changes needed

> [!TIP]
> **MongoDB Atlas M0 is FREE FOREVER** - not a trial! You get 512MB storage permanently with no credit card required.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account (no credit card needed)
3. Create a new cluster (M0 Free tier - 512MB storage, free forever)
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/daily-diary`)
6. Replace `<password>` with your actual password
7. Save this connection string for later

### Option B: Railway MongoDB

**Best for:** Simple MongoDB hosting with generous free tier

1. Go to [Railway.app](https://railway.app/)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy MongoDB"**
4. Once deployed, click on the MongoDB service
5. Go to **"Connect"** tab and copy the `MONGO_URL`
6. Save this connection string for later

### Option C: Render PostgreSQL (Free but requires code changes)

**Best for:** Staying entirely on Render platform

> [!WARNING]
> This option requires converting your backend from MongoDB/Mongoose to PostgreSQL/Prisma. Only choose this if you're comfortable with database migration.

1. We'll set this up during backend deployment
2. Requires rewriting models and database logic

---

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Push Your Code to GitHub

```bash
cd "C:\Users\Administrator\Documents\Daily Diary"
git init
git add .
git commit -m "Initial commit - Daily Diary app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/daily-diary.git
git push -u origin main
```

### 2.2 Create Render Account

1. Go to [Render.com](https://render.com/)
2. Sign up with your GitHub account

### 2.3 Deploy Backend Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the `daily-diary` repository
4. Configure the service:
   - **Name:** `daily-diary-backend`
   - **Region:** Choose closest to you (e.g., Singapore)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

5. Click **"Advanced"** and add environment variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your connection string from Step 1 |
   | `JWT_SECRET` | Generate a random string (e.g., `openssl rand -base64 32`) |
   | `FRONTEND_URL` | Leave blank for now (we'll add this after Vercel deployment) |
   | `EMAIL_HOST` | `smtp.gmail.com` (optional, for reminders) |
   | `EMAIL_PORT` | `587` (optional) |
   | `EMAIL_USER` | Your Gmail address (optional) |
   | `EMAIL_PASS` | Your Gmail app password (optional) |
   | `EMAIL_FROM` | `Daily Diary <noreply@dailydiary.com>` (optional) |

6. Click **"Create Web Service"**

7. Wait for deployment to complete (5-10 minutes)

8. Once deployed, copy your backend URL (e.g., `https://daily-diary-backend.onrender.com`)

> [!TIP]
> **Email Setup (Optional):** To enable reminder emails, you need a Gmail App Password:
> 1. Go to Google Account → Security → 2-Step Verification
> 2. Scroll to "App passwords" and generate one
> 3. Use this password for `EMAIL_PASS`

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account

1. Go to [Vercel.com](https://vercel.com/)
2. Sign up with your GitHub account

### 3.2 Deploy Frontend

1. Click **"Add New..."** → **"Project"**
2. Import your `daily-diary` repository
3. Configure the project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Add environment variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://daily-diary-backend.onrender.com/api` (your Render backend URL + `/api`)

5. Click **"Deploy"**

6. Wait for deployment (2-3 minutes)

7. Once deployed, copy your frontend URL (e.g., `https://daily-diary-xyz.vercel.app`)

### 3.3 Update Backend CORS Settings

1. Go back to Render dashboard
2. Open your backend service
3. Go to **"Environment"** tab
4. Add/update the `FRONTEND_URL` variable:
   - **Key:** `FRONTEND_URL`
   - **Value:** Your Vercel URL (e.g., `https://daily-diary-xyz.vercel.app`)

5. Save changes (this will trigger a redeploy)

---

## ✅ Step 4: Verify Deployment

### Test Your Application

1. Open your Vercel URL in a browser
2. Try to sign up for a new account
3. Log in with your credentials
4. Create a diary entry
5. Select a mood
6. Check the calendar view
7. Verify streak tracking

### Check Backend Health

Visit: `https://your-backend.onrender.com/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "Daily Diary API is running"
}
```

---

## 🔧 Troubleshooting

### Issue: Frontend can't connect to backend

**Solution:**
1. Check that `VITE_API_URL` in Vercel matches your Render backend URL
2. Verify `FRONTEND_URL` in Render matches your Vercel frontend URL
3. Check browser console for CORS errors

### Issue: "Cannot connect to database"

**Solution:**
1. Verify `MONGODB_URI` is correct in Render environment variables
2. Check MongoDB Atlas network access (allow access from anywhere: `0.0.0.0/0`)
3. Ensure database user has read/write permissions

### Issue: Render service keeps sleeping

**Solution:**
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Consider upgrading to paid tier ($7/month) for always-on service

### Issue: Build fails on Vercel

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure `package.json` has all dependencies
3. Verify Node version compatibility

---

## 🔄 Updating Your Application

### Update Frontend

```bash
git add .
git commit -m "Update frontend"
git push
```

Vercel will automatically redeploy.

### Update Backend

```bash
git add .
git commit -m "Update backend"
git push
```

Render will automatically redeploy.

---

## 💰 Cost Summary

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| **MongoDB Atlas** | 512MB storage **FOREVER** ✅ | Shared cluster, no credit card needed |
| **Railway** | $5/month credit | ~500 hours/month, credit card required after trial |
| **Render** | 750 hours/month **FOREVER** ✅ | Sleeps after 15min inactivity |
| **Vercel** | 100GB bandwidth **FOREVER** ✅ | Hobby projects only |

**Total Cost:** $0/month **FOREVER** for personal use! 🎉

> [!NOTE]
> MongoDB Atlas M0, Render Free, and Vercel Hobby are **permanent free tiers**, not trials!

---

## 📱 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your domain (e.g., `mydiary.com`)
4. Follow DNS configuration instructions

### Update Backend CORS

Update `FRONTEND_URL` in Render to your custom domain.

---

## 🔐 Security Best Practices

1. ✅ Never commit `.env` files to Git
2. ✅ Use strong `JWT_SECRET` (32+ characters)
3. ✅ Enable 2FA on MongoDB Atlas
4. ✅ Regularly rotate email passwords
5. ✅ Monitor Render/Vercel logs for suspicious activity

---

## 📞 Need Help?

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/

---

## 🎉 Congratulations!

Your Daily Diary app is now live! Share your Vercel URL with friends and start journaling! 📝✨
