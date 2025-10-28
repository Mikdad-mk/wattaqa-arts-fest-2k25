import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getGoogleSheetsClient, SPREADSHEET_CONFIG, convertFromSheetFormat } from '@/lib/googleSheets';

// Simplified sync that focuses on importing data without updating sheet IDs
export async function POST(request: Request) {
  try {
    const { action, type } = await request.json();

    if (action === 'import-from-sheets') {
      if (!type || !['basic', 'teams', 'candidates', 'programmes', 'results'].includes(type)) {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
      }

      const sheets = await getGoogleSheetsClient();
      const db = await getDatabase();
      
      // Map type to sheet name
      const sheetNameMap: { [key: string]: string } = {
        'basic': 'basic',
        'teams': 'team', 
        'candidates': 'candidate',
        'programmes': 'program',
        'results': 'result'
      };
      
      const sheetName = sheetNameMap[type];
      
      console.log(`Importing ${type} from ${sheetName} sheet...`);
      
      // Get data from Google Sheets (read-only, no quota issues)
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
        range: `${sheetName}!A2:Z`, // Skip header row
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return NextResponse.json({ 
          success: true, 
          message: `No data found in ${sheetName} sheet`,
          imported: 0 
        });
      }

      const collection = db.collection(type === 'basic' ? 'festival-info' : type);
      let importedCount = 0;
      let skippedCount = 0;

      // Process each row
      for (const row of rows) {
        try {
          // Skip completely empty rows
          if (!row || row.every(cell => !cell || cell.toString().trim() === '')) {
            skippedCount++;
            continue;
          }

          const record = convertFromSheetFormat(row, type as any);
          if (!record) {
            skippedCount++;
            continue;
          }

          // Additional validation for candidates to ensure required fields
          if (type === 'candidates') {
            if (!record.name || !record.chestNumber || !record.team || !record.section ||
                record.name.trim() === '' || record.chestNumber.trim() === '' || 
                record.team.trim() === '' || record.section.trim() === '') {
              console.log('Skipping candidate with missing required fields:', record);
              skippedCount++;
              continue;
            }
          }

          // Always insert as new record (ignore existing IDs to avoid conflicts)
          const { _id, ...insertData } = record;
          
          // Check if similar record already exists (by name or unique field)
          let existingRecord = null;
          if (type === 'teams' && insertData.name) {
            // Map team codes to full names
            let teamName = insertData.name;
            if (teamName === 'SMD') teamName = 'SUMUD';
            else if (teamName === 'INT') teamName = 'INTIFADA';  
            else if (teamName === 'AQS') teamName = 'AQSA';
            
            existingRecord = await collection.findOne({ 
              $or: [
                { name: teamName },
                { name: insertData.name }
              ]
            });
            
            // Update the record with the correct team name
            insertData.name = teamName;
          } else if (type === 'candidates' && insertData.chestNumber) {
            existingRecord = await collection.findOne({ chestNumber: insertData.chestNumber });
          } else if (type === 'programmes' && insertData.code) {
            existingRecord = await collection.findOne({ code: insertData.code });
          }

          if (existingRecord) {
            // Update existing record
            await collection.updateOne(
              { _id: existingRecord._id },
              { $set: { ...insertData, updatedAt: new Date() } }
            );
          } else {
            // Insert new record
            await collection.insertOne({
              ...insertData,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          
          importedCount++;
        } catch (rowError) {
          console.error('Error processing row:', row, rowError);
          skippedCount++;
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully imported ${importedCount} ${type} records from Google Sheets`,
        imported: importedCount,
        skipped: skippedCount,
        total: rows.length
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Simple sync error:', error);
    return NextResponse.json({ 
      error: 'Import failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Get available data types
export async function GET() {
  return NextResponse.json({
    success: true,
    availableTypes: ['basic', 'teams', 'candidates', 'programmes', 'results'],
    actions: ['import-from-sheets']
  });
}