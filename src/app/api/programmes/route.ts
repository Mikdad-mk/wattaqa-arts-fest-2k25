import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Programme } from '@/types';

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<Programme>('programmes');
    
    let programmes = await collection.find({}).toArray();
    
    // If no programmes exist, create default programmes
    if (programmes.length === 0) {
      const defaultProgrammes: Programme[] = [
        // Arts Programmes
        { code: 'P001', name: 'Classical Singing', category: 'arts', section: 'senior', positionType: 'individual', status: 'active' },
        { code: 'P002', name: 'Group Dance', category: 'arts', section: 'junior', positionType: 'group', status: 'active' },
        { code: 'P003', name: 'Painting Competition', category: 'arts', section: 'sub-junior', positionType: 'individual', status: 'active' },
        { code: 'P004', name: 'Drama Performance', category: 'arts', section: 'senior', positionType: 'group', status: 'active' },
        { code: 'P005', name: 'Poetry Recitation', category: 'arts', section: 'junior', positionType: 'individual', status: 'active' },
        { code: 'P006', name: 'Calligraphy', category: 'arts', section: 'general', positionType: 'individual', status: 'active' },
        { code: 'P007', name: 'Storytelling', category: 'arts', section: 'sub-junior', positionType: 'individual', status: 'active' },
        { code: 'P008', name: 'Instrumental Music', category: 'arts', section: 'senior', positionType: 'individual', status: 'active' },
        
        // Sports Programmes
        { code: 'P009', name: 'Football Tournament', category: 'sports', section: 'general', positionType: 'group', status: 'active' },
        { code: 'P010', name: 'Basketball', category: 'sports', section: 'senior', positionType: 'group', status: 'active' },
        { code: 'P011', name: 'Table Tennis', category: 'sports', section: 'junior', positionType: 'individual', status: 'active' },
        { code: 'P012', name: 'Badminton', category: 'sports', section: 'senior', positionType: 'individual', status: 'active' },
        { code: 'P013', name: 'Track & Field', category: 'sports', section: 'general', positionType: 'individual', status: 'active' },
        { code: 'P014', name: 'Chess Competition', category: 'sports', section: 'junior', positionType: 'individual', status: 'active' },
        { code: 'P015', name: 'Volleyball', category: 'sports', section: 'senior', positionType: 'group', status: 'active' }
      ];
      
      const programmesWithDates = defaultProgrammes.map(prog => ({
        ...prog,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      await collection.insertMany(programmesWithDates);
      programmes = await collection.find({}).toArray();
    }
    
    return NextResponse.json(programmes);
  } catch (error) {
    console.error('Error fetching programmes:', error);
    return NextResponse.json({ error: 'Failed to fetch programmes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection<Programme>('programmes');
    
    const newProgramme: Programme = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newProgramme);
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating programme:', error);
    return NextResponse.json({ error: 'Failed to create programme' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Programme ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection<Programme>('programmes');
    
    const result = await collection.deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Programme not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Programme deleted successfully' });
  } catch (error) {
    console.error('Error deleting programme:', error);
    return NextResponse.json({ error: 'Failed to delete programme' }, { status: 500 });
  }
}