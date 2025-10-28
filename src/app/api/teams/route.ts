import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Team } from '@/types';
import { ObjectId } from 'mongodb';
import { sheetsSync } from '@/lib/sheetsSync';

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<Team>('teams');
    
    const teams = await collection.find({}).toArray();
    
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection<Team>('teams');
    
    // Check if team code already exists
    const existingTeam = await collection.findOne({ code: body.code });
    if (existingTeam) {
      return NextResponse.json({ error: 'Team code already exists' }, { status: 400 });
    }
    
    const newTeam: Team = {
      ...body,
      members: 0,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newTeam);
    
    // Auto-sync to Google Sheets
    try {
      await sheetsSync.syncToSheets('teams');
    } catch (syncError) {
      console.error('Error syncing to sheets:', syncError);
      // Don't fail the main operation if sync fails
    }
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection<Team>('teams');
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    };
    
    delete updateData._id;
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    // Auto-sync to Google Sheets
    try {
      await sheetsSync.syncToSheets('teams');
    } catch (syncError) {
      console.error('Error syncing to sheets:', syncError);
      // Don't fail the main operation if sync fails
    }

    return NextResponse.json({ success: true, message: 'Team updated successfully' });
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection<Team>('teams');
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    // Auto-sync to Google Sheets
    try {
      await sheetsSync.syncToSheets('teams');
    } catch (syncError) {
      console.error('Error syncing to sheets:', syncError);
      // Don't fail the main operation if sync fails
    }

    return NextResponse.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
  }
}