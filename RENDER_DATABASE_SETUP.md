# How to Copy Internal Database URL in Render.com

## Step-by-Step Guide with Exact Locations

---

## 📍 Part 1: Create PostgreSQL Database

### 1. After logging into Render Dashboard
- Look at the **top navigation bar**
- Click the blue **"New +"** button (top right corner)
- Select **"PostgreSQL"** from the dropdown menu

### 2. Configure Database
- **Name:** `weekly-hour-calculator-db` (or any name you prefer)
- **Database:** Leave default or name it `weekly_hour_calculator`
- **User:** Leave default
- **Region:** Choose closest to you
- **PostgreSQL Version:** Latest (default)
- **Plan:** Select **"Free"** (important!)

### 3. Create Database
- Scroll down and click **"Create Database"** button (blue button at bottom)
- Wait 30-60 seconds for database to provision
- You'll be redirected to the database dashboard

---

## 📍 Part 2: Copy Internal Database URL

### 4. On Database Dashboard Page
You'll see a page with tabs at the top:
- **Info** (default/selected)
- **Backups**
- **Settings**
- **Events**

### 5. Scroll Down to "Connections" Section
On the **Info** tab, scroll down until you see a section titled:
**"Connections"**

You'll see several connection URLs listed:

```
┌─────────────────────────────────────────────┐
│ Connections                                  │
│                                              │
│ Internal Database URL                        │
│ postgres://user:pass@host/db      [Copy] 📋 │
│                                              │
│ External Database URL                        │
│ postgres://user:pass@host/db      [Copy] 📋 │
│                                              │
│ PSQL Command                                 │
│ PSQL command here...              [Copy] 📋 │
└─────────────────────────────────────────────┘
```

### 6. Copy the Internal Database URL
- Find the row labeled **"Internal Database URL"**
- Click the **[Copy]** button (📋 clipboard icon) next to it
- ✅ The URL is now in your clipboard!

**IMPORTANT:** Use **Internal Database URL**, NOT External!
- Internal = Free connection between Render services
- External = Uses bandwidth (costs money)

The URL looks like:
```
postgresql://username:password@hostname.oregon-postgres.render.com/database_name
```

---

## 📍 Part 3: Paste URL to Web Service

### 7. Go Back to Dashboard
- Click **"Dashboard"** in the top left navigation
- You'll see a list of your services

### 8. Select Your Web Service
- Click on your web service name (e.g., "weekly-hour-calculator")
- This opens your web service dashboard

### 9. Navigate to Environment Tab
On the left sidebar, you'll see:
- **Events** (default/selected)
- **Logs**
- **Shell**
- **Metrics**
- **Settings**
- **Environment** ← **Click this one**

### 10. Add Environment Variable
On the Environment page:
- Click the blue **"Add Environment Variable"** button
- You'll see two input fields appear:

```
┌─────────────────────────────────────────────┐
│ Add Environment Variable                     │
│                                              │
│ Key:    [________________]                   │
│ Value:  [________________]                   │
│                                              │
│         [Cancel]  [Save Changes]             │
└─────────────────────────────────────────────┘
```

### 11. Fill in the Fields
**Key:** Type exactly: `DATABASE_URL`

**Value:** Paste the Internal Database URL you copied
- Press `Ctrl+V` (Linux/Windows) or `Cmd+V` (Mac)
- The long postgres:// URL should appear

Example:
```
Key:   DATABASE_URL
Value: postgresql://user:longpassword123@dpg-xxx.oregon-postgres.render.com/dbname
```

### 12. Save Changes
- Click the blue **"Save Changes"** button
- Render will automatically redeploy your service with the new environment variable
- Wait 1-2 minutes for deployment to complete

---

## 📍 Part 4: Verify Connection

### 13. Check Deployment
- Go to **"Events"** tab (left sidebar)
- Look for "Deploy succeeded" message
- Status should show green "Live"

### 14. Run Migrations
After deployment succeeds:
- Click **"Shell"** tab (left sidebar)
- A terminal will open in your browser
- Type these commands:

```bash
cd backend
python manage.py migrate
```

Press Enter after each command.

You should see:
```
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
```

✅ **Success!** Your database is connected!

---

## 🎯 Quick Summary

1. **Create Database:** New + → PostgreSQL → Free Plan → Create
2. **Copy URL:** Database page → Info tab → Internal Database URL → Copy button
3. **Add to Service:** Web Service → Environment → Add Variable → Key: `DATABASE_URL`, Value: paste URL
4. **Save:** Click Save Changes → Wait for redeploy
5. **Migrate:** Shell tab → `cd backend && python manage.py migrate`

---

## 🔍 Common Issues

### Can't find Internal Database URL?
- Make sure you're on the **Info** tab of your database
- Scroll down - it's usually in the middle of the page
- Look for "Connections" section header

### Copied External URL by mistake?
- No problem! Go back and copy the **Internal** one
- Replace the value in Environment variables
- Save again

### Service won't start after adding DATABASE_URL?
- Check the URL is complete (starts with `postgresql://`)
- Make sure there are no extra spaces
- Check the **Logs** tab for error messages

---

## 💡 Pro Tips

- **Bookmark your database page** for easy access later
- The database URL contains your password - **keep it secret!**
- Free tier database has **1GB storage** limit
- Database sleeps after 90 days of inactivity (free tier)

---

## ✅ You're Done!

Your Django app is now connected to PostgreSQL and deployed on Render for **FREE**! 🎉

**Your app URL:** `https://your-service-name.onrender.com/`
**Admin panel:** `https://your-service-name.onrender.com/admin/`

---

## 📸 Visual Reference

### Where is each section?

```
Render Dashboard Layout:
┌─────────────────────────────────────────────────────────┐
│ [Dashboard] [Docs] [Community]        [New +] [Profile] │ ← Top Bar
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Your Services:                                          │
│  📦 weekly-hour-calculator (Web Service)                │ ← Click this
│  🗄️  weekly-hour-calculator-db (PostgreSQL)            │ ← Or this for DB
│                                                          │
└─────────────────────────────────────────────────────────┘

Database Page Layout:
┌─────────────────────────────────────────────────────────┐
│ weekly-hour-calculator-db                    [Dashboard]│
├─────────────────────────────────────────────────────────┤
│ [Info] [Backups] [Settings] [Events]        ← Tabs      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Status: Available (green dot)                           │
│                                                          │
│ Connections:                                            │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Internal Database URL              [Copy] 📋       │ │ ← Copy this!
│ │ postgres://user:pass@host/db                       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘

Web Service Page Layout:
┌─────────────────────────────────────────────────────────┐
│ weekly-hour-calculator                       [Dashboard]│
├──────────┬──────────────────────────────────────────────┤
│ Events   │  Deploy succeeded ✓                         │
│ Logs     │  Service is live                            │
│ Shell    │                                              │
│ Metrics  │                                              │
│ Settings │                                              │
│ Environment │ ← Click here!                            │
└──────────┴──────────────────────────────────────────────┘

Environment Page:
┌─────────────────────────────────────────────────────────┐
│ Environment Variables        [Add Environment Variable] │ ← Click
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Key: SECRET_KEY          Value: django-insecure-xxx...  │
│ Key: DEBUG               Value: False                   │
│                                                          │
│ Key: [DATABASE_URL___]   Value: [paste URL here______] │ ← Add this
│                                                          │
│                          [Cancel]  [Save Changes]       │
└─────────────────────────────────────────────────────────┘
```

---

**Still stuck? Check the Logs tab in your web service for error messages!**
