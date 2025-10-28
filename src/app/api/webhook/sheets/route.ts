import { NextResponse } from 'next/server';
import { sheetsSync } from '@/lib/sheetsSync';

// Webhook endpoint for Google Sheets changes
// This can be called from Google Apps Script when sheets are edited
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sheetName, action, data } = body;

    // Validate the webhook payload
    if (!sheetName || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Map sheet names to data types
    const sheetTypeMap: { [key: string]: 'teams' | 'candidates' | 'programmes' } = {
      'Teams': 'teams',
      'Candidates': 'candidates',
      'Programmes': 'programmes'
    };

    const dataType = sheetTypeMap[sheetName];
    if (!dataType) {
      return NextResponse.json({ error: 'Invalid sheet name' }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'sync':
        // Full sync from sheets to MongoDB
        result = await sheetsSync.syncFromSheets(dataType);
        break;
      
      case 'change':
        // Partial sync - just sync the specific data type
        result = await sheetsSync.syncFromSheets(dataType);
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed ${action} for ${sheetName}`,
      result 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ 
    status: 'active',
    message: 'Google Sheets webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}