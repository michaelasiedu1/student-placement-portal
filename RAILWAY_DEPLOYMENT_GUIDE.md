# 🚀 Railway Deployment Guide - Student Placement Portal

A step-by-step guide to deploy your Steadfast Academy Student Management System to Railway with MongoDB.

---

## 📋 Prerequisites

- GitHub account with your repository pushed
- Railway account (free tier available)
- Docker installed locally (Railway will handle building)

---

## 🔧 Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```powershell
cd C:\Users\Daniel Wundengba\Desktop\student-placement-portal
git init
git add .
git commit -m "Initial commit: Student Placement Portal"
git remote add origin https://github.com/YOUR_USERNAME/student-placement-portal.git
git branch -M main
git push -u origin main
```

### 1.2 Create `.env` files for Railway

**Backend `.env`** (`spp-backend/.env`):
```
PORT=4000
NODE_ENV=production
MONGO_URI=${DATABASE_URL}
```

**Frontend `.env`** (`spp-frontend/.env`):
```
VITE_API_URL=${API_URL}
```

---

## 🎯 Step 2: Set Up Railway Project

### 2.1 Create a New Railway Project
1. Go to [https://railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"Create a New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `student-placement-portal` repository
6. Click **"Deploy"**

### 2.2 Add MongoDB Database
1. In Railway dashboard, click **"+ Add Service"**
2. Select **"MongoDB"**
3. Wait for MongoDB to start (1-2 minutes)
4. Copy the `DATABASE_URL` from the MongoDB service variables

---

## ⚙️ Step 3: Configure Services

### 3.1 Backend Service Configuration

1. **Select the backend service** in your Railway dashboard
2. Go to the **"Settings"** tab
3. Set the **Start Command**:
   ```
   npm start
   ```

4. Go to **"Environment"** tab
5. Add these variables:
   - `NODE_ENV`: `production`
   - `PORT`: `4000`
   - `MONGO_URI`: Paste the `DATABASE_URL` from MongoDB service (starts with `mongodb+srv://`)

6. Deploy by clicking **"Deploy"** or wait for auto-deploy if GitHub is connected

### 3.2 Frontend Service Configuration

1. **Select the frontend service** in your Railway dashboard
2. Go to the **"Settings"** tab
3. Set the **Start Command**:
   ```
   npm run build && npm run preview
   ```
   
   *Alternative (using `serve`)*: Add to `package.json`:
   ```json
   {
     "dependencies": {
       "serve": "^14.2.0"
     },
     "scripts": {
       "start": "serve -s dist -l 5173"
     }
   }
   ```
   Then use: `npm start`

4. Go to **"Environment"** tab
5. Add:
   - `VITE_API_URL`: Get from backend service → click on it → copy the public URL (e.g., `https://your-backend.railway.app`)
   - `PORT`: `5173`

6. Deploy

### 3.3 Connect Backend & Frontend

1. Get the **Backend Public URL**:
   - Click on backend service
   - Copy the URL from "Service Domain" (e.g., `https://student-placement-backend.railway.app`)

2. Update **Frontend Environment Variable**:
   - Go to frontend → Environment
   - Set `VITE_API_URL` to your backend URL
   - Redeploy frontend

---

## 🔗 Step 4: Update CORS Settings (Backend)

Ensure your backend allows requests from your frontend domain.

**Edit `spp-backend/app.js`**:
```javascript
const cors = require('cors');
const express = require('express');

const app = express();

// Configure CORS for production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());
// ... rest of your code
```

**Add to `spp-backend/.env`**:
```
FRONTEND_URL=https://your-frontend.railway.app
```

---

## ✅ Step 5: Verify Deployment

### 5.1 Check Service Status
In Railway dashboard:
- ✅ Green status on all services (MongoDB, Backend, Frontend)
- 📊 Logs show no errors

### 5.2 Test the Application
1. Click **"View Public URL"** on the frontend service
2. Application should load
3. Try adding/viewing students
4. Check backend logs for API calls

### 5.3 Test API Endpoint
```powershell
# Replace with your actual backend URL
curl https://your-backend.railway.app/api/students

# Should return student data (or empty array initially)
```

---

## 🌐 Your Public URLs

After successful deployment, you'll have:

```
Frontend: https://your-frontend.railway.app
Backend:  https://your-backend.railway.app
Database: MongoDB (managed by Railway)
```

Share the frontend URL with users!

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /"
**Solution**: Frontend build failed
- Check frontend logs in Railway
- Ensure `npm run build` works locally
- Check `vite.config.js` configuration

### Issue: API calls return 404
**Solution**: Backend URL mismatch
- Verify `VITE_API_URL` matches your backend domain
- Check CORS settings in `app.js`
- Redeploy frontend after updating env vars

### Issue: MongoDB connection fails
**Solution**: Database URL not set
- Copy `DATABASE_URL` from MongoDB service
- Paste into backend's `MONGO_URI` environment variable
- Restart backend service

### Issue: "Deployment timeout"
**Solution**: Slow build
- Ensure `node_modules` is in `.gitignore` (not pushing dependencies)
- Check if docker image is too large

### Issue: Build fails with no error message
**Solution**: Missing environment variables
1. Go to Railway → Select service → Environment
2. Ensure ALL required variables are set:
   - **Backend**: `MONGO_URI`, `PORT`, `NODE_ENV`, `FRONTEND_URL`
   - **Frontend**: `VITE_API_URL`, `PORT`
3. Copy `DATABASE_URL` from MongoDB service and paste as `MONGO_URI`
4. Redeploy service

---

## 🔄 Auto-Deployment

Railway auto-deploys when you push to `main` branch:
```powershell
# Make changes, commit, and push
git add .
git commit -m "Update features"
git push origin main

# Railway will automatically redeploy!
```

Disable auto-deploy in Railway → Settings → "Automatic Deployment" if needed.

---

## 📈 Scale & Monitor

### View Logs
- Click on any service → "Logs" tab
- Real-time logs of deployments and errors

### Monitor Usage
- Dashboard shows RAM, CPU usage
- Free tier: 500 RAM hours/month

### Add More Services
- Click **"+ Add Service"** to add Redis, PostgreSQL, etc.

---

## 🎉 You're Live!

Your Student Placement Portal is now publicly accessible!

- Share the frontend URL: `https://your-frontend.railway.app`
- Monitor via Railway dashboard
- Logs available for debugging
- Auto-deploys on every push to `main`

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Dashboard: https://railway.app/dashboard
- Issues? Check service logs first!

---

**Happy Deploying! 🚀**
