# Render Quick Deployment - Step-by-Step (20 Minutes)

## 🚀 Fast Track to Production

This guide gets your app live on Render in **20 minutes**.

---

## STEP 1: Prepare Your Code (5 minutes)

### 1.1 Update package.json - Root Level

Your root `package.json` needs a start script for Render:

```json
{
  "name": "hospital-management-system",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "start": "npm run build && echo 'Frontend built successfully'"
  }
}
```

### 1.2 Verify Backend package.json

Your `backend/package.json` already has:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

This is perfect for Render! ✅

### 1.3 Commit & Push to GitHub

```bash
git add -A
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## STEP 2: Create Render Account (2 minutes)

### 2.1 Sign Up

```
1. Go to https://render.com
2. Click "Get Started" or "Sign up"
3. Choose "Sign up with GitHub"
4. Click "Authorize Render"
5. Complete profile (just fill required fields)
```

### 2.2 You'll See Dashboard

```
URL: https://dashboard.render.com
Features visible:
- Services (for backends)
- Static Sites (for frontends)
- Databases
- Environments
```

---

## STEP 3: Deploy Backend (5 minutes)

### 3.1 Create Web Service

```
1. In Render Dashboard, click "+ New"
2. Select "Web Service"
3. Click "Connect Repository"
4. Find & select your hospital-management-system repo
5. Click "Connect"
```

### 3.2 Configure Service

Fill in the form:

```
Name:                   hospital-backend
Environment:            Node
Region:                 Auto (or pick closest to you)
Branch:                 main
Build Command:          cd backend && npm install
Start Command:          node server.js
Plan:                   Free (for now)
```

### 3.3 Click "Create Web Service"

```
⏳ Render will start deploying immediately
🔄 Check "Logs" tab to watch build progress
⏱️ Takes 2-3 minutes
✅ You'll get a URL: https://hospital-backend-xxxx.onrender.com
```

### 3.4 Add Environment Variables

```
1. Once service is created, go to "Environment" tab
2. Add each variable one by one:

NODE_ENV:                   production
PORT:                       8080
ORACLE_USER:                system
ORACLE_PASSWORD:            your_actual_password
ORACLE_CONNECT_STRING:      localhost:1521:xe
ORACLE_CLIENT_PATH:         /opt/oracle/instantclient
FRONTEND_URL:               (leave blank for now)
```

**To add variables:**
- Click "Add Key"
- Enter key name (e.g., "NODE_ENV")
- Enter value (e.g., "production")
- Click "Add"
- Repeat for each variable

### 3.5 Save and Redeploy

```
1. After adding all variables, click "Save"
2. Go back to "Logs" tab
3. The service will automatically redeploy
4. Wait for "Build successful" message
```

### 3.6 Test Backend

```bash
# Replace xxxx with your actual service name
curl https://hospital-backend-xxxx.onrender.com/api/health

# Expected:
# {"status":"Server is running","timestamp":"2024-05-23T..."}
```

---

## STEP 4: Deploy Frontend (3 minutes)

### 4.1 Create Static Site

```
1. In Render Dashboard, click "+ New"
2. Select "Static Site"
3. Click "Connect Repository"
4. Select your hospital-management-system repo
5. Click "Connect"
```

### 4.2 Configure Site

Fill in the form:

```
Name:                   hospital-frontend
Region:                 Auto (or pick closest)
Branch:                 main
Build Command:          npm install && npm run build
Publish Directory:      dist
```

### 4.3 Click "Create Static Site"

```
⏳ Render will start deploying
🔄 Check "Logs" tab to watch progress
⏱️ Takes 2-3 minutes
✅ You'll get a URL: https://hospital-frontend-xxxx.onrender.com
```

### 4.4 Add Environment Variables

```
1. Go to "Environment" tab
2. Add this variable:

Key:     VITE_API_URL
Value:   https://hospital-backend-xxxx.onrender.com/api
         (Replace xxxx with your actual backend name)
```

### 4.5 Save and Redeploy

```
1. Click "Save"
2. Frontend will rebuild automatically
3. Once "Deploy" button appears, click it
4. Wait for "Published" status
```

### 4.6 Test Frontend

```
Open in browser:
https://hospital-frontend-xxxx.onrender.com

You should see:
✅ Hospital Management System homepage
✅ Navigation menu
✅ Can click through pages
```

---

## STEP 5: Test Everything Works (3 minutes)

### 5.1 Test API Connection

Open browser console and run:
```javascript
fetch('https://hospital-backend-xxxx.onrender.com/api/patients')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(e => console.error(e))
```

Should see patient data from Oracle database.

### 5.2 Test Frontend Pages

Click through in your app:
1. ✅ Dashboard page loads
2. ✅ Patients page shows data
3. ✅ Can view doctors
4. ✅ Can see appointments
5. ✅ Medical records appear

### 5.3 Test Add New Patient

```
In Patients page:
1. Try adding a new patient
2. Fill in form
3. Click "Add Patient"
4. Should appear in list
5. Refresh page - should still be there!
```

---

## STEP 6: Setup Auto-Deploy (Automatic)

### You're Done! 🎉

Render automatically deploys when you push to GitHub:

```bash
# Make a code change
echo "// Updated" >> backend/server.js

# Push to GitHub
git add -A
git commit -m "Small update"
git push origin main

# Watch in Render Dashboard
1. Go to service
2. New build starts automatically
3. Deploys when successful
4. Your live app updates!
```

---

## STEP 7: Custom Domain (Optional - 5 minutes)

### 7.1 Add Domain to Backend

```
1. Go to Backend Service → Settings
2. Scroll to "Custom Domain"
3. Enter: api.yourdomain.com
4. Render shows DNS records to add
```

### 7.2 Add Domain to Frontend

```
1. Go to Frontend Site → Settings
2. Scroll to "Custom Domain"
3. Enter: app.yourdomain.com
4. Render shows DNS records to add
```

### 7.3 Update DNS Records

At your domain registrar (GoDaddy, Namecheap, etc):

```
Create CNAME records:
app.yourdomain.com  →  cname.onrender.com (from Render)
api.yourdomain.com  →  cname.onrender.com (from Render)
```

### 7.4 Update Frontend Environment Variable

```
Go to Frontend → Environment
Update VITE_API_URL:
Before: https://hospital-backend-xxxx.onrender.com/api
After:  https://api.yourdomain.com/api

Click Save - redeploys automatically
```

---

## 📊 Your Deployment Summary

### Services Created
```
Frontend:  https://hospital-frontend-xxxx.onrender.com
Backend:   https://hospital-backend-xxxx.onrender.com
```

### Database
- Oracle running on your server (not Render)
- Connected via ORACLE_CONNECT_STRING

### Features Active
- ✅ Auto-deploy on GitHub push
- ✅ Free SSL/HTTPS
- ✅ Automatic restarts
- ✅ Real-time logs
- ✅ Environment variables
- ✅ Custom domain (optional)

### Cost (Free Tier)
```
Frontend:  $0/month (always included)
Backend:   $0/month (free tier, spins down after 15 min)
Database:  $0/month (your Oracle server)
─────────────────────────────────
TOTAL:     $0/month to start!
```

---

## 🆘 Quick Troubleshooting

### "Build Failed" Error

**Check logs:**
```
1. Go to service
2. Click "Logs" tab
3. Look for red error messages
4. Common issues:
   - Missing NODE_ENV in environment
   - Database connection string wrong
   - Dependency not installed
```

**Fix:**
```
1. Fix the issue locally
2. Test: npm run dev (backend) or npm run build (frontend)
3. Push to GitHub
4. Render auto-rebuilds
```

### "Can't Connect to API"

**Check:**
```
1. API URL in frontend .env correct?
   Should be: https://hospital-backend-xxxx.onrender.com/api
   
2. Backend running?
   Check: https://hospital-backend-xxxx.onrender.com/api/health
   
3. CORS enabled?
   Check backend server.js has: app.use(cors());
```

### "Database Connection Failed"

**Check:**
```
1. ORACLE_CONNECT_STRING in backend environment correct?
2. Oracle server accessible from Render?
3. Password correct? (typos happen!)
4. Firewall allowing connections?

Fix by checking logs:
Go to Backend → Logs tab → Search for "Oracle Error"
```

---

## 📋 Verification Checklist

Once deployed, verify:

- [ ] Frontend loads at https://hospital-frontend-xxxx.onrender.com
- [ ] Backend API responds to health check
- [ ] Can see sample data in Patients page
- [ ] Can add new patient successfully
- [ ] Data persists after page refresh
- [ ] No console errors in browser
- [ ] All pages accessible
- [ ] Styling looks correct
- [ ] API responses are JSON
- [ ] No 404 or 500 errors

---

## 🎉 Success!

Your app is now live! 

### Share with others:
```
Frontend: https://hospital-frontend-xxxx.onrender.com
Backend API: https://hospital-backend-xxxx.onrender.com/api
Health Check: https://hospital-backend-xxxx.onrender.com/api/health
```

### Next steps:
1. Monitor logs daily
2. Upgrade to Starter ($7/month) for production
3. Setup custom domain when ready
4. Add more features!

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Backend Logs**: Dashboard → Backend Service → Logs
- **Frontend Logs**: Dashboard → Frontend Site → Logs
- **Status**: https://status.render.com

---

**Deployed on**: May 23, 2026
**Platform**: Render
**Status**: ✅ LIVE
**Time to Deploy**: ~20 minutes
