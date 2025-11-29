#!/bin/bash

# Render.com Deployment Script for Django Time Tracker
# This script helps you deploy to Render.com (FREE hosting)

set -e

echo "========================================="
echo "Render.com FREE Deployment Guide"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

echo "Render.com offers FREE hosting for Django apps!"
echo ""
print_info "Note: Free tier may have cold starts after 15 min inactivity"
echo ""

# Check if git repo exists
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
    print_success "Git repository initialized"
fi

# Generate SECRET_KEY
echo ""
echo "========================================="
echo "Step 1: Generate SECRET_KEY"
echo "========================================="
if command -v python3 &> /dev/null; then
    echo ""
    echo "Your SECRET_KEY (save this!):"
    echo "----------------------------------------"
    SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
    echo "$SECRET_KEY"
    echo "----------------------------------------"
    print_success "SECRET_KEY generated"
else
    echo "Python not found. Generate manually later."
fi

echo ""
echo "========================================="
echo "Step 2: Push Code to GitHub"
echo "========================================="
echo ""
print_info "Render deploys from GitHub repositories"
echo ""
read -p "Have you already pushed to GitHub? (y/n): " PUSHED

if [[ $PUSHED != "y" ]]; then
    echo ""
    echo "You need to push your code to GitHub first:"
    echo ""
    echo "1. Create a new repository on GitHub"
    echo "2. Run these commands:"
    echo ""
    echo "   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git"
    echo "   git branch -M main"
    echo "   git add ."
    echo "   git commit -m \"Ready for Render deployment\""
    echo "   git push -u origin main"
    echo ""
    read -p "Press Enter when you've pushed to GitHub..."
fi

print_success "Code is on GitHub"

echo ""
echo "========================================="
echo "Step 3: Deploy on Render.com"
echo "========================================="
echo ""
echo "Follow these steps in your browser:"
echo ""
echo "1. Go to: https://render.com/"
echo "2. Sign up / Log in with GitHub"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect your repository"
echo ""
print_info "Render will auto-detect your Django app!"
echo ""
echo "5. Configure Build Settings:"
echo "   Name: your-app-name"
echo "   Build Command: pip install -r backend/requirements.txt"
echo "   Start Command: cd backend && gunicorn timetracker.wsgi --log-file -"
echo ""
echo "6. Add Environment Variables:"
echo "   Click 'Advanced' → 'Add Environment Variable'"
echo ""
if [ -n "$SECRET_KEY" ]; then
    echo "   SECRET_KEY = $SECRET_KEY"
else
    echo "   SECRET_KEY = [your-generated-key]"
fi
echo "   DEBUG = False"
echo "   ALLOWED_HOSTS = your-app-name.onrender.com"
echo ""
echo "7. Click 'Create Web Service'"
echo ""
read -p "Press Enter after creating the web service..."

print_success "Web Service created"

echo ""
echo "========================================="
echo "Step 4: Add PostgreSQL Database (FREE)"
echo "========================================="
echo ""
echo "1. In Render Dashboard, click 'New +' → 'PostgreSQL'"
echo "2. Name: your-app-database"
echo "3. Select 'Free' plan"
echo "4. Click 'Create Database'"
echo ""
read -p "Press Enter after creating the database..."

echo ""
echo "5. Copy the 'Internal Database URL' from your database page"
echo "6. Go back to your Web Service → 'Environment'"
echo "7. Add new variable:"
echo "   DATABASE_URL = [paste-internal-database-url]"
echo "8. Save and trigger a new deploy"
echo ""
read -p "Press Enter after adding DATABASE_URL..."

print_success "Database configured"

echo ""
echo "========================================="
echo "Step 5: Run Migrations"
echo "========================================="
echo ""
print_info "After deployment completes, you need to run migrations"
echo ""
echo "Option 1: Add to your render.yaml (automatic)"
echo "Option 2: Use Render Shell (manual)"
echo ""
echo "For Render Shell:"
echo "1. Go to your Web Service page"
echo "2. Click 'Shell' tab"
echo "3. Run: cd backend && python manage.py migrate"
echo "4. Run: python manage.py createsuperuser (optional)"
echo ""
read -p "Press Enter after running migrations..."

print_success "Migrations completed"

echo ""
echo "========================================="
echo "🎉 Deployment Complete!"
echo "========================================="
echo ""
echo "Your app is deploying at:"
echo "https://your-app-name.onrender.com/"
echo ""
echo "Admin panel:"
echo "https://your-app-name.onrender.com/admin/"
echo ""
print_success "All done!"
echo ""
print_info "Note: First request may take 30-60 seconds (cold start)"
print_info "Auto-deploys on every git push to main branch"
echo ""
echo "To update your app:"
echo "  git add ."
echo "  git commit -m \"Your changes\""
echo "  git push origin main"
echo ""
echo "Render will automatically deploy the changes!"
echo ""
