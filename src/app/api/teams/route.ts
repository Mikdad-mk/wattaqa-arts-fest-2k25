import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Team } from '@/types';
import { ObjectId } from 'mongodb';
import { sheetsSync } from '@/lib/sheetsSync';

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<Team>('teams');
    
    let teams = await collection.find({}).toArray();
    
    // If no teams exist, create default teams
    if (teams.length === 0) {
      const defaultTeams: Team[] = [
        {
          name: 'Team Sumud',
          color: 'green',
          description: 'Arts & Sports Excellence',
          captain: 'Ahmed Ali (001)',
          members: 45,
          points: 238,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Team Aqsa',
          color: 'gray',
          description: 'Creative & Athletic',
          captain: 'Fatima Hassan (002)',
          members: 45,
          points: 245,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Team Inthifada',
          color: 'red',
          description: 'Innovation & Competition',
          captain: 'Omar Khalil (003)',
          members: 45,
          points: 232,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await collection.insertMany(defaultTeams);
      teams = await collection.find({}).toArray();
    }
    
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Use sheetsSync to add record to both MongoDB and Google Sheets
    const result = await sheetsSync.addRecord('teams', body);
    
    return NextResponse.json({ success: true, id: result.id });
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
    
    // Use sheetsSync to update record in both MongoDB and Google Sheets
    const result = await sheetsSync.updateRecord('teams', id, body);
    
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

    // Use sheetsSync to delete record from both MongoDB and Google Sheets
    const result = await sheetsSync.deleteRecord('teams', id);
    
    return NextResponse.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
  }
}