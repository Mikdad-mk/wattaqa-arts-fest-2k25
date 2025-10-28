# Import Your Existing Google Sheets Data

## 🎯 Quick Setup for Your Existing Spreadsheet

Your spreadsheet: https://docs.google.com/spreadsheets/d/1_qdEf-xeI-zPoxOK5DLYCpzZVcNLuGtRWMDZEso_T3I/edit

## 🚀 Step-by-Step Process

### Step 1: Share Your Spreadsheet
1. **Open your spreadsheet** (link above)
2. **Click "Share" button** (top right)
3. **Add this email**: `festival-sheets-sync@festival-management-476511.iam.gserviceaccount.com`
4. **Set permission to "Editor"**
5. **Click "Send"**

### Step 2: Analyze Your Data
1. **Start your dev server**: `npm run dev`
2. **Go to import page**: `http://localhost:3000/admin/import`
3. **System will analyze** your spreadsheet automatically
4. **Review detected sheets** and their data

### Step 3: Map Your Fields
For each sheet with data:
1. **Choose data type** (Teams, Candidates, or Programmes)
2. **Auto-detect mapping** will try to match your columns
3. **Manually adjust** any incorrect mappings
4. **Preview data** to verify mapping is correct

### Step 4: Import Data
1. **Click import button** for each sheet
2. **Data gets imported** to MongoDB
3. **View imported data** in admin panels
4. **Bidirectional sync** is now enabled!

## 📊 Expected Data Structure

### Teams Data
Your sheet should have columns like:
- Team Name / Name
- Color
- Description
- Captain
- Members (number)
- Points (number)

### Candidates Data
Your sheet should have columns like:
- Chest Number / ID
- Name / Full Name
- Team / Team Name
- Section (Senior/Junior/Sub-Junior)
- Points (number)

### Programmes Data
Your sheet should have columns like:
- Code / Programme Code
- Name / Programme Name
- Category (Arts/Sports)
- Section (Senior/Junior/Sub-Junior/General)
- Position Type (Individual/Group/General)
- Status (Active/Inactive/Completed)

## 🔄 After Import

### What You Get:
- ✅ **All your existing data** in the admin panel
- ✅ **Add/edit/delete** through web interface
- ✅ **Automatic sync** to Google Sheets
- ✅ **Edit in Google Sheets** and sync back
- ✅ **Full bidirectional sync**

### How Sync Works:
```
Your Existing Data → MongoDB → Admin Panel
                 ↕
            Google Sheets
```

## 🛠️ Troubleshooting

### "Permission denied" errors:
- Make sure you shared the spreadsheet with the service account
- Check that you gave "Editor" permissions

### "No data found" errors:
- Ensure your sheets have headers in row 1
- Make sure there's data in rows 2 and below
- Check that columns aren't completely empty

### Mapping issues:
- Column names don't need to match exactly
- Auto-detection tries to find similar names
- You can manually map any column to any field
- Preview data before importing to verify mapping

## 🎉 Benefits

### Before Import:
- Data only in Google Sheets
- Manual management
- No web interface

### After Import:
- Data in both Google Sheets AND admin panel
- Web interface for easy management
- Automatic synchronization
- Team collaboration through both interfaces
- Real-time updates

## 📝 Example Workflow

1. **Import existing teams** from your spreadsheet
2. **Add new candidate** through admin panel → automatically appears in Google Sheets
3. **Edit team info** in Google Sheets → sync back to admin panel
4. **Generate reports** using admin panel data
5. **Share Google Sheets** with team members for collaborative editing

Your existing data will be preserved and enhanced with powerful web management tools! 🚀