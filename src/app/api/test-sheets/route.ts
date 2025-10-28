import { NextResponse } from 'next/server';
import { getGoogleSheetsClient, SPREADSHEET_CONFIG } from '@/lib/googleSheets';

// Test Google Sheets connection
export async function GET() {
  try {
    console.log('Testing Google Sheets connection...');
    console.log('Spreadsheet ID:', SPREADSHEET_CONFIG.SPREADSHEET_ID);
    console.log('Service Account Email:', process.env.GOOGLE_CLIENT_EMAIL);

    // Check if all required environment variables are set
    const requiredEnvVars = [
      'GOOGLE_SPREADSHEET_ID',
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_PROJECT_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        missingVars,
        message: 'Please check your .env.local file'
      }, { status: 400 });
    }

    // Test Google Sheets API connection
    const sheets = await getGoogleSheetsClient();
    
    // Try to get spreadsheet info
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
    });

    const sheetInfo = {
      title: spreadsheet.data.properties?.title,
      sheetCount: spreadsheet.data.sheets?.length || 0,
      sheets: spreadsheet.data.sheets?.map(sheet => ({
        name: sheet.properties?.title,
        id: sheet.properties?.sheetId,
        rowCount: sheet.properties?.gridProperties?.rowCount,
        columnCount: sheet.properties?.gridProperties?.columnCount
      }))
    };

    return NextResponse.json({
      success: true,
      message: 'Google Sheets connection successful!',
      spreadsheetInfo: sheetInfo,
      config: {
        spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
        serviceAccountEmail: process.env.GOOGLE_CLIENT_EMAIL
      }
    });

  } catch (error) {
    console.error('Google Sheets test error:', error);
    
    let errorMessage = 'Unknown error';
    let suggestions = [];

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('404') || error.message.includes('not found')) {
        suggestions = [
          'Check that the spreadsheet ID is correct',
          'Make sure the spreadsheet exists',
          'Verify the spreadsheet URL is accessible'
        ];
      } else if (error.message.includes('403') || error.message.includes('permission')) {
        suggestions = [
          `Share the spreadsheet with: ${process.env.GOOGLE_CLIENT_EMAIL}`,
          'Give the service account "Editor" permissions',
          'Make sure the service account has access to the spreadsheet'
        ];
      } else if (error.message.includes('credentials') || error.message.includes('authentication')) {
        suggestions = [
          'Check that all Google Cloud credentials are correct',
          'Verify the private key format (should include \\n characters)',
          'Make sure the service account JSON file is valid'
        ];
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      suggestions,
      config: {
        spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID || 'Not set',
        serviceAccountEmail: process.env.GOOGLE_CLIENT_EMAIL || 'Not set',
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        hasProjectId: !!process.env.GOOGLE_PROJECT_ID
      }
    }, { status: 500 });
  }
}