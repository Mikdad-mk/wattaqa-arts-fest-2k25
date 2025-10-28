# New Google Spreadsheet Setup - Quick Guide

## 🎯 Setting Up a Fresh Google Spreadsheet

This guide will help you create a brand new Google Spreadsheet that automatically syncs with your festival management system.

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Google Cloud Credentials

1. **Create Google Cloud Project**
   - Go to: https://console.cloud.google.com/
   - Create new project: `festival-management`

2. **Enable Google Sheets API**
   - Go to "APIs & Services" → "Library"
   - Search "Google Sheets API" → Enable

3. **Create Service Account**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: `festival-sheets-sync`
   - Skip roles → Done

4. **Download JSON Key**
   - Click on the service account
   - Go to "Keys" tab → "Add Key" → "Create New Key"
   - Select JSON → Create
   - **Save the downloaded JSON file securely**

### Step 2: Create New Google Spreadsheet

1. **Create Spreadsheet**
   - Go to: https://sheets.google.com/
   - Click "Blank" to create new spreadsheet
   - Name it: "Festival Management Data"

2. **Get Spreadsheet ID**
   - Copy from URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

3. **Share with Service Account**
   - Click "Share" button
   - Add service account email (from JSON file: `client_email`)
   - Set permission: "Editor"
   - Click "Send"

### Step 3: Configure Environment Variables

Create `.env.local` file:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/festival-management

# Google Sheets Integration
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_PROJECT_ID=your_project_id_from_json
GOOGLE_PRIVATE_KEY_ID=your_private_key_id_from_json
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_from_json\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your_client_id_from_json
```

### Step 4: Test Integration

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Check Configuration**
   - Go to: `http://localhost:3000/admin/sync`
   - Should show "✓ Configured" status

3. **Test Sync**
   - Add some teams/candidates in admin panel
   - Go to sync page → "Sync All to Sheets"
   - Check your Google Spreadsheet → Data should appear!

## 📊 What Happens Automatically

### When You Add Data in Admin Panel:
1. **Teams** → Creates "Teams" sheet with proper headers
2. **Candidates** → Creates "Candidates" sheet with proper headers  
3. **Programmes** → Creates "Programmes" sheet with proper headers

### Sheet Structure (Auto-Created):

**Teams Sheet:**
```
ID | Name | Color | Description | Captain | Members | Points | Created At | Updated At
```

**Candidates Sheet:**
```
ID | Chest Number | Name | Team | Section | Points | Created At | Updated At
```

**Programmes Sheet:**
```
ID | Code | Name | Category | Section | Position Type | Status | Created At | Updated At
```

## 🔄 How Sync Works

### Automatic (Default Behavior):
- **Add team in admin** → Automatically appears in Google Sheets
- **Edit team in admin** → Automatically updates in Google Sheets
- **Delete team in admin** → Automatically removes from Google Sheets

### Manual Sync Options:
- **"Sync to Sheets"** → Push current database data to sheets
- **"Sync from Sheets"** → Pull sheet changes to database

### Edit in Google Sheets:
1. Edit any data directly in your spreadsheet
2. Go to `/admin/sync`
3. Click "Sync from Sheets" 
4. Changes appear in your admin panel!

## 🎯 Example Workflow

1. **Start with empty spreadsheet**
2. **Add first team in admin panel:**
   ```
   Name: Team Alpha
   Color: Blue
   Captain: John Doe
   Members: 25
   ```
3. **Check Google Sheets** → "Teams" sheet created with your data
4. **Add more teams** → They appear automatically
5. **Edit team name in Google Sheets** → Use sync to pull changes back

## ✅ Benefits of New Spreadsheet

- **Clean start** - No existing data conflicts
- **Proper structure** - Sheets created with correct headers
- **Immediate sync** - Works right away
- **Full control** - You control all the data from the beginning

## 🛠️ Available Features

### Admin Panel Features:
- ✅ Add/Edit/Delete Teams
- ✅ Add/Edit/Delete Candidates  
- ✅ Add/Edit/Delete Programmes
- ✅ Automatic Google Sheets sync
- ✅ Manual sync controls

### Google Sheets Features:
- ✅ Edit data directly in sheets
- ✅ Add new rows in sheets
- ✅ Bulk import from sheets
- ✅ Real-time sync (optional webhook)

## 🚨 Important Notes

1. **Keep JSON credentials secure** - Never commit to version control
2. **Service account needs Editor access** to your spreadsheet
3. **Spreadsheet ID must be correct** in environment variables
4. **Internet connection required** for sync operations

## 🎉 You're Ready!

Your new Google Spreadsheet integration is ready to use! 

**Next steps:**
1. Set up your credentials
2. Create your new spreadsheet
3. Test by adding some data
4. Enjoy bidirectional sync!

The system will automatically create the proper sheet structure as you add data. No manual setup of sheets or headers required!