# Azure Deployment Guide - Hospital Management System

## 🎯 Quick Start: Deploy to Azure in 30 Minutes

### Architecture Overview
```
┌──────────────────────────────────────────────────────────┐
│ Azure CDN (Content Delivery Network)                      │
│ └─ Static Frontend Assets (React Build)                   │
└──────────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────┐
│ Azure App Service                                         │
│ └─ Node.js Express Backend                                │
└──────────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────┐
│ Azure Database for Oracle                                 │
│ └─ Managed Oracle Database Service                        │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 Pre-Deployment Checklist

- [ ] Azure subscription created
- [ ] Azure CLI installed (`az --version`)
- [ ] Git repository initialized
- [ ] All code committed to Git
- [ ] .env variables documented
- [ ] Frontend build successful (`npm run build`)
- [ ] Backend tested locally
- [ ] Database verified locally

---

## Step 1: Setup Azure CLI & Login

### Install Azure CLI

**Windows (PowerShell):**
```powershell
# Using Winget
winget install Microsoft.AzureCLI

# Or download MSI from:
# https://aka.ms/InstallAzureCliWindows

# Verify installation
az --version
```

**macOS:**
```bash
# Using Homebrew
brew install azure-cli

# Verify
az --version
```

**Linux (Ubuntu/Debian):**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Verify
az --version
```

### Login to Azure

```bash
# Open browser for authentication
az login

# Expected output:
# You have logged in. Now let us find all the subscriptions to which...
# [
#   {
#     "cloudName": "AzureCloud",
#     "homeTenantId": "...",
#     "id": "your-subscription-id",
#     "isDefault": true,
#     "name": "Your Subscription Name",
#     ...
#   }
# ]

# Verify login
az account show
```

---

## Step 2: Create Azure Resource Group

```bash
# Define variables
$RESOURCE_GROUP = "hospital-mg-rg"
$LOCATION = "eastus"

# Or for macOS/Linux
export RESOURCE_GROUP="hospital-mg-rg"
export LOCATION="eastus"

# Create resource group
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Expected output:
# {
#   "id": "/subscriptions/.../resourceGroups/hospital-mg-rg",
#   "location": "eastus",
#   "managedBy": null,
#   "name": "hospital-mg-rg",
#   "properties": {
#     "provisioningState": "Succeeded"
#   },
#   ...
# }
```

---

## Step 3: Create Azure Database for Oracle

### Option A: Oracle Database Service (Recommended for Production)

```bash
# Define variables
$ORACLE_ADMIN = "oracleadmin"
$ORACLE_PASSWORD = "SecureP@ssw0rd123!"  # Change this!

# Create Oracle Database
az oracledatabase infrastructure \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Note: Azure Database for Oracle is currently in preview
# Alternative: Use Oracle Cloud Database or consider PostgreSQL/MySQL for now
```

### Option B: Oracle VM (Alternative - More Control)

```bash
# Create VM with Oracle Database
az vm create \
  --resource-group $RESOURCE_GROUP \
  --name oracle-vm \
  --image Oracle:oracle-database-19c:19.3:latest \
  --size Standard_D4s_v3 \
  --admin-username azureuser \
  --generate-ssh-keys \
  --os-disk-size-gb 150 \
  --data-disk-size-gb 300

# This will take 5-10 minutes
```

### Option C: Docker Container with Oracle on Azure Container Instances

```bash
# Create storage account for data
az storage account create \
  --resource-group $RESOURCE_GROUP \
  --name oracledbstg$(date +%s) \
  --sku Standard_LRS

# Create container group with Oracle
az container create \
  --resource-group $RESOURCE_GROUP \
  --name oracle-container \
  --image gvenzl/oracle-xe:21c \
  --cpu 4 \
  --memory 8 \
  --environment-variables ORACLE_PASSWORD=SecureP@ssw0rd123! \
  --ports 1521

# Get connection info
az container show \
  --resource-group $RESOURCE_GROUP \
  --name oracle-container \
  --query ipAddress.ip \
  --output tsv
```

---

## Step 4: Create Backend App Service

```bash
# Define variables
$APP_SERVICE_PLAN = "hospital-mgmt-plan"
$BACKEND_APP = "hospital-backend-app"
$SKU = "B1"  # Basic tier - $12/month

# Create App Service Plan
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku $SKU \
  --is-linux

# Create Web App (Backend)
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $BACKEND_APP \
  --runtime "node|18-lts"

# Expected output includes:
# "defaultHostName": "hospital-backend-app.azurewebsites.net"

# Set environment variables
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --settings \
    NODE_ENV=production \
    ORACLE_USER=system \
    ORACLE_PASSWORD="SecureP@ssw0rd123!" \
    ORACLE_CONNECT_STRING="oracle-host:1521:xe" \
    PORT=8080

# Get publish profile
az webapp deployment profile show \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP
```

---

## Step 5: Create Frontend Static Web App

```bash
# Define variables
$FRONTEND_APP = "hospital-frontend-app"

# Create Static Web App
az staticwebapp create \
  --name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP \
  --source https://github.com/your-username/hospital-management-system \
  --branch main \
  --login-with-github \
  --output-location dist

# Configure environment for frontend
az staticwebapp appsettings set \
  --name $FRONTEND_APP \
  --settings VITE_API_URL=https://$BACKEND_APP.azurewebsites.net/api
```

---

## Step 6: Deploy Backend Code

### Option A: Deploy from Local Machine

```bash
# Navigate to backend directory
cd backend

# Create deployment package
npm run build  # If needed

# Deploy using ZIP deployment
az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --src backend.zip

# Or use direct push (easier)
az webapp up \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --runtime "node|18-lts"
```

### Option B: Deploy from Git Repository

```bash
# Configure Git deployment
az webapp deployment source config-local-git \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP

# Add remote to your Git
git remote add azure https://<username>@<app-name>.scm.azurewebsites.net/<app-name>.git

# Deploy
git push azure main

# Monitor deployment
az webapp deployment source show \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP
```

### Option C: Deploy Using GitHub Actions

**Create .github/workflows/deploy-azure.yml:**
```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install backend dependencies
        run: cd backend && npm install
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: hospital-backend-app
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: backend
```

---

## Step 7: Deploy Frontend Code

### Option A: Build & Upload Manually

```bash
# Build frontend
npm run build

# Create storage account for static files
az storage account create \
  --resource-group $RESOURCE_GROUP \
  --name hospitalmgstg$(date +%s) \
  --sku Standard_LRS

# Get storage account connection string
$STORAGE_CONNECTION_STRING = az storage account show-connection-string \
  --resource-group $RESOURCE_GROUP \
  --name hospitalmgstg<timestamp> \
  --query connectionString

# Create container
az storage container create \
  --name "$web" \
  --connection-string $STORAGE_CONNECTION_STRING

# Upload files
az storage blob upload-batch \
  --destination "$web" \
  --source "dist" \
  --connection-string $STORAGE_CONNECTION_STRING
```

### Option B: Use GitHub Pages (Easiest)

```bash
# Push built dist folder to gh-pages branch
npm run build
git add dist -f
git commit -m "Deploy frontend"
git push origin dist:gh-pages
```

---

## Step 8: Configure Database Connection

### Test Connection from App Service

```bash
# SSH into backend app service
az webapp create-remote-connection \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP

# Run test connection in the remote shell
node test-oracle-connection.js
```

### Update Connection String

```bash
# If Oracle is in Azure Container Instances
$ORACLE_IP = az container show \
  --resource-group $RESOURCE_GROUP \
  --name oracle-container \
  --query ipAddress.ip \
  --output tsv

# Update App Settings
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --settings ORACLE_CONNECT_STRING="$ORACLE_IP:1521:xe"
```

---

## Step 9: Configure Custom Domain (Optional)

```bash
# Add custom domain to Static Web App
az staticwebapp hostname set \
  --name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP \
  --hostname "app.yourdomain.com"

# Add custom domain to App Service
az webapp config hostname add \
  --resource-group $RESOURCE_GROUP \
  --webapp-name $BACKEND_APP \
  --hostname "api.yourdomain.com"

# Update DNS records at your domain registrar:
# app.yourdomain.com  CNAME  hospital-frontend-app.azurestaticapps.net
# api.yourdomain.com  CNAME  hospital-backend-app.azurewebsites.net
```

---

## Step 10: Enable SSL/TLS

```bash
# Azure automatically enables HTTPS with free certificates
# Just ensure your app redirects HTTP to HTTPS

# Verify SSL certificate
az webapp config ssl show \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP
```

---

## 📊 Monitoring & Logging

### View Application Logs

```bash
# Stream backend logs in real-time
az webapp log tail \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --provider "azurewebsites"

# View application metrics
az monitor metrics list \
  --resource /subscriptions/your-subscription-id/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$BACKEND_APP \
  --metric "Requests" \
  --start-time 2024-05-23T00:00:00Z \
  --end-time 2024-05-24T00:00:00Z
```

### Set Up Alerts

```bash
# Create alert for high CPU usage
az monitor metrics alert create \
  --name "High-CPU-Alert" \
  --resource-group $RESOURCE_GROUP \
  --scopes /subscriptions/your-id/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$BACKEND_APP \
  --condition "avg CpuPercentage > 80" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action add action-group-id
```

---

## 🔐 Security Best Practices

### 1. Secure Secrets Management

```bash
# Use Azure Key Vault instead of app settings
az keyvault create \
  --resource-group $RESOURCE_GROUP \
  --name hospital-keyvault-$(date +%s)

# Store secrets
az keyvault secret set \
  --vault-name hospital-keyvault \
  --name "oracle-password" \
  --value "SecureP@ssw0rd123!"

# Update app to reference Key Vault
az webapp identity assign \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP

# Grant access
az keyvault set-policy \
  --name hospital-keyvault \
  --object-id <app-principal-id> \
  --secret-permissions get list
```

### 2. Enable Authentication

```bash
# Enable Azure AD authentication for backend
az webapp auth update \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --enabled true \
  --action LoginWithAzureIdentity
```

### 3. Configure CORS

```bash
# Update backend code with correct origin
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --settings FRONTEND_URL=https://$FRONTEND_APP.azurestaticapps.net
```

---

## 💰 Cost Optimization

### Estimated Monthly Costs

| Service | SKU | Cost |
|---------|-----|------|
| App Service Plan | Basic (B1) | $12 |
| Static Web App | Free tier | $0 |
| Database (Oracle VM) | Standard_D2s_v3 | $100 |
| Storage (static files) | Standard LRS | $5 |
| Bandwidth (outbound) | 1GB free/month | $0-5 |
| **Total Monthly** | | **$117-122** |

### Cost-Saving Tips

```bash
# 1. Use Free/Shared tier for development
az appservice plan create \
  --name free-plan \
  --resource-group $RESOURCE_GROUP \
  --sku F1  # Free tier

# 2. Scale down database when not needed
az container stop \
  --resource-group $RESOURCE_GROUP \
  --name oracle-container

# 3. Use reserved instances for long-term

# 4. Enable auto-shutdown for VMs
az vm auto-shutdown --resource-group $RESOURCE_GROUP --name oracle-vm
```

---

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Workflow

**File: .github/workflows/azure-deploy.yml**
```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: |
          npm install
          cd backend && npm install && cd ..
      
      - name: Build frontend
        run: npm run build
      
      - name: Lint backend
        run: cd backend && npm run lint
      
      - name: Deploy backend
        if: github.ref == 'refs/heads/main'
        uses: azure/webapps-deploy@v2
        with:
          app-name: hospital-backend-app
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: backend
      
      - name: Deploy frontend
        if: github.ref == 'refs/heads/main'
        uses: azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "dist"
          output_location: ""
```

---

## 🧪 Testing Deployment

### Health Checks

```bash
# Check backend is running
curl https://$BACKEND_APP.azurewebsites.net/api/health

# Check frontend is accessible
curl https://$FRONTEND_APP.azurestaticapps.net

# Test API connectivity
curl -X GET https://$BACKEND_APP.azurewebsites.net/api/patients
```

### Performance Testing

```bash
# Install Apache Bench
apt-get install apache2-utils  # Linux
brew install httpd              # macOS

# Run performance test
ab -n 1000 -c 10 https://$BACKEND_APP.azurewebsites.net/api/patients
```

---

## 🆘 Troubleshooting

### App Service Won't Start

```bash
# Check deployment logs
az webapp deployment source show \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP

# Stream live logs
az webapp log tail \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --provider "azurewebsites"

# Restart the app
az webapp restart \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP
```

### Database Connection Timeout

```bash
# Check network connectivity
az network nsg show \
  --resource-group $RESOURCE_GROUP \
  --name oracle-nsg

# Add firewall rule
az sql server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --server hospital-oracle \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### High Costs

```bash
# Check current usage
az billing statement list

# Delete unused resources
az group delete --name $RESOURCE_GROUP --yes
```

---

## 📝 Deployment Checklist

- [ ] Azure CLI installed and logged in
- [ ] Resource group created
- [ ] Database service created and accessible
- [ ] Backend App Service created
- [ ] Frontend Static Web App created
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] SSL/TLS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring and alerts set up
- [ ] Backup strategy configured
- [ ] Team members have access
- [ ] Documentation updated

---

## 📚 Useful Azure Commands Reference

```bash
# Resource Groups
az group list                               # List all resource groups
az group delete --name $RG                  # Delete resource group

# App Services
az webapp list                              # List all web apps
az webapp config appsettings list           # View app settings
az webapp restart --name $APP               # Restart app
az webapp deployment slot create            # Create staging slot

# Databases
az sql server list                          # List SQL servers
az container list                           # List containers
az vm list                                  # List virtual machines

# Monitoring
az monitor log-analytics workspace list     # List Log Analytics workspaces
az metrics list-definitions                 # List available metrics
```

---

**Last Updated:** May 23, 2026
**Version:** 1.0.0
