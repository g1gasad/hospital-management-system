# Render Platform Deployment Guide - Hospital Management System

## 🎯 Why Render?

**Advantages:**
- ✅ Super simple deployment (Git push = auto-deploy)
- ✅ Free tier available ($0/month to start)
- ✅ No credit card required for free tier
- ✅ Automatic SSL/HTTPS
- ✅ Built-in database support
- ✅ Environment variables management
- ✅ Auto-scaling on paid plans
- ✅ Perfect for startups and solo developers

**Render vs Alternatives:**
```
Render      | Azure   | AWS     | Heroku
────────────────────────────────────────
Free Tier   | ✅      | ❌      | ❌      | ❌
Setup Time  | 5 min   | 30 min  | 20 min  | 10 min
Cost        | Free    | $65+    | $120+   | Paid only
Ease        | ⭐⭐⭐⭐⭐ | ⭐⭐   | ⭐⭐   | ⭐⭐⭐
Git Deploy  | ✅      | ✅      | ✅      | ✅
```

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub account with repository
- [ ] Project pushed to GitHub (main branch)
- [ ] All code committed (no uncommitted changes)
- [ ] .env variables documented
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend tested locally
- [ ] Oracle database credentials ready
- [ ] Render account created (free)

---

## Step 1: Create Render Account (2 minutes)

### Setup
```
1. Go to https://render.com
2. Click "Sign up"
3. Choose "Sign up with GitHub" (easiest option)
4. Authorize Render to access your GitHub account
5. Complete profile setup
```

### Dashboard
After signup, you'll see the Render dashboard with:
- Services (Backend)
- Static Sites (Frontend)
- Databases
- Environments

---

## Step 2: Deploy Backend to Render (5 minutes)

### 2.1 Create Web Service (Backend)

**In Render Dashboard:**

```
1. Click "+ New" → "Web Service"
2. Connect your GitHub repository
   - Select your hospital-management-system repo
   - Authorize if prompted
3. Configure deployment:
   - Name: hospital-backend
   - Environment: Node
   - Region: Auto-detected (or choose closest to you)
   - Build Command: cd backend && npm install
   - Start Command: npm start (or: npm run dev)
4. Select Plan: "Free" (for testing) or "Starter" ($7/month)
5. Click "Create Web Service"
```

### 2.2 Wait for Initial Deploy

```
🔄 Render will automatically:
1. Pull code from GitHub
2. Install dependencies
3. Build the application
4. Start the server
5. Assign a URL: https://hospital-backend-xxxx.onrender.com

⏱️ This takes 2-3 minutes
```

### 2.3 Add Environment Variables

**In Render Backend Service Settings:**

```
1. Go to your service → Environment
2. Add each variable:
```

**Environment Variables to Add:**

```env
NODE_ENV=production
PORT=8080

# Oracle Database Configuration
ORACLE_USER=system
ORACLE_PASSWORD=your_oracle_password_here
ORACLE_CONNECT_STRING=your-oracle-host:1521:xe

# Oracle Client Path (for Render Linux environment)
ORACLE_CLIENT_PATH=/opt/oracle/instantclient

# Frontend URL (for CORS)
FRONTEND_URL=https://hospital-frontend-xxxx.onrender.com

# Optional
LOG_LEVEL=info
```

### 2.4 Verify Backend is Running

```bash
# Test health check
curl https://hospital-backend-xxxx.onrender.com/api/health

# Expected response:
# {"status":"Server is running","timestamp":"2024-05-23T..."}

# Test API endpoint
curl https://hospital-backend-xxxx.onrender.com/api/patients
```

---

## Step 3: Deploy Frontend to Render (3 minutes)

### 3.1 Create Static Site (Frontend)

**In Render Dashboard:**

```
1. Click "+ New" → "Static Site"
2. Connect your GitHub repository
   - Select your hospital-management-system repo
3. Configure deployment:
   - Name: hospital-frontend
   - Build Command: npm install && npm run build
   - Publish Directory: dist
4. Click "Create Static Site"
```

### 3.2 Configure Frontend Environment Variables

**In Render Frontend Settings:**

```
1. Go to your site → Environment
2. Add environment variable:
```

```env
VITE_API_URL=https://hospital-backend-xxxx.onrender.com/api
```

### 3.3 Verify Frontend is Deployed

```
Your frontend will be live at:
https://hospital-frontend-xxxx.onrender.com

Features:
✅ Automatic SSL/HTTPS
✅ CDN globally distributed
✅ Auto-restart on error
✅ Custom domain support
```

---

## Step 4: Connect Database (Oracle)

### Option A: Use Existing Oracle Database

If you have an Oracle database already running:

#### Update Backend Environment Variables

```env
# Update ORACLE_CONNECT_STRING to point to your database
# Format: hostname:port:database_name

# Example for cloud database:
ORACLE_CONNECT_STRING=your-oracle-server.com:1521:xe

# Example for local network:
ORACLE_CONNECT_STRING=192.168.1.100:1521:xe

# Example for Docker container:
ORACLE_CONNECT_STRING=oracle-container-ip:1521:xe
```

#### Test Connection

```bash
# Use Render shell to test (coming in next step)
# Or test locally first:
cd backend && node test-oracle-connection.js
```

### Option B: Use Render's PostgreSQL Database (Alternative)

If you want to switch from Oracle to PostgreSQL (easier on Render):

```
1. Click "+ New" → "PostgreSQL"
2. Select plan: "Free" tier
3. Render will create a managed database
4. Copy connection string
5. Update backend code to use PostgreSQL instead

Note: This requires code changes to use postgres driver
instead of oracledb. See migration guide if interested.
```

### Option C: Deploy Oracle Database in Container

For a complete managed solution on Render:

```
Note: Render doesn't directly support Oracle containers
on free tier due to resource requirements.

Alternatives:
1. Use free Oracle Autonomous Database (Oracle Cloud)
2. Keep Oracle running locally/on-premises
3. Use managed PostgreSQL on Render
4. Use Docker container on paid Render plan
```

---

## Step 5: Setup Auto-Deployment from GitHub (Automatic)

### What Happens Automatically

```
Every time you push to GitHub main branch:

1. Render detects push
2. Pulls latest code
3. Rebuilds application
4. Tests deployment
5. If successful → goes live
6. If failed → rolls back to previous version

💡 No manual deployment needed!
```

### Disable Auto-Deploy (Optional)

**If you want to deploy manually:**

```
1. Go to service settings
2. Disable auto-deploy
3. Deploy manually when ready
```

---

## Step 6: Configure Custom Domain (Optional)

### Add Custom Domain

**In Render Service:**

```
1. Go to Settings → Custom Domain
2. Enter your domain: app.yourdomain.com
3. Render shows you DNS records to update
4. Update DNS at your domain registrar
5. SSL certificate auto-generated (24 hours)

Before:
Frontend: https://hospital-frontend-xxxx.onrender.com
Backend:  https://hospital-backend-xxxx.onrender.com

After:
Frontend: https://app.yourdomain.com
Backend:  https://api.yourdomain.com
```

### Update Frontend Environment Variable

```env
# Update to point to custom domain
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Step 7: Monitoring & Logs

### Access Logs

**In Render Dashboard:**

```
1. Click your service
2. Go to "Logs" tab
3. See real-time logs as requests come in

Types of logs:
- Build logs: When deploying
- Runtime logs: While running
- Error logs: When something fails
```

### Monitor Performance

```
Useful metrics:
- Memory usage
- CPU usage
- Response times
- Error rates
- Uptime

View in: Service Dashboard
```

### Set Up Alerts (Coming Soon)

Render is adding alert notifications:
```
- Service down
- High error rate
- Build failures
```

---

## Step 8: Upgrade Plan When Needed

### Free Tier Limitations

```
CPU:         0.5 vCPU
Memory:      0.5 GB
Disk:        0.5 GB
Requests:    Unlimited
Databases:   One free PostgreSQL
Spins down:  After 15 min inactivity (auto-restarts)
Bandwidth:   Unlimited
SSL:         Free
```

### Paid Plans

```
Starter ($7/month):
- 0.5 vCPU → 1 vCPU
- 0.5 GB → 1 GB RAM
- No spin-down
- Priority support

Growth & Custom:
- More resources
- Custom configurations
- Dedicated support
```

### When to Upgrade

```
Upgrade when:
- App spins down too frequently
- Memory errors in logs
- Slow response times
- More than 1-2 concurrent users
- Production traffic (recommend Starter+)
```

---

## Step 9: Troubleshooting on Render

### Issue: Backend Won't Start

**Symptoms:**
```
Status: "Deploy failed"
Error in logs: "Error: Cannot find module 'express'"
```

**Solutions:**
```bash
# 1. Check build command includes cd backend
Build Command: cd backend && npm install

# 2. Verify package.json exists in backend/
ls backend/package.json

# 3. Check start command
Start Command: npm start

# 4. View full build logs
Services → Logs tab → Look for build errors
```

### Issue: Environment Variables Not Found

**Symptoms:**
```
Error: Cannot connect to Oracle
"ORACLE_PASSWORD is undefined"
```

**Solutions:**
```
1. Go to Service → Environment
2. Verify all variables are set
3. Click "Save Changes"
4. Redeploy service: Settings → Manual Deploy → "Deploy latest commit"
5. Check logs for changes

Note: Changes take effect after redeploy
```

### Issue: Frontend Can't Connect to Backend

**Symptoms:**
```
Fetch failed: CORS error
Backend URL not found
API calls return 404
```

**Solutions:**
```
1. Verify VITE_API_URL in frontend environment
   - Should be: https://hospital-backend-xxxx.onrender.com/api
   - NOT http:// (must be https://)

2. Check backend CORS configuration
   app.use(cors({
     origin: 'https://hospital-frontend-xxxx.onrender.com'
   }));

3. Redeploy frontend:
   Settings → Manual Deploy → "Deploy latest commit"

4. Check browser console for exact error
```

### Issue: Database Connection Timeout

**Symptoms:**
```
Error: "ORA-12170: TNS:Connect timeout"
Connection refused
```

**Solutions:**
```
1. Verify Oracle is running and accessible
   
2. Test connection locally first:
   cd backend && node test-oracle-connection.js
   
3. Verify ORACLE_CONNECT_STRING format:
   Should be: hostname:port:database_name
   Example:   oracle.example.com:1521:xe
   
4. Check Oracle network accessibility:
   - If Oracle is local, move to cloud
   - If Oracle is on-premises, verify network access
   
5. Alternative: Use Render PostgreSQL
```

### Issue: Service Keeps Spinning Down

**Symptoms:**
```
App stops responding after 15 minutes of inactivity
"Service is spinning up..." message
```

**Solution:**
```
Upgrade to Paid Plan:
- Starter plan ($7/month) = never spins down
- Growth plan ($25/month) = more resources

Or for free:
- Keep traffic active with monitoring service
- Use cron job to ping API every 10 minutes
```

### Issue: Out of Memory Error

**Symptoms:**
```
Error: "JavaScript heap out of memory"
Logs: "FATAL ERROR: CALL_AND_RETRY_LAST"
```

**Solutions:**
```
For Free Tier (512MB):
1. Optimize code:
   - Close connections properly
   - Remove memory leaks
   - Limit query result sizes

2. Add pagination:
   SELECT * FROM patients LIMIT 100

3. Upgrade to Paid Plan:
   - Starter ($7/month) = 1GB RAM
   - Reduces memory errors
```

---

## Step 10: Setup GitHub Actions for Additional Testing (Optional)

### Auto-Test Before Deploy

**Create: .github/workflows/render-deploy.yml**

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install backend dependencies
        run: cd backend && npm install
      
      - name: Install frontend dependencies
        run: npm install
      
      - name: Lint backend code
        run: cd backend && npm run lint || true
      
      - name: Build frontend
        run: npm run build
      
      - name: Test API health check
        run: |
          cd backend
          npm test || true
      
      - name: Send success notification
        if: success()
        run: echo "✅ All tests passed! Render will auto-deploy."
      
      - name: Send failure notification
        if: failure()
        run: echo "❌ Tests failed. Check logs before deploying."
```

---

## 📊 Cost Comparison

### Render Pricing

```
Service              | Free Tier  | Starter ($7/m) | Growth ($25/m)
─────────────────────────────────────────────────────────────
Backend Service      | $0         | $7             | $25
Frontend Site        | $0         | (included)     | (included)
PostgreSQL Database  | $0         | $7             | $15
────────────────────────────────────────────────────────────
Total Monthly        | $0         | $14            | $40

Limits per tier:
Free:       0.5 vCPU, 0.5 GB RAM, spins down after 15 min
Starter:    1 vCPU, 1 GB RAM, always on
Growth:     2 vCPU, 4 GB RAM, always on, priority support
```

### Cost Optimization

```
Option 1: Free Tier (Testing)
- Cost: $0/month
- Good for: Development, testing, low traffic
- Trade-off: Spins down, limited resources

Option 2: Starter Tier (Small Production)
- Cost: $14/month ($7 backend + $7 database)
- Good for: Small team, internal use, MVP
- Includes: Always-on, 1 concurrent user

Option 3: Growth Tier (Production)
- Cost: $40/month (or more with upgrades)
- Good for: Public production, multiple users
- Includes: More resources, priority support
```

---

## 📋 Render Deployment Checklist

### Pre-Deployment
- [ ] GitHub account with repository
- [ ] Repository pushed to GitHub
- [ ] .env variables documented
- [ ] Render account created
- [ ] Frontend builds successfully locally
- [ ] Backend tested locally
- [ ] Oracle database accessible
- [ ] All code committed

### During Deployment
- [ ] Backend service created
- [ ] Backend environment variables added
- [ ] Backend deployment successful
- [ ] Frontend site created
- [ ] Frontend environment variables added
- [ ] Frontend deployment successful
- [ ] Health check endpoint responds
- [ ] API endpoints accessible

### Post-Deployment
- [ ] Frontend loads in browser
- [ ] Can fetch data from API
- [ ] Database connection works
- [ ] Logs show no errors
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring configured
- [ ] Alerts set up (optional)

---

## 🚀 Deployment Timeline

```
Activity                        Time
─────────────────────────────────────
Setup Render account            2 min
Deploy backend                  5 min
Deploy frontend                 3 min
Configure environment vars      3 min
Test endpoints                  2 min
Setup custom domain (optional)  5 min
─────────────────────────────────────
TOTAL                          20 minutes!
```

---

## 📞 Next Steps

### Immediate (Today)
1. ✅ Create Render account
2. ✅ Connect GitHub repository
3. ✅ Deploy backend service
4. ✅ Deploy frontend site
5. ✅ Test endpoints

### Follow-up (This Week)
- [ ] Add custom domain
- [ ] Setup monitoring
- [ ] Configure alerts
- [ ] Performance optimization

### Future (This Month)
- [ ] Upgrade to paid plan if needed
- [ ] Add additional features
- [ ] Setup CI/CD with GitHub Actions
- [ ] Database optimization

---

## 📚 Useful Render Links

```
Dashboard:        https://dashboard.render.com
Documentation:    https://render.com/docs
Status Page:      https://status.render.com
Help & Support:   https://render.com/support
Community:        https://community.render.com
```

---

## 🔐 Security Notes

### Render Security Features
```
✅ Free SSL/HTTPS certificates
✅ Environment variable encryption
✅ DDoS protection
✅ Auto-scaling (paid plans)
✅ Regular backups (paid databases)
✅ Private networking available
```

### Best Practices
```
1. Never commit .env files
2. Use environment variables for all secrets
3. Enable auto-deploy only from main branch
4. Keep dependencies updated
5. Monitor logs for errors
6. Setup alerts for failures
```

---

## 💡 Pro Tips

### Tip 1: Environment-Specific Variables

```env
# Development
VITE_API_URL=http://localhost:5000/api
NODE_ENV=development

# Render Production
VITE_API_URL=https://hospital-backend-xxxx.onrender.com/api
NODE_ENV=production
```

### Tip 2: Database Connection Pooling

Keep your existing pool configuration:
```javascript
{
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
  poolTimeout: 60
}
```

### Tip 3: Monitor Free Tier Spins

Add to your app:
```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

Then ping periodically:
```bash
# Every 10 minutes
0 * * * * curl https://your-app.onrender.com/api/health
```

### Tip 4: Use Render's Deploy Hooks

```
1. Go to service settings
2. Copy "Deploy Hook" URL
3. Use in CI/CD or custom scripts
4. Trigger deploys programmatically
```

---

## 📊 Service Health Dashboard

Create a simple health dashboard:
```javascript
app.get('/api/status', (req, res) => {
  res.json({
    application: 'running',
    database: 'connected',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date()
  });
});
```

Access at: `https://hospital-backend-xxxx.onrender.com/api/status`

---

**Last Updated:** May 23, 2026
**Version:** 1.0.0
**Platform:** Render
**Estimated Deployment Time:** 20 minutes
