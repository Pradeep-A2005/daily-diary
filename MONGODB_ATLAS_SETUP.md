# MongoDB Atlas Setup Guide - Step by Step

Follow these steps to set up your **FREE FOREVER** MongoDB Atlas database:

---

## Step 1: Create Your Account (2 minutes)

1. **Open your browser** and go to: **https://www.mongodb.com/cloud/atlas/register**

2. **Sign up** using one of these options:
   - ✅ **Google account** (fastest - just click "Sign up with Google")
   - ✅ **GitHub account** (click "Sign up with GitHub")
   - ✅ **Email** (fill in email, first name, last name, password)

3. Click **"Create your Atlas account"** or the respective OAuth button

4. **Verify your email** if you signed up with email (check your inbox)

---

## Step 2: Answer Welcome Questions (30 seconds)

After signing in, MongoDB will ask a few questions:

1. **What is your goal today?**
   - Select: **"Build a new application"**

2. **What type of application are you building?**
   - Select: **"Web application"**

3. **What is your preferred language?**
   - Select: **"JavaScript"** or **"Node.js"**

4. Click **"Finish"** or **"Continue"**

> [!NOTE]
> These questions are just for their analytics - your answers don't affect your free tier!

---

## Step 3: Create a FREE Cluster (1 minute)

You'll see a page titled **"Deploy a cloud database"**

### Choose Your Plan:

1. Look for the **M0 (Free)** tier card
   - It should say: **"Shared", "512 MB Storage", "$0/forever"**
   
2. Click **"Create"** under the M0 Free tier

### Configure Your Cluster:

1. **Cloud Provider**: Choose any (AWS, Google Cloud, or Azure - doesn't matter)
   
2. **Region**: Choose the region **closest to you** for better performance
   - For India: **Mumbai (ap-south-1)** or **Singapore (ap-southeast-1)**
   
3. **Cluster Name**: Leave as default (`Cluster0`) or rename to `daily-diary`

4. Click **"Create Deployment"** or **"Create Cluster"** button at the bottom

> [!TIP]
> The cluster creation takes 1-3 minutes. MongoDB will show a loading screen.

---

## Step 4: Create Database User (1 minute)

A popup will appear: **"Security Quickstart"**

### Create a Database User:

1. **Username**: Enter a username (e.g., `dailydiaryuser`)
   
2. **Password**: 
   - Click **"Autogenerate Secure Password"** (recommended)
   - **IMPORTANT**: Click the **"Copy"** button and save this password somewhere safe!
   - Or create your own strong password (at least 8 characters)

3. Click **"Create User"**

> [!WARNING]
> **Save your password now!** You'll need it for the connection string. If you lose it, you'll have to reset it later.

---

## Step 5: Set Network Access (1 minute)

Still in the Security Quickstart popup:

### Add IP Address:

1. You'll see **"Where would you like to connect from?"**

2. Click **"Add My Current IP Address"** button
   - This adds your current IP automatically

3. **For deployment to Render**, also click **"Add a Different IP Address"**
   - Enter: `0.0.0.0/0`
   - Description: `Allow all (for Render deployment)`
   - Click **"Add Entry"**

4. Click **"Finish and Close"** or **"Close"**

> [!NOTE]
> `0.0.0.0/0` allows connections from anywhere. This is needed for Render to connect. MongoDB Atlas has authentication, so this is safe.

---

## Step 6: Get Your Connection String (2 minutes)

### Navigate to Connect:

1. Wait for cluster to finish deploying (green "Active" status)

2. Click the **"Connect"** button on your cluster

3. Choose **"Drivers"** (or "Connect your application")

### Copy Connection String:

1. **Driver**: Select **"Node.js"**
   
2. **Version**: Select **"5.5 or later"** (or latest)

3. You'll see a connection string like:
   ```
   mongodb+srv://dailydiaryuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. Click the **"Copy"** button

5. **Replace `<password>`** with your actual password from Step 4

6. **Add database name** at the end:
   ```
   mongodb+srv://dailydiaryuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/daily-diary?retryWrites=true&w=majority
   ```

### Final Connection String Format:

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/daily-diary?retryWrites=true&w=majority
```

> [!IMPORTANT]
> **Save this complete connection string!** You'll need it when deploying to Render.

---

## Step 7: Test Connection (Optional but Recommended)

### Test Locally First:

1. Open your terminal in the backend folder:
   ```powershell
   cd "C:\Users\Administrator\Documents\Daily Diary\backend"
   ```

2. Create a temporary `.env.test` file:
   ```
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/daily-diary?retryWrites=true&w=majority
   ```

3. Temporarily update your `.env` file with the Atlas connection string

4. Start your backend:
   ```powershell
   npm start
   ```

5. If you see **"MongoDB connected successfully"** or similar - you're good! ✅

6. **Revert** your `.env` back to localhost if you want to continue local development

---

## ✅ You're Done!

You now have:
- ✅ Free MongoDB Atlas account
- ✅ M0 Free cluster (512MB, free forever)
- ✅ Database user with password
- ✅ Network access configured
- ✅ Connection string ready for deployment

---

## 🔐 Important Information to Save

Write these down or save in a password manager:

| Item | Value |
|------|-------|
| **MongoDB Atlas Email** | your-email@example.com |
| **Cluster Name** | Cluster0 (or your custom name) |
| **Database User** | dailydiaryuser (or your username) |
| **Database Password** | [the password you created/generated] |
| **Connection String** | mongodb+srv://... |

---

## 🚀 Next Steps

Now that you have your MongoDB Atlas connection string, you're ready to:

1. **Deploy Backend to Render** - Use this connection string as `MONGODB_URI` environment variable
2. **Deploy Frontend to Vercel** - Follow the deployment guide

See the full deployment guide: [DEPLOYMENT.md](file:///C:/Users/Administrator/Documents/Daily%20Diary/DEPLOYMENT.md)

---

## 🔧 Troubleshooting

### "Can't connect to database"
- Check that you replaced `<password>` with your actual password
- Verify network access includes `0.0.0.0/0`
- Make sure you added `/daily-diary` database name to the connection string

### "Authentication failed"
- Double-check username and password
- Password might contain special characters that need URL encoding
- Try resetting the database user password in Atlas

### "Forgot my password"
1. Go to Atlas dashboard
2. Click "Database Access" in left sidebar
3. Find your user and click "Edit"
4. Click "Edit Password" and set a new one

---

## 📱 Managing Your Database

### View Your Data:
1. Go to Atlas dashboard
2. Click "Browse Collections"
3. See all your diary entries, users, etc.

### Monitor Usage:
1. Click "Metrics" tab
2. See connections, operations, storage usage
3. Free tier: 512MB max

---

**Congratulations!** 🎉 Your MongoDB Atlas database is ready for production use!
