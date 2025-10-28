# 🔄 Bidirectional Google Sheets Integration

## 🎯 Complete Integration Setup

Your Google Sheets now has **full bidirectional sync** with all admin pages:

### 📊 **Sheet Mapping:**
- **`basic` sheet** ↔ `/admin/basic` (Festival Info)
- **`team` sheet** ↔ `/admin/teams` (Teams Management)
- **`candidate` sheet** ↔ `/admin/candidates` (Candidates Management)
- **`program` sheet** ↔ `/admin/programmes` (Programmes Management)
- **`result` sheet** ↔ `/admin/results` (Results Management)

## 🔄 **How Bidirectional Sync Works:**

### 1. **Admin Panel → Google Sheets** (Automatic)
```
Add/Edit/Delete in Admin Panel → Instantly Updates Google Sheets
```

### 2. **Google Sheets → Admin Panel** (Manual Sync)
```
Edit in Google Sheets → Click "Sync from Sheets" → Updates Admin Panel
```

## 📋 **Sheet Structure:**

### Basic Sheet (Festival Info)
```
ID | Name | Year | Start Date | End Date | Venue | Description | Status | Created At | Updated At
```

### Team Sheet
```
ID | Name | Color | Description | Captain | Members | Points | Created At | Updated At
```

### Candidate Sheet
```
ID | Chest Number | Name | Team | Section | Points | Created At | Updated At
```

### Program Sheet
```
ID | Code | Name | Category | Section | Position Type | Status | Created At | Updated At
```

### Result Sheet
```
ID | Programme | Section | Grade | Position Type | Winners | Notes | Created At | Updated At
```

## 🚀 **Usage Examples:**

### Scenario 1: Add New Team
1. **In Admin Panel**: Go to `/admin/teams` → Add new team
2. **Result**: Team automatically appears in Google Sheets `team` tab
3. **Verification**: Check your Google Sheets - new row added

### Scenario 2: Edit Team in Google Sheets
1. **In Google Sheets**: Open `team` tab → Edit team name
2. **In Admin Panel**: Go to `/admin/sync` → Click "Sync Teams from Sheets"
3. **Result**: Team name updated in admin panel

### Scenario 3: Bulk Import from Sheets
1. **In Google Sheets**: Add multiple rows of data
2. **In Admin Panel**: Go to `/admin/sync` → Click "Sync All from Sheets"
3. **Result**: All new data imported to admin panel

## 🛠️ **Available Sync Operations:**

### Manual Sync Controls (`/admin/sync`)

#### Sync TO Sheets (Push Data)
- **Individual**: Sync specific data type (teams, candidates, etc.)
- **All**: Sync all data types at once
- **Use Case**: When you want to ensure sheets match your database

#### Sync FROM Sheets (Pull Data)
- **Individual**: Import changes from specific sheet
- **All**: Import changes from all sheets
- **Use Case**: When you've edited data in Google Sheets

### Automatic Sync (No Action Needed)
- **Add Record**: Automatically syncs to sheets
- **Edit Record**: Automatically updates in sheets
- **Delete Record**: Automatically removes from sheets

## 📊 **Data Import (`/admin/import`)**

### Import Your Existing Data
1. **Analyze**: System detects your current sheet structure
2. **Map Fields**: Auto-detect or manually map columns
3. **Import**: One-click import to admin panel
4. **Sync**: Enable bidirectional sync going forward

## 🔧 **API Endpoints:**

### Sync Operations
```javascript
// Sync to sheets
POST /api/sync
{
  "action": "sync-to-sheets",
  "type": "teams" // or "basic", "candidates", "programmes", "results", "all"
}

// Sync from sheets
POST /api/sync
{
  "action": "sync-from-sheets", 
  "type": "candidates"
}
```

### Data Operations (Auto-Sync Enabled)
```javascript
// All these automatically sync to Google Sheets:
POST /api/teams        // Add team
PUT /api/teams?id=123  // Edit team
DELETE /api/teams?id=123 // Delete team

POST /api/candidates   // Add candidate
POST /api/programmes   // Add programme
POST /api/results      // Add result
POST /api/festival-info // Update festival info
```

## 🎯 **Workflow Examples:**

### Daily Operations
1. **Morning**: Check Google Sheets for any overnight changes
2. **Sync**: Click "Sync All from Sheets" to pull changes
3. **Work**: Use admin panel for regular operations
4. **Evening**: All changes automatically in Google Sheets

### Team Collaboration
1. **Admin**: Uses admin panel for official operations
2. **Teachers**: Edit Google Sheets for quick updates
3. **Sync**: Regular sync keeps both systems updated
4. **Reports**: Generate from either system

### Event Management
1. **Setup**: Import existing data from Google Sheets
2. **Live Event**: Use admin panel for real-time updates
3. **Results**: Add results through admin panel
4. **Sharing**: Share Google Sheets with stakeholders

## 🚨 **Important Notes:**

### Data Safety
- ✅ **Automatic Backup**: MongoDB serves as primary database
- ✅ **Conflict Resolution**: Manual sync allows you to control updates
- ✅ **Data Validation**: Admin panel enforces data rules
- ✅ **Audit Trail**: All changes tracked with timestamps

### Best Practices
1. **Use Admin Panel** for official operations
2. **Use Google Sheets** for collaborative editing
3. **Sync Regularly** when editing in sheets
4. **Test Changes** in small batches first

### Limitations
- **Manual Sync Required** for Google Sheets → Admin Panel
- **Internet Required** for sync operations
- **API Limits** apply to Google Sheets operations

## 🎉 **Benefits:**

### For Administrators
- **Professional Interface**: Full-featured admin panel
- **Data Control**: Complete CRUD operations
- **Real-time Updates**: Instant sync to sheets
- **Backup**: Reliable database storage

### For Teachers/Staff
- **Familiar Interface**: Google Sheets they know
- **Collaborative Editing**: Multiple people can edit
- **Mobile Access**: Edit from phones/tablets
- **Offline Capability**: Edit offline, sync later

### For Everyone
- **Flexibility**: Choose the interface you prefer
- **Reliability**: Data exists in both systems
- **Accessibility**: Access from anywhere
- **Collaboration**: Work together seamlessly

Your festival management system now provides the best of both worlds - professional admin interface with collaborative Google Sheets integration! 🚀