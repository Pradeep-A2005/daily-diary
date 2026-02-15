# Quick Deployment Reference

## 🚀 TL;DR - Fastest Path to Deployment

### 1. Database (Choose One - 2 minutes)
- **MongoDB Atlas** (Easiest, FREE FOREVER ✅): [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Create M0 cluster (512MB free) → Get connection string
- **Railway**: [railway.app](https://railway.app/) → New Project → Deploy MongoDB → Copy MONGO_URL

### 2. Backend on Render (5 minutes)
1. Push code to GitHub
2. [render.com](https://render.com/) → New Web Service → Connect repo
3. Root Directory: `backend`
4. Add env vars: `MONGODB_URI`, `JWT_SECRET`
5. Deploy → Copy backend URL

### 3. Frontend on Vercel (3 minutes)
1. [vercel.com](https://vercel.com/) → New Project → Import repo
2. Root Directory: `frontend`
3. Add env var: `VITE_API_URL` = `https://your-backend.onrender.com/api`
4. Deploy → Copy frontend URL

### 4. Update CORS (1 minute)
1. Render → Environment → Add `FRONTEND_URL` = your Vercel URL
2. Save (auto-redeploys)

### ✅ Done! Test at your Vercel URL

---

## 📝 Environment Variables Cheat Sheet

### Backend (Render)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/daily-diary
JWT_SECRET=your-super-secret-key-min-32-chars
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🆓 Free Tier Limits (All Permanent!)

| Service | Storage | Bandwidth | Uptime | Notes |
|---------|---------|-----------|--------|-------|
| MongoDB Atlas | 512MB | Unlimited | 100% | ✅ Free forever, no CC |
| Railway | Varies | 100GB | 100% | $5 credit/month |
| Render | N/A | 100GB | Sleeps after 15min | ✅ Free forever |
| Vercel | 100GB | 100GB | 100% | ✅ Free forever |

---

## 🔗 Quick Links

- [Full Deployment Guide](./DEPLOYMENT.md)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Vercel](https://vercel.com/)

---

## ⚡ Common Issues

**Can't connect to backend?**
→ Check `VITE_API_URL` in Vercel and `FRONTEND_URL` in Render

**Database connection failed?**
→ Verify `MONGODB_URI` and check MongoDB Atlas network access (allow 0.0.0.0/0)

**Backend sleeping?**
→ Normal on free tier. First request takes 30-60s to wake up

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
