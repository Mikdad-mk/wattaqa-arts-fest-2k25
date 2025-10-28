import { NextResponse } from 'next/server';
import { sheetsSync } from '@/lib/sheetsSync';

// Sync all data from MongoDB to Google Sheets
export async function POST(request: Request) {
  try {
    const { action, type } = await request.json();

    if (action === 'sync-to-sheets') {
      if (type && ['teams', 'candidates', 'programmes'].includes(type)) {
        const result = await sheetsSync.syncToSheets(type);
        return NextResponse.json({ 
          success: true, 
          message: `Successfully synced ${result.count} ${type} records to Google Sheets`,
          result 
        });
      } else if (type === 'all') {
        // Sync all types
        const results = await Promise.all([
          sheetsSync.syncToSheets('teams'),
          sheetsSync.syncToSheets('candidates'),
          sheetsSync.syncToSheets('programmes')
        ]);
        
        const totalCount = results.reduce((sum, result) => sum + result.count, 0);
        return NextResponse.json({ 
          success: true, 
          message: `Successfully synced ${totalCount} total records to Google Sheets`,
          results 
        });
      }
    }

    if (action === 'sync-from-sheets') {
      if (type && ['teams', 'candidates', 'programmes'].includes(type)) {
        const result = await sheetsSync.syncFromSheets(type);
        return NextResponse.json({ 
          success: true, 
          message: `Successfully synced ${type} from Google Sheets: ${result.inserted} inserted, ${result.updated} updated`,
          result 
        });
      } else if (type === 'all') {
        // Sync all types
        const results = await Promise.all([
          sheetsSync.syncFromSheets('teams'),
          sheetsSync.syncFromSheets('candidates'),
          sheetsSync.syncFromSheets('programmes')
        ]);
        
        const totalInserted = results.reduce((sum, result) => sum + (result.inserted || 0), 0);
        const totalUpdated = results.reduce((sum, result) => sum + (result.updated || 0), 0);
        
        return NextResponse.json({ 
          success: true, 
          message: `Successfully synced from Google Sheets: ${totalInserted} inserted, ${totalUpdated} updated`,
          results 
        });
      }
    }

    if (action === 'import-converted-data') {
      // Import converted data directly to MongoDB
      if (!type || !['teams', 'candidates', 'programmes'].includes(type)) {
        return NextResponse.json({ error: 'Invalid type for import' }, { status: 400 });
      }

      const { data } = await request.json();
      if (!data || !Array.isArray(data)) {
        return NextResponse.json({ error: 'Invalid data for import' }, { status: 400 });
      }

      try {
        const { getDatabase } = await import('@/lib/mongodb');
        const db = await getDatabase();
        const collection = db.collection(type);

        // Insert all records
        const result = await collection.insertMany(data);
        
        return NextResponse.json({ 
          success: true, 
          message: `Successfully imported ${result.insertedCount} ${type} records`,
          insertedCount: result.insertedCount
        });
      } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({ 
          error: 'Failed to import data to database',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action or type' }, { status: 400 });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ 
      error: 'Sync failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Get sync status and configuration
export async function GET() {
  try {
    const config = {
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || 'Not configured',
      sheetsConfigured: !!(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY),
      availableTypes: ['teams', 'candidates', 'programmes'],
      syncActions: ['sync-to-sheets', 'sync-from-sheets']
    };

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error getting sync config:', error);
    return NextResponse.json({ error: 'Failed to get sync configuration' }, { status: 500 });
  }
}