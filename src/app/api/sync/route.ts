import { NextResponse } from 'next/server';
import { sheetsSync } from '@/lib/sheetsSync';

// Sync all data from MongoDB to Google Sheets
export async function POST(request: Request) {
  try {
    const { action, type } = await request.json();

    if (action === 'sync-to-sheets') {
      // Only sync candidates, programmes, and results (teams and basic info are fixed)
      if (type && ['candidates', 'programmes', 'results'].includes(type)) {
        const result = await sheetsSync.syncToSheets(type as any);
        return NextResponse.json({
          success: true,
          message: `Successfully synced ${result.count} ${type} records to Google Sheets`,
          result
        });
      } else if (type === 'all') {
        // Sync only the allowed types with delays to avoid quota limits
        const results = [];
        const types = ['candidates', 'programmes', 'results']; // Only sync these types

        for (let i = 0; i < types.length; i++) {
          const syncType = types[i];
          try {
            const result = await sheetsSync.syncToSheets(syncType as any);
            results.push(result);

            // Add delay between syncs to respect rate limits
            if (i < types.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
            }
          } catch (error) {
            console.error(`Error syncing ${syncType}:`, error);
            results.push({ count: 0, error: error instanceof Error ? error.message : 'Unknown error' });
          }
        }

        const totalCount = results.reduce((sum, result) => sum + (result.count || 0), 0);
        return NextResponse.json({
          success: true,
          message: `Successfully synced ${totalCount} total records to Google Sheets`,
          results
        });
      } else if (type && ['basic', 'teams'].includes(type)) {
        // Return message for fixed data types
        return NextResponse.json({
          success: false,
          error: `${type} data is fixed and does not sync with Google Sheets`
        });
      }
    }

    if (action === 'sync-from-sheets') {
      // Only sync candidates, programmes, and results (teams and basic info are fixed)
      if (type && ['candidates', 'programmes', 'results'].includes(type)) {
        const result = await sheetsSync.syncFromSheets(type as any);
        return NextResponse.json({
          success: true,
          message: `Successfully synced ${type} from Google Sheets: ${result.inserted} inserted, ${result.updated} updated`,
          result
        });
      } else if (type === 'all') {
        // Sync only the allowed types with delays to avoid quota limits
        const results = [];
        const types = ['candidates', 'programmes', 'results']; // Only sync these types

        for (let i = 0; i < types.length; i++) {
          const syncType = types[i];
          try {
            const result = await sheetsSync.syncFromSheets(syncType as any);
            results.push(result);

            // Add delay between syncs to respect rate limits
            if (i < types.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay for from-sheets (more intensive)
            }
          } catch (error) {
            console.error(`Error syncing ${syncType} from sheets:`, error);
            results.push({ inserted: 0, updated: 0, error: error instanceof Error ? error.message : 'Unknown error' });
          }
        }

        const totalInserted = results.reduce((sum, result) => sum + (result.inserted || 0), 0);
        const totalUpdated = results.reduce((sum, result) => sum + (result.updated || 0), 0);

        return NextResponse.json({
          success: true,
          message: `Successfully synced from Google Sheets: ${totalInserted} inserted, ${totalUpdated} updated`,
          results
        });
      } else if (type && ['basic', 'teams'].includes(type)) {
        // Return message for fixed data types
        return NextResponse.json({
          success: false,
          error: `${type} data is fixed and does not sync with Google Sheets`
        });
      }
    }

    if (action === 'import-converted-data') {
      // Import converted data directly to MongoDB (only for synced data types)
      if (!type || !['candidates', 'programmes', 'results'].includes(type)) {
        return NextResponse.json({
          error: type && ['basic', 'teams'].includes(type)
            ? `${type} data is fixed and cannot be imported`
            : 'Invalid type for import'
        }, { status: 400 });
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
      availableTypes: ['candidates', 'programmes', 'results'], // Only these types sync
      fixedTypes: ['basic', 'teams'], // These are fixed and don't sync
      syncActions: ['sync-to-sheets', 'sync-from-sheets']
    };

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error getting sync config:', error);
    return NextResponse.json({ error: 'Failed to get sync configuration' }, { status: 500 });
  }
}