# Heroku Deployment Guide for Django Time Tracker

This guide contains all the steps and commands needed to deploy your Django application to Heroku.

## Prerequisites

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Create a Heroku account: https://signup.heroku.com/

## Files Created/Modified

All necessary files have been created:
- ✅ `backend/Procfile` - Tells Heroku how to run your app
- ✅ `backend/requirements.txt` - Python dependencies
- ✅ `backend/runtime.txt` - Specifies Python version
- ✅ `backend/timetracker/settings.py` - Updated for production
- ✅ `.gitignore` - Updated to exclude unnecessary files

## Settings Configured

Your `settings.py` has been updated with:
- ✅ DEBUG controlled by environment variable (defaults to False in production)
- ✅ SECRET_KEY uses environment variable
- ✅ ALLOWED_HOSTS configured for production
- ✅ WhiteNoise middleware for static files
- ✅ Database configured to use PostgreSQL on Heroku
- ✅ STATIC_ROOT configured
- ✅ Security settings for production

## Deployment Steps

### 1. Login to Heroku

```bash
heroku login
```

### 2. Create a New Heroku App

```bash
# Replace 'your-app-name' with your desired app name
heroku create your-app-name
```

**Note:** If you don't specify a name, Heroku will generate one for you.

### 3. Add PostgreSQL Database

```bash
heroku addons:create heroku-postgresql:essential-0
```

### 4. Set Environment Variables

```bash
# Generate a secure secret key
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Set the secret key (replace YOUR_GENERATED_SECRET_KEY with the output above)
heroku config:set SECRET_KEY='YOUR_GENERATED_SECRET_KEY'

# Set the app name for CSRF
heroku config:set HEROKU_APP_NAME='your-app-name'

# Set allowed hosts (replace with your actual app name)
heroku config:set ALLOWED_HOSTS='your-app-name.herokuapp.com'

# Optional: Set frontend URL if you have a separate frontend
heroku config:set FRONTEND_URL='https://your-frontend-domain.com'

# For local development, you can enable DEBUG (not recommended for production)
# heroku config:set DEBUG='True'
```

### 5. Commit Changes to Git

```bash
# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Configure app for Heroku deployment"
```

### 6. Deploy to Heroku

```bash
# Push to Heroku (this will trigger the build and deployment)
git push heroku main
```

**Note:** If your main branch is named `master`, use `git push heroku master` instead.

### 7. Run Migrations on Heroku

```bash
# Migrations will run automatically via the Procfile release command
# But you can also run them manually:
heroku run python backend/manage.py migrate
```

### 8. Create a Superuser (Optional)

```bash
heroku run python backend/manage.py createsuperuser
```

### 9. Collect Static Files

```bash
# Static files are handled by WhiteNoise automatically
# But you can collect them manually if needed:
heroku run python backend/manage.py collectstatic --noinput
```

### 10. Open Your App

```bash
heroku open
```

## Environment Variables Reference

View all your configuration variables:
```bash
heroku config
```

Set a new variable:
```bash
heroku config:set VARIABLE_NAME='value'
```

Remove a variable:
```bash
heroku config:unset VARIABLE_NAME
```

## Useful Commands

### View Logs
```bash
# View recent logs
heroku logs --tail

# View specific number of lines
heroku logs -n 200
```

### Run Django Commands
```bash
# Run any Django management command
heroku run python backend/manage.py <command>

# Examples:
heroku run python backend/manage.py shell
heroku run python backend/manage.py dbshell
heroku run python backend/manage.py showmigrations
```

### Restart the App
```bash
heroku restart
```

### Scale Dynos
```bash
# Check current dyno status
heroku ps

# Scale web dynos
heroku ps:scale web=1
```

### Access Django Admin
Navigate to: `https://your-app-name.herokuapp.com/admin/`

## Redeployment

After making changes to your code:

```bash
git add .
git commit -m "Your commit message"
git push heroku main
```

The app will automatically redeploy with the new changes.

## Local Development

To test production settings locally:

```bash
# Set environment variables for local testing
export DEBUG='True'
export SECRET_KEY='your-local-secret-key'
export DATABASE_URL='sqlite:///db.sqlite3'

# Run the development server
cd backend
python manage.py runserver
```

## Troubleshooting

### Check Build Logs
```bash
heroku logs --tail
```

### Run Bash on Heroku
```bash
heroku run bash
cd backend
ls -la
```

### Database Issues
```bash
# Check database connection
heroku pg:info

# Reset database (WARNING: destroys all data)
heroku pg:reset DATABASE_URL
heroku run python backend/manage.py migrate
```

### Static Files Not Loading
```bash
# Ensure WhiteNoise is installed
pip install whitenoise

# Check settings.py has WhiteNoise in MIDDLEWARE
# Collect static files
heroku run python backend/manage.py collectstatic --noinput
```

## Common Issues and Solutions

1. **Application Error / 500 Error**
   - Check logs: `heroku logs --tail`
   - Ensure all environment variables are set correctly
   - Verify SECRET_KEY is set

2. **Static Files 404**
   - WhiteNoise should handle this automatically
   - Verify STATIC_ROOT is set in settings.py
   - Check that WhiteNoise is in MIDDLEWARE

3. **Database Connection Error**
   - Ensure PostgreSQL addon is added
   - Check DATABASE_URL is set: `heroku config:get DATABASE_URL`
   - Run migrations: `heroku run python backend/manage.py migrate`

4. **CSRF Errors**
   - Add your Heroku domain to CSRF_TRUSTED_ORIGINS
   - Set HEROKU_APP_NAME environment variable

## Production Checklist

- ✅ DEBUG = False in production
- ✅ SECRET_KEY uses environment variable
- ✅ ALLOWED_HOSTS configured
- ✅ Database configured (PostgreSQL)
- ✅ Static files configured (WhiteNoise)
- ✅ Security headers enabled
- ✅ HTTPS redirect enabled
- ✅ requirements.txt up to date
- ✅ Procfile created
- ✅ runtime.txt specifies Python version

## Additional Resources

- Heroku Django Documentation: https://devcenter.heroku.com/articles/django-app-configuration
- Heroku Python Support: https://devcenter.heroku.com/articles/python-support
- WhiteNoise Documentation: http://whitenoise.evans.io/

## Need Help?

If you encounter issues:
1. Check the logs: `heroku logs --tail`
2. Review the Heroku documentation
3. Check Django and Heroku forums

Your app should now be live at: `https://your-app-name.herokuapp.com/`
