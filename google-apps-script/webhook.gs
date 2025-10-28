/**
 * Google Apps Script for Real-time Google Sheets to MongoDB Sync
 * 
 * This script should be added to your Google Spreadsheet to enable
 * real-time synchronization when data is changed in the sheets.
 * 
 * Setup Instructions:
 * 1. Open your Google Spreadsheet
 * 2. Go to Extensions > Apps Script
 * 3. Replace the default code with this script
 * 4. Update the WEBHOOK_URL with your actual webhook endpoint
 * 5. Save and authorize the script
 * 6. Set up triggers (see setupTriggers function)
 */

// Configuration - Update this with your actual webhook URL
const WEBHOOK_URL = 'https://your-domain.com/api/webhook/sheets';

// Optional: Add authentication if needed
const WEBHOOK_SECRET = 'your-webhook-secret'; // Set this in your environment variables

/**
 * Function to set up triggers for automatic sync
 * Run this once to set up the triggers
 */
function setupTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create new triggers for each sheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Trigger on edit
  ScriptApp.newTrigger('onEdit')
    .timeBased()
    .everyMinutes(1) // Check for changes every minute
    .create();
    
  // Trigger on form submit (if using forms)
  ScriptApp.newTrigger('onFormSubmit')
    .timeBased()
    .everyMinutes(5) // Check for form submissions every 5 minutes
    .create();
    
  console.log('Triggers set up successfully');
}

/**
 * Function called when spreadsheet is edited
 */
function onEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const sheetName = sheet.getName();
    
    // Only sync for our data sheets
    const validSheets = ['Teams', 'Candidates', 'Programmes', 'Results', 'Schedule'];
    if (!validSheets.includes(sheetName)) {
      return;
    }
    
    console.log(`Sheet ${sheetName} was edited`);
    
    // Debounce rapid changes - wait 2 seconds before syncing
    Utilities.sleep(2000);
    
    syncSheetToWebhook(sheetName, 'change');
    
  } catch (error) {
    console.error('Error in onEdit:', error);
  }
}

/**
 * Function to sync specific sheet to webhook
 */
function syncSheetToWebhook(sheetName, action = 'sync') {
  try {
    const payload = {
      sheetName: sheetName,
      action: action,
      timestamp: new Date().toISOString(),
      source: 'google-apps-script'
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payload)
    };
    
    // Add authentication header if secret is configured
    if (WEBHOOK_SECRET) {
      options.headers['X-Webhook-Secret'] = WEBHOOK_SECRET;
    }
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 200) {
      console.log(`Successfully synced ${sheetName}:`, responseData.message);
    } else {
      console.error(`Sync failed for ${sheetName}:`, responseData.error);
    }
    
  } catch (error) {
    console.error(`Error syncing ${sheetName}:`, error);
  }
}

/**
 * Manual sync function - can be run manually or triggered
 */
function manualSyncAll() {
  const validSheets = ['Teams', 'Candidates', 'Programmes', 'Results', 'Schedule'];
  
  validSheets.forEach(sheetName => {
    try {
      syncSheetToWebhook(sheetName, 'sync');
      Utilities.sleep(1000); // Wait 1 second between syncs
    } catch (error) {
      console.error(`Error syncing ${sheetName}:`, error);
    }
  });
  
  console.log('Manual sync completed for all sheets');
}

/**
 * Test function to verify webhook connectivity
 */
function testWebhook() {
  try {
    const testPayload = {
      sheetName: 'Teams',
      action: 'test',
      timestamp: new Date().toISOString(),
      source: 'google-apps-script-test'
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(testPayload)
    };
    
    if (WEBHOOK_SECRET) {
      options.headers['X-Webhook-Secret'] = WEBHOOK_SECRET;
    }
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseData = JSON.parse(response.getContentText());
    
    console.log('Webhook test response:', responseData);
    
    if (response.getResponseCode() === 200) {
      console.log('✅ Webhook is working correctly');
    } else {
      console.log('❌ Webhook test failed');
    }
    
  } catch (error) {
    console.error('❌ Webhook test error:', error);
  }
}

/**
 * Function to get sheet data (for debugging)
 */
function getSheetData(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      console.log(`Sheet ${sheetName} not found`);
      return null;
    }
    
    const data = sheet.getDataRange().getValues();
    console.log(`${sheetName} data:`, data);
    return data;
    
  } catch (error) {
    console.error(`Error getting ${sheetName} data:`, error);
    return null;
  }
}

/**
 * Function to create menu items for manual operations
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Festival Sync')
    .addItem('Setup Triggers', 'setupTriggers')
    .addItem('Manual Sync All', 'manualSyncAll')
    .addItem('Test Webhook', 'testWebhook')
    .addSeparator()
    .addItem('Sync Teams', 'syncTeams')
    .addItem('Sync Candidates', 'syncCandidates')
    .addItem('Sync Programmes', 'syncProgrammes')
    .addToUi();
}

// Individual sync functions for menu items
function syncTeams() {
  syncSheetToWebhook('Teams', 'sync');
}

function syncCandidates() {
  syncSheetToWebhook('Candidates', 'sync');
}

function syncProgrammes() {
  syncSheetToWebhook('Programmes', 'sync');
}

/**
 * Function to handle form submissions (if using Google Forms)
 */
function onFormSubmit(e) {
  try {
    console.log('Form submitted, triggering sync');
    
    // Determine which sheet was affected by the form submission
    const sheet = e.range.getSheet();
    const sheetName = sheet.getName();
    
    // Sync the affected sheet
    syncSheetToWebhook(sheetName, 'change');
    
  } catch (error) {
    console.error('Error in onFormSubmit:', error);
  }
}

/**
 * Utility function to log all triggers (for debugging)
 */
function listTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  console.log('Current triggers:');
  triggers.forEach((trigger, index) => {
    console.log(`${index + 1}. ${trigger.getHandlerFunction()} - ${trigger.getTriggerSource()}`);
  });
}