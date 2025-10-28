import { NextResponse } from 'next/server';
import { getGoogleSheetsClient, SPREADSHEET_CONFIG } from '@/lib/googleSheets';

// Analyze existing spreadsheet structure and data
export async function GET() {
  try {
    console.log('Analyzing existing spreadsheet...');
    
    const sheets = await getGoogleSheetsClient();
    
    // Get spreadsheet info
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
    });

    const spreadsheetInfo = {
      title: spreadsheet.data.properties?.title,
      sheets: []
    };

    // Analyze each sheet
    for (const sheet of spreadsheet.data.sheets || []) {
      const sheetName = sheet.properties?.title;
      if (!sheetName) continue;

      console.log(`Analyzing sheet: ${sheetName}`);

      // Get sheet data
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
      });

      const rows = response.data.values || [];
      const headers = rows.length > 0 ? rows[0] : [];
      const dataRows = rows.slice(1);

      const sheetAnalysis = {
        name: sheetName,
        rowCount: rows.length,
        columnCount: headers.length,
        headers: headers,
        dataRowCount: dataRows.length,
        sampleData: dataRows.slice(0, 3), // First 3 rows as sample
        isEmpty: dataRows.length === 0,
        hasHeaders: headers.length > 0
      };

      spreadsheetInfo.sheets.push(sheetAnalysis);
    }

    return NextResponse.json({
      success: true,
      spreadsheet: spreadsheetInfo,
      message: 'Spreadsheet analyzed successfully'
    });

  } catch (error) {
    console.error('Error analyzing spreadsheet:', error);
    
    let errorMessage = 'Unknown error';
    let suggestions = [];

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('404') || error.message.includes('not found')) {
        suggestions = [
          'Check that the spreadsheet ID is correct',
          'Make sure the spreadsheet exists and is accessible',
          'Verify the spreadsheet URL'
        ];
      } else if (error.message.includes('403') || error.message.includes('permission')) {
        suggestions = [
          `Share the spreadsheet with: ${process.env.GOOGLE_CLIENT_EMAIL}`,
          'Give the service account "Editor" permissions',
          'Make sure the spreadsheet is not private'
        ];
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      suggestions,
      spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID
    }, { status: 500 });
  }
}

// Import data from existing sheets to MongoDB
export async function POST(request: Request) {
  try {
    const { action, sheetName, mapping } = await request.json();

    if (action === 'import-sheet-data') {
      const sheets = await getGoogleSheetsClient();
      
      // Get sheet data
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length <= 1) {
        return NextResponse.json({
          success: false,
          error: 'No data found in sheet (only headers or empty)'
        }, { status: 400 });
      }

      const headers = rows[0];
      const dataRows = rows.slice(1);

      // Convert sheet data to our format based on mapping
      const convertedData = dataRows.map(row => {
        const record: any = {};
        
        // Map columns based on provided mapping
        for (const [ourField, sheetColumn] of Object.entries(mapping)) {
          const columnIndex = headers.indexOf(sheetColumn);
          if (columnIndex !== -1 && row[columnIndex]) {
            record[ourField] = row[columnIndex];
          }
        }

        // Add default values for required fields
        record.createdAt = new Date();
        record.updatedAt = new Date();
        
        return record;
      });

      return NextResponse.json({
        success: true,
        message: `Converted ${convertedData.length} records from ${sheetName}`,
        data: convertedData,
        headers: headers
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error importing sheet data:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}