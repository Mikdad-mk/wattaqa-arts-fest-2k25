import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Result } from '@/types';
import { ObjectId } from 'mongodb';
import { sheetsSync } from '@/lib/sheetsSync';

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<Result>('results');
    
    let results = await collection.find({}).toArray();
    
    // If no results exist, create default results
    if (results.length === 0) {
      const defaultResults: Result[] = [
        {
          programme: 'Classical Dance',
          section: 'senior',
          grade: 'A',
          positionType: 'individual',
          winners: [
            {
              position: 'first',
              participants: ['001'],
              points: 10
            },
            {
              position: 'second', 
              participants: ['002'],
              points: 8
            },
            {
              position: 'third',
              participants: ['003'],
              points: 6
            }
          ],
          notes: 'Excellent performance by all participants',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          programme: 'Football',
          section: 'junior',
          grade: 'A',
          positionType: 'group',
          winners: [
            {
              position: 'first',
              participants: ['Team Sumud'],
              points: 15
            },
            {
              position: 'second',
              participants: ['Team Aqsa'],
              points: 12
            },
            {
              position: 'third',
              participants: ['Team Inthifada'],
              points: 10
            }
          ],
          notes: 'Great teamwork and sportsmanship',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await collection.insertMany(defaultResults);
      results = await collection.find({}).toArray();
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Use sheetsSync to add record to both MongoDB and Google Sheets
    const result = await sheetsSync.addRecord('results', body);
    
    return NextResponse.json({ success: true, id: result.id });
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
    
    // Use sheetsSync to update record in both MongoDB and Google Sheets
    const result = await sheetsSync.updateRecord('results', id, body);
    
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

    // Use sheetsSync to delete record from both MongoDB and Google Sheets
    const result = await sheetsSync.deleteRecord('results', id);
    
    return NextResponse.json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting result:', error);
    return NextResponse.json({ error: 'Failed to delete result' }, { status: 500 });
  }
}