# Google Sheets Integration - Quick Start

## 🎉 What's New

Your festival management system now has **bidirectional Google Sheets integration**! 

### ✅ Features Added

1. **Automatic Sync**: When you add/edit/delete data in admin panel → automatically syncs to Google Sheets
2. **Manual Sync**: Sync data manually from admin panel 
3. **Reverse Sync**: Edit data in Google Sheets → sync back to MongoDB
4. **Real-time Updates**: Changes reflect immediately
5. **Multiple Data Types**: Teams, Candidates, Programmes supported

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install googleapis google-auth-library
```

### 2. Set Environment Variables
Copy `.env.example` to `.env.local` and fill in:
```env
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_key\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_key_id
GOOGLE_CLIENT_ID=your_client_id
```

### 3. Access Sync Panel
- Go to admin panel: `/admin/sync`
- Check configuration status
- Test sync operations

## 📁 Files Added

### Core Integration
- `src/lib/googleSheets.ts` - Google Sheets API client
- `src/lib/sheetsSync.ts` - Sync service class
- `src/app/api/sync/route.ts` - Sync API endpoints

### UI Components  
- `src/app/admin/sync/page.tsx` - Sync management page
- Updated sidebar navigation

### API Updates
- `src/app/api/teams/route.ts` - Auto-sync on CRUD operations
- `src/app/api/candidates/route.ts` - Auto-sync on CRUD operations

### Documentation & Setup
- `GOOGLE_SHEETS_SETUP.md` - Detailed setup guide
- `.env.example` - Environment variables template
- `google-apps-script/webhook.gs` - Real-time sync script

### Webhook Support
- `src/app/api/webhook/sheets/route.ts` - Webhook for real-time sync

## 🔄 How It Works

### Automatic Sync (Default)
```
Admin Panel Action → MongoDB → Google Sheets
```

### Manual Sync Options
```
MongoDB → Google Sheets (Push current data)
Google Sheets → MongoDB (Pull sheet changes)
```

### Real-time Sync (Optional)
```
Google Sheets Edit → Webhook → MongoDB
```

## 🎯 Usage Examples

### Add New Team
1. Go to `/admin/teams`
2. Fill form and click "Add Team"
3. ✅ Team added to MongoDB
4. ✅ Team automatically added to Google Sheets

### Edit in Google Sheets
1. Open your Google Spreadsheet
2. Edit any cell in Teams/Candidates sheet
3. Go to `/admin/sync`
4. Click "Sync from Sheets" for that data type
5. ✅ Changes pulled into MongoDB

### Bulk Operations
1. Add multiple rows in Google Sheets
2. Use "Sync All from Sheets" 
3. ✅ All new data imported to MongoDB

## 🛠️ API Endpoints

```javascript
// Get sync status
GET /api/sync

// Sync to sheets
POST /api/sync
{
  "action": "sync-to-sheets",
  "type": "teams" // or "candidates", "programmes", "all"
}

// Sync from sheets  
POST /api/sync
{
  "action": "sync-from-sheets", 
  "type": "candidates"
}
```

## 📊 Sheet Structure

Each data type gets its own sheet:

**Teams Sheet:**
| ID | Name | Color | Description | Captain | Members | Points | Created At | Updated At |

**Candidates Sheet:**
| ID | Chest Number | Name | Team | Section | Points | Created At | Updated At |

**Programmes Sheet:**
| ID | Code | Name | Category | Section | Position Type | Status | Created At | Updated At |

## 🔧 Configuration Check

Visit `/admin/sync` to see:
- ✅ Configuration status
- 📊 Available data types  
- 🔄 Sync options
- 📈 Last sync times

## 🚨 Important Notes

1. **Service Account**: Must have Editor access to your spreadsheet
2. **Environment Variables**: Keep `.env.local` secure, never commit it
3. **API Limits**: Google Sheets API has usage quotas
4. **Data Integrity**: MongoDB ObjectIDs are preserved in sheets
5. **Backup**: Always backup your data before bulk operations

## 🆘 Troubleshooting

**"Not Configured" Status:**
- Check environment variables
- Verify service account permissions
- Ensure spreadsheet is shared with service account

**Sync Failures:**
- Check browser console for errors
- Verify internet connection  
- Check Google Cloud Console for API errors

**Permission Errors:**
- Share spreadsheet with service account email
- Give "Editor" permissions
- Enable Google Sheets API in Google Cloud

## 🎉 Ready to Use!

Your Google Sheets integration is now ready! Start by:

1. Setting up your environment variables
2. Creating a Google Spreadsheet  
3. Testing the sync functionality
4. Adding your first synced data

For detailed setup instructions, see `GOOGLE_SHEETS_SETUP.md`.