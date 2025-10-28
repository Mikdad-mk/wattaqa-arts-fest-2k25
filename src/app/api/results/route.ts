import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Result } from '@/types';
import { ObjectId } from 'mongodb';
import { sheetsSync } from '@/lib/sheetsSync';


export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<Result>('results');
    
    const results = await collection.find({}).toArray();
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Add record to MongoDB
    const db = await getDatabase();
    const collection = db.collection<Result>('results');
    
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Auto-sync to Google Sheets
    try {
      await sheetsSync.syncToSheets('results');
    } catch (syncError) {
      console.error('Error syncing to sheets:', syncError);
      // Don't fail the main operation if sync fails
    }
    
    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (error) {
    console.error('Error creating result:', error);
    return NextResponse.json({ error: 'Failed to create result' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Result ID is required' }, { status: 400 });
    }

    const body = await request.json();
    
    // Update record in MongoDB
    const db = await getDatabase();
    const collection = db.collection<Result>('results');
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...body, 
          updatedAt: new Date() 
        } 
      }
    );

    // Auto-sync to Google Sheets
    try {
      await sheetsSync.syncToSheets('results');
    } catch (syncError) {
      console.error('Error syncing to sheets:', syncError);
      // Don't fail the main operation if sync fails
    }
    
    return NextResponse.json({ success: true, message: 'Result updated successfully' });
  } catch (error) {
    console.error('Error updating result:', error);
    return NextResponse.json({ error: 'Failed to update result' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Result ID is required' }, { status: 400 });
    }

    // Delete record from MongoDB
    const db = await getDatabase();
    const collection = db.collection<Result>('results');
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    // Auto-sync to Google Sheets
    try {
      await sheetsSync.syncToSheets('results');
    } catch (syncError) {
      console.error('Error syncing to sheets:', syncError);
      // Don't fail the main operation if sync fails
    }
    
    return NextResponse.json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting result:', error);
    return NextResponse.json({ error: 'Failed to delete result' }, { status: 500 });
  }
}