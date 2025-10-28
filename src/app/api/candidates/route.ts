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
    let candidates = await collection.find({
      name: { $exists: true, $ne: '', $ne: null },
      chestNumber: { $exists: true, $ne: '', $ne: null },
      team: { $exists: true, $ne: '', $ne: null },
      section: { $exists: true, $ne: '', $ne: null }
    }).toArray();
    
    // If no valid candidates exist, create default candidates
    if (candidates.length === 0) {
      const defaultCandidates: Candidate[] = [
        {
          chestNumber: '001',
          name: 'Ahmed Ali',
          team: 'SUMUD',
          section: 'senior',
          points: 45,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          chestNumber: '002',
          name: 'Fatima Hassan',
          team: 'AQSA',
          section: 'junior',
          points: 42,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          chestNumber: '003',
          name: 'Omar Khalil',
          team: 'INTIFADA',
          section: 'sub-junior',
          points: 40,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await collection.insertMany(defaultCandidates);
      candidates = await collection.find({
        name: { $exists: true, $ne: '', $ne: null },
        chestNumber: { $exists: true, $ne: '', $ne: null },
        team: { $exists: true, $ne: '', $ne: null },
        section: { $exists: true, $ne: '', $ne: null }
      }).toArray();
    }
    
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
    
    // Note: Automatic Google Sheets sync temporarily disabled to avoid quota issues
    
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
    
    // Use sheetsSync to update record in both MongoDB and Google Sheets
    const result = await sheetsSync.updateRecord('candidates', id, body);
    
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

    // Use sheetsSync to delete record from both MongoDB and Google Sheets
    const result = await sheetsSync.deleteRecord('candidates', id);
    
    return NextResponse.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 });
  }
}