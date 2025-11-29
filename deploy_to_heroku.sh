#!/bin/bash

# Heroku Deployment Script for Django Time Tracker
# This script automates the deployment process

set -e  # Exit on any error

echo "========================================="
echo "Django to Heroku Deployment Script"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    print_error "Heroku CLI is not installed!"
    echo "Please install it from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi
print_success "Heroku CLI is installed"

# Check if logged into Heroku
if ! heroku auth:whoami &> /dev/null; then
    print_warning "You are not logged into Heroku"
    echo "Logging you in..."
    heroku login
fi
print_success "Logged into Heroku"

# Ask for app name
echo ""
read -p "Enter your Heroku app name (or press Enter to create new): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "Creating a new Heroku app..."
    heroku create
    APP_NAME=$(heroku apps:info | grep "=== " | awk '{print $2}')
    print_success "Created new app: $APP_NAME"
else
    # Check if app exists
    if heroku apps:info --app "$APP_NAME" &> /dev/null; then
        print_success "Using existing app: $APP_NAME"
    else
        echo "Creating app: $APP_NAME"
        heroku create "$APP_NAME"
        print_success "Created app: $APP_NAME"
    fi
fi

# Add PostgreSQL if not already added
echo ""
echo "Checking for PostgreSQL addon..."
if heroku addons --app "$APP_NAME" | grep -q "heroku-postgresql"; then
    print_success "PostgreSQL addon already exists"
else
    echo "Adding PostgreSQL addon..."
    heroku addons:create heroku-postgresql:essential-0 --app "$APP_NAME"
    print_success "PostgreSQL addon added"
fi

# Generate and set SECRET_KEY
echo ""
echo "Setting environment variables..."

# Check if SECRET_KEY exists
if heroku config:get SECRET_KEY --app "$APP_NAME" | grep -q "."; then
    print_warning "SECRET_KEY already set"
else
    echo "Generating new SECRET_KEY..."
    if command -v python3 &> /dev/null; then
        SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
        heroku config:set SECRET_KEY="$SECRET_KEY" --app "$APP_NAME"
        print_success "SECRET_KEY generated and set"
    else
        print_error "Python 3 not found. Please set SECRET_KEY manually:"
        echo "heroku config:set SECRET_KEY='your-secret-key' --app $APP_NAME"
    fi
fi

# Set HEROKU_APP_NAME
heroku config:set HEROKU_APP_NAME="$APP_NAME" --app "$APP_NAME"
print_success "HEROKU_APP_NAME set"

# Set ALLOWED_HOSTS
heroku config:set ALLOWED_HOSTS="$APP_NAME.herokuapp.com" --app "$APP_NAME"
print_success "ALLOWED_HOSTS set"

# Ask about frontend URL
echo ""
read -p "Do you have a separate frontend URL? (y/n): " HAS_FRONTEND
if [[ $HAS_FRONTEND == "y" ]]; then
    read -p "Enter your frontend URL (e.g., https://example.com): " FRONTEND_URL
    heroku config:set FRONTEND_URL="$FRONTEND_URL" --app "$APP_NAME"
    print_success "FRONTEND_URL set to: $FRONTEND_URL"
fi

# Add Heroku remote if not exists
echo ""
echo "Setting up git remote..."
if git remote | grep -q "heroku"; then
    print_warning "Heroku remote already exists, updating it..."
    git remote set-url heroku "https://git.heroku.com/$APP_NAME.git"
else
    git remote add heroku "https://git.heroku.com/$APP_NAME.git"
fi
print_success "Git remote configured"

# Commit changes if there are any
echo ""
echo "Checking for uncommitted changes..."
if [[ -n $(git status -s) ]]; then
    print_warning "You have uncommitted changes"
    read -p "Do you want to commit them now? (y/n): " COMMIT_NOW
    if [[ $COMMIT_NOW == "y" ]]; then
        git add .
        read -p "Enter commit message: " COMMIT_MSG
        git commit -m "$COMMIT_MSG"
        print_success "Changes committed"
    else
        print_error "Cannot deploy with uncommitted changes. Please commit them first."
        exit 1
    fi
else
    print_success "No uncommitted changes"
fi

# Deploy to Heroku
echo ""
echo "========================================="
echo "Deploying to Heroku..."
echo "========================================="
echo ""

# Detect branch name
BRANCH=$(git branch --show-current)
print_info "Pushing branch: $BRANCH"

if git push heroku "$BRANCH:main"; then
    print_success "Deployment successful!"
else
    print_error "Deployment failed!"
    echo "Check the logs with: heroku logs --tail --app $APP_NAME"
    exit 1
fi

# Run migrations
echo ""
echo "Running migrations..."
if heroku run python backend/manage.py migrate --app "$APP_NAME"; then
    print_success "Migrations completed"
else
    print_warning "Migrations failed or already up to date"
fi

# Ask about creating superuser
echo ""
read -p "Do you want to create a superuser now? (y/n): " CREATE_SUPERUSER
if [[ $CREATE_SUPERUSER == "y" ]]; then
    heroku run python backend/manage.py createsuperuser --app "$APP_NAME"
fi

# Display success message
echo ""
echo "========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "========================================="
echo ""
echo "Your app is live at: https://$APP_NAME.herokuapp.com/"
echo "Admin panel: https://$APP_NAME.herokuapp.com/admin/"
echo ""
echo "Useful commands:"
echo "  View logs:        heroku logs --tail --app $APP_NAME"
echo "  Open app:         heroku open --app $APP_NAME"
echo "  Run command:      heroku run python backend/manage.py <command> --app $APP_NAME"
echo "  View config:      heroku config --app $APP_NAME"
echo ""
print_success "All done! 🎉"

# Ask if user wants to open the app
echo ""
read -p "Do you want to open the app in your browser? (y/n): " OPEN_APP
if [[ $OPEN_APP == "y" ]]; then
    heroku open --app "$APP_NAME"
fi
