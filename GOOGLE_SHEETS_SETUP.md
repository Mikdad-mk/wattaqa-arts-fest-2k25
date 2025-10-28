# Google Sheets Integration Setup Guide

This guide will help you set up bidirectional synchronization between your festival management system and Google Sheets.

## Features

✅ **Automatic Sync**: When you add/edit/delete data in the admin panel, it automatically syncs to Google Sheets  
✅ **Manual Sync**: Sync data manually from the admin panel  
✅ **Bidirectional**: Edit data directly in Google Sheets and sync back to MongoDB  
✅ **Real-time**: Changes are reflected immediately  
✅ **Multiple Data Types**: Teams, Candidates, Programmes, Results, and Schedule  

## Prerequisites

1. Google Cloud Project with Sheets API enabled
2. Service Account with appropriate permissions
3. Google Spreadsheet to sync data to

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `festival-sheets-sync`
   - Description: `Service account for festival management Google Sheets sync`
4. Click "Create and Continue"
5. Skip role assignment (click "Continue")
6. Click "Done"

## Step 3: Generate Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Select "JSON" format
5. Click "Create" - this will download a JSON file

## Step 4: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Festival Management Data" (or any name you prefer)
4. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
5. Share the spreadsheet with your service account email:
   - Click "Share" button
   - Add the service account email (from the JSON file: `client_email`)
   - Give "Editor" permissions

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the Google Sheets configuration using the JSON file you downloaded:

```env
# Google Sheets Integration
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_from_step_4
GOOGLE_PROJECT_ID=project_id_from_json
GOOGLE_PRIVATE_KEY_ID=private_key_id_from_json
GOOGLE_PRIVATE_KEY="private_key_from_json_with_newlines"
GOOGLE_CLIENT_EMAIL=client_email_from_json
GOOGLE_CLIENT_ID=client_id_from_json
```

**Important Notes:**
- The `GOOGLE_PRIVATE_KEY` should include the full key with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Make sure to preserve the newlines in the private key by wrapping it in quotes
- The `GOOGLE_CLIENT_EMAIL` is the service account email

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to the admin panel: `http://localhost:3000/admin`

3. Navigate to "Google Sheets Sync" in the sidebar

4. You should see:
   - ✅ Configuration status as "Configured"
   - Your spreadsheet ID
   - Available sync options

5. Test the sync:
   - Add some teams or candidates in the admin panel
   - Go to the sync page and click "Sync All to Sheets"
   - Check your Google Spreadsheet - you should see the data

## How It Works

### Automatic Sync (Default Behavior)

When you perform any CRUD operation in the admin panel:

1. **Create**: Data is added to both MongoDB and Google Sheets
2. **Update**: Data is updated in both MongoDB and Google Sheets  
3. **Delete**: Data is removed from both MongoDB and Google Sheets

### Manual Sync Options

#### Sync to Sheets
- Pushes current MongoDB data to Google Sheets
- Overwrites existing data in sheets
- Use when you want to ensure sheets match your database

#### Sync from Sheets  
- Pulls data from Google Sheets to MongoDB
- Updates existing records and adds new ones
- Use when you've made changes directly in Google Sheets

### Sheet Structure

Each data type gets its own sheet with these columns:

**Teams Sheet:**
- ID, Name, Color, Description, Captain, Members, Points, Created At, Updated At

**Candidates Sheet:**  
- ID, Chest Number, Name, Team, Section, Points, Created At, Updated At

**Programmes Sheet:**
- ID, Code, Name, Category, Section, Position Type, Status, Created At, Updated At

## Editing Data in Google Sheets

You can edit data directly in Google Sheets:

1. **To add new records**: Add a new row with empty ID column
2. **To update records**: Edit any cell except the ID column  
3. **To delete records**: Delete the entire row
4. **Sync back**: Use "Sync from Sheets" in the admin panel

## Troubleshooting

### "Not Configured" Status

- Check that all environment variables are set correctly
- Verify the service account JSON file values
- Ensure the spreadsheet is shared with the service account email

### "Permission Denied" Errors

- Make sure the spreadsheet is shared with the service account email
- Verify the service account has "Editor" permissions
- Check that the Google Sheets API is enabled in your project

### "Spreadsheet Not Found" Errors

- Verify the `GOOGLE_SPREADSHEET_ID` is correct
- Make sure the spreadsheet exists and is accessible
- Check that the service account has access to the spreadsheet

### Sync Failures

- Check the browser console for detailed error messages
- Verify your internet connection
- Ensure the Google Sheets API quota hasn't been exceeded

## Security Notes

- Keep your service account JSON file secure
- Never commit the `.env.local` file to version control
- Regularly rotate your service account keys
- Use environment-specific service accounts for production

## API Endpoints

The integration adds these API endpoints:

- `GET /api/sync` - Get sync configuration and status
- `POST /api/sync` - Perform sync operations

Example sync request:
```javascript
fetch('/api/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    action: 'sync-to-sheets', 
    type: 'teams' 
  })
})
```

## Production Deployment

For production deployment:

1. Set up environment variables in your hosting platform
2. Use a production Google Cloud project
3. Create separate spreadsheets for different environments
4. Monitor API usage and quotas
5. Set up proper error logging and monitoring

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly  
3. Test the Google Sheets API access manually
4. Check Google Cloud Console for API usage and errors