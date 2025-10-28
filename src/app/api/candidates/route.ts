import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Candidate } from '@/types';
import { ObjectId } from 'mongodb';
import { sheetsSync } from '@/lib/sheetsSync';


export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<Candidate>('candidates');
    
    // Filter out blank/empty candidates using MongoDB query
    const candidates = await collection.find({
      name: { $exists: true, $ne: '', $ne: null },
      chestNumber: { $exists: true, $ne: '', $ne: null },
      team: { $exists: true, $ne: '', $ne: null },
      section: { $exists: true, $ne: '', $ne: null },
      grade: { $exists: true, $ne: '', $ne: null }
    }).toArray();
    
    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection<Candidate>('candidates');
    
    const newCandidate: Candidate = {
      ...body,
      points: 0, // New candidates start with 0 points
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newCandidate);
    
    // Auto-sync to Google Sheets
    try {
      await sheetsSync.syncToSheets('candidates');
    } catch (syncError) {
      console.error('Error syncing to sheets:', syncError);
      // Don't fail the main operation if sync fails
    }
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 });
    }

    const body = await request.json();
    
    // Update record in MongoDB
    const db = await getDatabase();
    const collection = db.collection<Candidate>('candidates');
    
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
      await sheetsSync.syncToSheets('candidates');
    } catch (syncError) {
      console.error('Error syncing to sheets:', syncError);
      // Don't fail the main operation if sync fails
    }
    
    return NextResponse.json({ success: true, message: 'Candidate updated successfully' });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json({ error: 'Failed to update candidate' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 });
    }

    // Delete record from MongoDB
    const db = await getDatabase();
    const collection = db.collection<Candidate>('candidates');
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    // Auto-sync to Google Sheets
    try {
      await sheetsSync.syncToSheets('candidates');
    } catch (syncError) {
      console.error('Error syncing to sheets:', syncError);
      // Don't fail the main operation if sync fails
    }
    
    return NextResponse.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 });
  }
}