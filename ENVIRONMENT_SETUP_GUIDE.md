# Environment Setup & Local Development Guide

## 🛠️ Prerequisites & Installation

### System Requirements

**Operating System:**
- Windows 10/11 (64-bit) / macOS 10.15+ / Ubuntu 20.04+

**Required Software:**
- Node.js 18+ LTS
- npm 9+ or yarn
- Oracle Instant Client 21c or higher
- Git
- A code editor (VS Code recommended)

---

## 1️⃣ Install Node.js

### Windows
```bash
1. Download from https://nodejs.org/
2. Download LTS version (18.x or 20.x)
3. Run installer and follow prompts
4. Accept default options
5. Verify installation:
   node --version    # Should show v18.x.x or v20.x.x
   npm --version     # Should show 9.x.x or higher
```

### macOS
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org/
# Then verify:
node --version
npm --version
```

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

---

## 2️⃣ Install Oracle Instant Client

### Windows Installation

**Step 1: Download**
```
1. Visit: https://www.oracle.com/database/technologies/instant-client/downloads.html
2. Select: Oracle Instant Client for Microsoft Windows (x64)
3. Choose version: 21.13 (recommended) or latest
4. Download file: instantclient-basic-windows.x64-21.13.0.0.0dbru.zip
```

**Step 2: Extract & Setup**
```bash
# Extract to: C:\instantclient_21_13

# Set environment variables:
1. Right-click "This PC" → Properties
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", click "New"
   - Variable name: ORACLE_HOME
   - Variable value: C:\instantclient_21_13
5. Select PATH and click "Edit"
   - Add: C:\instantclient_21_13
6. Click OK and restart terminal/IDE

# Verify in new terminal:
echo %ORACLE_HOME%
# Should output: C:\instantclient_21_13
```

**Step 3: Verify Installation**
```bash
# In command prompt or PowerShell
cd C:\instantclient_21_13
dir
# Should show: adrci.exe, tnslsnr.exe, sqlplus.exe, etc.

# Test connection (need running Oracle database):
sqlplus /nolog
# Type: connect system/password@localhost:1521:xe
```

### macOS Installation

```bash
# Using Homebrew
brew tap oracle/instant-client
brew install oracle-instantclient

# Or manually:
1. Download: https://www.oracle.com/database/technologies/instant-client/macos-intel-downloads.html
2. Extract to: /usr/local/instantclient_21_13
3. Create symbolic links:
   cd /usr/local/instantclient_21_13
   ln -s libclntsh.dylib.21.1 libclntsh.dylib
   ln -s libocci.dylib.21.1 libocci.dylib

# Add to bash/zsh profile:
echo 'export ORACLE_HOME=/usr/local/instantclient_21_13' >> ~/.zshrc
echo 'export DYLD_LIBRARY_PATH=/usr/local/instantclient_21_13:$DYLD_LIBRARY_PATH' >> ~/.zshrc
source ~/.zshrc

# Verify:
echo $ORACLE_HOME
```

### Linux (Ubuntu/Debian) Installation

```bash
# Install dependencies
sudo apt-get install libaio1 libaio-dev

# Download Instant Client
wget https://download.oracle.com/otn_software/linux/instantclient/2113000/instantclient-basic-linux.x64-21.13.0.0.0dbru.zip

# Extract
unzip instantclient-basic-linux.x64-21.13.0.0.0dbru.zip
sudo mv instantclient_21_13 /opt/oracle/instantclient

# Configure library paths
echo "/opt/oracle/instantclient" | sudo tee -a /etc/ld.so.conf
sudo ldconfig

# Verify
ls /opt/oracle/instantclient/
```

---

## 3️⃣ Setup Oracle Database

### Option A: Local Oracle Database (XE - Express Edition)

#### Windows
```bash
# Download Oracle 21c XE from:
# https://www.oracle.com/database/technologies/xe-downloads.html

# Run installer and follow wizard:
1. Accept License Agreement
2. Choose installation directory
3. Set password for SYS and SYSTEM users (remember this!)
4. Select "Configure as Oracle database" (recommended)
5. Complete installation

# Verify service is running:
1. Services app (services.msc)
2. Look for "OracleServiceXE" (should be Running)
3. Look for "OracleXETNSListener" (should be Running)

# Test connection:
sqlplus system/your_password@localhost:1521:xe
# Type: SELECT * FROM v$version;
# Type: EXIT
```

#### macOS (Docker Recommended)
```bash
# Install Docker if not already installed

# Pull Oracle XE image
docker pull gvenzl/oracle-xe:21c

# Run Oracle container
docker run -d \
  --name oracle-xe \
  -p 1521:1521 \
  -p 5500:5500 \
  -e ORACLE_PASSWORD=YourSecurePassword \
  gvenzl/oracle-xe:21c

# Wait 60 seconds for container to start

# Verify
docker logs oracle-xe | grep "Database is ready"

# Connect
sqlplus system/YourSecurePassword@localhost:1521:xe
```

#### Linux (Ubuntu/Debian)
```bash
# Using Docker (easiest)
docker pull gvenzl/oracle-xe:21c

docker run -d \
  --name oracle-xe \
  -p 1521:1521 \
  -e ORACLE_PASSWORD=YourSecurePassword \
  gvenzl/oracle-xe:21c

# Wait for startup
docker logs -f oracle-xe | grep "Database is ready"
```

### Option B: Oracle Cloud Database (Remote)

```bash
# If using Oracle Cloud:
1. Create Oracle Cloud account
2. Provision Oracle Autonomous Database or Database Cloud Service
3. Download wallet file (contains connection credentials)
4. Extract wallet to secure location
5. Update ORACLE_CONNECT_STRING to point to cloud database
```

---

## 4️⃣ Clone & Setup Project

### Clone Repository
```bash
# Navigate to your projects folder
cd C:\Projects
# or
cd ~/Projects

# Clone the repository
git clone https://github.com/your-repo/hospital-management-system.git
cd hospital-management-system
```

### Install Backend Dependencies
```bash
cd backend

# Install packages
npm install

# Verify oracledb is installed
npm list oracledb
# Should show: oracledb@6.3.0 or higher
```

### Install Frontend Dependencies
```bash
cd ..

# Install packages
npm install
```

---

## 5️⃣ Configure Environment Variables

### Backend Configuration

**Create backend/.env file:**
```bash
# Windows
# Copy the template
copy backend\.env.example backend\.env

# Or create manually
notepad backend\.env
```

**backend/.env Content:**
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Oracle Database Configuration
ORACLE_USER=system
ORACLE_PASSWORD=your_oracle_password_here
ORACLE_CONNECT_STRING=localhost:1521:xe

# Oracle Client Path (Set based on your OS)
# Windows
ORACLE_CLIENT_PATH=C:\\instantclient_21_13

# macOS
# ORACLE_CLIENT_PATH=/usr/local/instantclient_21_13

# Linux
# ORACLE_CLIENT_PATH=/opt/oracle/instantclient

# Optional: Frontend URL (for CORS in production)
FRONTEND_URL=http://localhost:5173

# Optional: Logging
LOG_LEVEL=debug
```

**Important Notes:**
- Replace `your_oracle_password_here` with your actual SYSTEM password
- Use correct path for your OS and Oracle version
- Keep this file secret (add to .gitignore)

### Frontend Configuration

**Create .env file in root:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Hospital Management System
```

---

## 6️⃣ Verify Database Connection

### Test Script

**Create backend/test-oracle-connection.js:**
```javascript
import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔗 Testing Oracle Connection...\n');
    
    // Initialize Oracle Client
    console.log(`📍 Initializing Oracle Client from: ${process.env.ORACLE_CLIENT_PATH}`);
    oracledb.initOracleClient({ 
      libDir: process.env.ORACLE_CLIENT_PATH 
    });
    
    // Get connection
    console.log(`🔐 Connecting as: ${process.env.ORACLE_USER}`);
    console.log(`📌 Connect String: ${process.env.ORACLE_CONNECT_STRING}\n`);
    
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING
    });
    
    console.log('✅ Connection Successful!\n');
    
    // Get Oracle version
    const result = await connection.execute('SELECT * FROM v$version WHERE ROWNUM = 1');
    console.log(`Oracle Version: ${result.rows[0][0]}\n`);
    
    // Close connection
    await connection.close();
    console.log('✅ All tests passed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    console.error('🔍 Common issues:');
    console.error('   - Oracle service not running');
    console.error('   - Wrong password');
    console.error('   - Instant Client not installed');
    console.error('   - ORACLE_CLIENT_PATH environment variable not set');
    process.exit(1);
  }
}

testConnection();
```

**Run the test:**
```bash
cd backend
node test-oracle-connection.js

# Expected output:
# 🔗 Testing Oracle Connection...
# 📍 Initializing Oracle Client...
# 🔐 Connecting as: system
# ✅ Connection Successful!
# Oracle Version: Oracle Database 21c Express Edition Release 21.0.0.0.0 ...
# ✅ All tests passed!
```

---

## 7️⃣ Start Development Servers

### Terminal 1: Backend Server
```bash
cd backend

# Run in development mode with auto-reload
npm run dev

# Expected output:
# ========================================
# Hospital Management System - Backend
# ========================================
# 
# ✓ Oracle Connection Pool Created Successfully
# ✓ All tables created/verified successfully
# 
# Server running at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### Terminal 2: Frontend Server
```bash
# In project root directory (not backend folder)
npm run dev

# Expected output:
# 
# VITE v8.0.12  ready in XXX ms
#
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

### Open in Browser
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
API:      http://localhost:5000/api
Health:   http://localhost:5000/api/health
```

---

## 8️⃣ Verify Everything is Working

### API Health Check
```bash
# Test in new terminal
curl http://localhost:5000/api/health

# Expected response:
# {"status":"Server is running","timestamp":"2024-05-23T..."}
```

### Test API Endpoints
```bash
# Get all patients
curl http://localhost:5000/api/patients

# Add a patient (requires POST with JSON data)
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "id": 999,
    "name": "Test Patient",
    "age": 35,
    "gender": "Male",
    "email": "test@hospital.com"
  }'
```

### Test Frontend
```
1. Open http://localhost:5173 in browser
2. Navigate to Patients page
3. Should see sample patients loaded from database
4. Try adding a new patient
5. Check if it appears in the list
```

---

## 🐛 Troubleshooting

### Issue: Oracle Connection Failed

**Symptoms:**
```
❌ Error: ORA-12514: TNS:listener does not currently know of service requested
```

**Solutions:**
```bash
# 1. Check if Oracle service is running
Windows:
  services.msc
  Look for "OracleServiceXE" and "OracleXETNSListener"
  
macOS/Linux (Docker):
  docker ps | grep oracle-xe
  # If not running:
  docker start oracle-xe

# 2. Verify connection string
# Should be: localhost:1521:xe (for local XE database)

# 3. Check if port 1521 is open
netstat -an | grep 1521  # Windows
lsof -i :1521            # macOS/Linux

# 4. Restart Oracle service
Windows:
  services.msc → OracleServiceXE → Restart
```

### Issue: Instant Client Not Found

**Symptoms:**
```
❌ Error: Cannot load OracleDB driver from directory
```

**Solutions:**
```bash
# 1. Verify installation
Windows:
  dir C:\instantclient_21_13
  
macOS:
  ls /usr/local/instantclient_21_13
  
Linux:
  ls /opt/oracle/instantclient

# 2. Update ORACLE_CLIENT_PATH in .env

# 3. Verify environment variables
Windows:
  echo %ORACLE_HOME%
  
macOS/Linux:
  echo $ORACLE_HOME
```

### Issue: Port Already in Use

**Symptoms:**
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
```bash
# Windows: Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux: Find and kill process
lsof -i :5000
kill -9 <PID>

# Or use different port in .env:
PORT=5001
```

### Issue: Database Tables Not Created

**Symptoms:**
```
❌ Error: ORA-00942: table or view does not exist
```

**Solutions:**
```bash
# 1. Check database connection is working
cd backend && node test-oracle-connection.js

# 2. Restart backend server (tables auto-create on startup)
npm run dev

# 3. Manually create tables using SQL:
sqlplus system/password@localhost:1521:xe
# Then paste SQL from backend/config/initDatabase.js
```

---

## ✅ Development Workflow

### Daily Development Routine

```bash
# 1. Start Oracle service (if needed)
docker start oracle-xe

# 2. Terminal 1: Start Backend
cd backend
npm run dev

# 3. Terminal 2: Start Frontend
npm run dev

# 4. Open http://localhost:5173 in browser

# 5. Make code changes - both will auto-reload

# 6. Test in browser immediately

# 7. Check console for errors
```

### Running Tests

```bash
# Backend tests (when available)
cd backend
npm test

# Frontend tests (when available)
npm test

# Lint code
npm run lint
```

### Building for Production

```bash
# Frontend build
npm run build
# Creates dist/ folder with optimized build

# Backend (no build needed, uses ES6 directly)
# Just ensure NODE_ENV=production in .env
```

---

## 📚 Quick Reference Commands

```bash
# Development
npm run dev              # Start all (from root)
npm run dev             # Backend only (from backend/)

# Building
npm run build           # Build frontend for production

# Linting
npm run lint            # Check code quality

# Database
npm test-connection     # Test Oracle connection

# Deployment
npm start               # Run in production mode (backend)

# Cleanup
npm install             # Install all dependencies
rm -rf node_modules     # Remove dependencies
npm cache clean --force # Clear npm cache
```

---

## 📝 Important Notes

1. **Security**: Never commit .env files or passwords to Git
2. **Passwords**: Use strong passwords for Oracle accounts
3. **Ports**: Ensure 5000 (backend) and 5173 (frontend) are available
4. **Database**: Backup important data before testing
5. **Versions**: Keep Oracle Instant Client version consistent with database version

---

**Last Updated:** May 23, 2026
**Version:** 1.0.0
