# Quick Heroku Deployment Reference

## 🚀 Quick Start (Copy & Paste)

### Option 1: Use the Automated Script (Recommended)

```bash
# Run the deployment script
./deploy_to_heroku.sh
```

The script will guide you through the entire process interactively.

---

### Option 2: Manual Deployment

#### 1. Login to Heroku
```bash
heroku login
```

#### 2. Create App
```bash
# Replace 'my-timetracker-app' with your desired name
heroku create my-timetracker-app
```

#### 3. Add PostgreSQL
```bash
heroku addons:create heroku-postgresql:essential-0
```

#### 4. Generate and Set Secret Key
```bash
# Generate secret key
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Copy the output and use it below (replace YOUR_SECRET_KEY)
heroku config:set SECRET_KEY='YOUR_SECRET_KEY'
```

#### 5. Set Other Environment Variables
```bash
# Replace 'my-timetracker-app' with your actual app name
heroku config:set HEROKU_APP_NAME='my-timetracker-app'
heroku config:set ALLOWED_HOSTS='my-timetracker-app.herokuapp.com'

# Optional: Set frontend URL if you have a separate frontend
heroku config:set FRONTEND_URL='https://your-frontend-url.com'
```

#### 6. Commit and Deploy
```bash
# Commit all changes
git add .
git commit -m "Configure for Heroku deployment"

# Deploy to Heroku
git push heroku main
```

#### 7. Create Superuser (Optional)
```bash
heroku run python backend/manage.py createsuperuser
```

#### 8. Open Your App
```bash
heroku open
```

---

## 📋 Essential Commands

### View Logs
```bash
heroku logs --tail
```

### Run Migrations
```bash
heroku run python backend/manage.py migrate
```

### Access Django Shell
```bash
heroku run python backend/manage.py shell
```

### Restart App
```bash
heroku restart
```

### View Environment Variables
```bash
heroku config
```

### Set Environment Variable
```bash
heroku config:set VARIABLE_NAME='value'
```

---

## 🔄 Redeployment After Code Changes

```bash
git add .
git commit -m "Your changes"
git push heroku main
```

---

## 🐛 Troubleshooting Quick Fixes

### Check Logs
```bash
heroku logs --tail
```

### Reset Database (⚠️ Deletes all data)
```bash
heroku pg:reset DATABASE_URL
heroku run python backend/manage.py migrate
```

### Restart App
```bash
heroku restart
```

---

## 📦 What Was Done

All files have been created and configured:

✅ **backend/Procfile** - Heroku process configuration
✅ **backend/requirements.txt** - Python dependencies  
✅ **backend/runtime.txt** - Python version (3.12.3)
✅ **backend/timetracker/settings.py** - Production settings
✅ **.gitignore** - Updated for Django/Heroku
✅ **deploy_to_heroku.sh** - Automated deployment script
✅ **HEROKU_DEPLOYMENT.md** - Complete deployment guide

### Settings Configured:
- DEBUG = False (production safe)
- SECRET_KEY from environment variable
- ALLOWED_HOSTS configured
- WhiteNoise for static files
- PostgreSQL database support
- Security headers enabled
- CORS configured

---

## 🎯 Your App URLs

After deployment, your app will be available at:

- **Main App:** `https://your-app-name.herokuapp.com/`
- **API Base:** `https://your-app-name.herokuapp.com/api/`
- **Admin:** `https://your-app-name.herokuapp.com/admin/`

---

## 💡 Tips

1. **Always check logs first** when something goes wrong
2. **Use environment variables** for sensitive data
3. **Test locally** with production settings before deploying
4. **Keep requirements.txt updated** when adding new packages
5. **Commit before deploying** to avoid issues

---

## 🆘 Need Help?

- Full Guide: See `HEROKU_DEPLOYMENT.md`
- Heroku Docs: https://devcenter.heroku.com/articles/django-app-configuration
- View Logs: `heroku logs --tail`
