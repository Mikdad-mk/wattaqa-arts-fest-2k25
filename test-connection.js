// Quick test script to verify Google Sheets connection
const { google } = require('googleapis');

async function testConnection() {
  try {
    console.log('Testing Google Sheets connection...');
    
    // Check environment variables
    const requiredVars = ['GOOGLE_SPREADSHEET_ID', 'GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY'];
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        console.error(`❌ Missing environment variable: ${varName}`);
        return;
      }
    }
    
    console.log('✅ Environment variables found');
    console.log('📊 Spreadsheet ID:', process.env.GOOGLE_SPREADSHEET_ID);
    console.log('📧 Service Account:', process.env.GOOGLE_CLIENT_EMAIL);
    
    // Initialize Google Sheets client
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Test connection
    console.log('🔗 Testing connection...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    });
    
    console.log('✅ Connection successful!');
    console.log('📋 Spreadsheet title:', spreadsheet.data.properties?.title);
    console.log('📄 Number of sheets:', spreadsheet.data.sheets?.length);
    
    // List sheets
    if (spreadsheet.data.sheets) {
      console.log('\n📋 Available sheets:');
      spreadsheet.data.sheets.forEach((sheet, index) => {
        console.log(`  ${index + 1}. ${sheet.properties?.title}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('404') || error.message.includes('not found')) {
      console.log('\n💡 Solution:');
      console.log('1. Open your spreadsheet: https://docs.google.com/spreadsheets/d/' + process.env.GOOGLE_SPREADSHEET_ID + '/edit');
      console.log('2. Click "Share" button');
      console.log('3. Add email:', process.env.GOOGLE_CLIENT_EMAIL);
      console.log('4. Set permission to "Editor"');
      console.log('5. Click "Send"');
    }
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testConnection();