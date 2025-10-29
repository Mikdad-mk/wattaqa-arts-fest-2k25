import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('festival');
    const collection = db.collection('programme_participants');

    const { searchParams } = new URL(request.url);
    const team = searchParams.get('team');
    const programme = searchParams.get('programme');

    let query: any = {};
    if (team) query.teamCode = team;
    if (programme) query.programmeId = programme;

    const participants = await collection.find(query).toArray();
    
    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching programme participants:', error);
    return NextResponse.json({ error: 'Failed to fetch programme participants' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('festival');
    const collection = db.collection('programme_participants');

    const body = await request.json();
    const { programmeId, programmeCode, programmeName, teamCode, participants, status = 'registered' } = body;

    // Validate required fields
    if (!programmeId || !teamCode || !participants || participants.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if team already registered for this programme
    const existing = await collection.findOne({
      programmeId,
      teamCode
    });

    if (existing) {
      return NextResponse.json({ error: 'Team already registered for this programme' }, { status: 400 });
    }

    const newParticipant = {
      programmeId,
      programmeCode,
      programmeName,
      teamCode,
      participants,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newParticipant);
    
    return NextResponse.json({ 
      _id: result.insertedId,
      ...newParticipant 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating programme participant:', error);
    return NextResponse.json({ error: 'Failed to create programme participant' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PUT(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('festival');
    const collection = db.collection('programme_participants');

    const body = await request.json();
    const { _id, participants, status } = body;

    if (!_id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (participants) updateData.participants = participants;
    if (status) updateData.status = status;

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Programme participant not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Programme participant updated successfully' });
  } catch (error) {
    console.error('Error updating programme participant:', error);
    return NextResponse.json({ error: 'Failed to update programme participant' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('festival');
    const collection = db.collection('programme_participants');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Programme participant not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Programme participant deleted successfully' });
  } catch (error) {
    console.error('Error deleting programme participant:', error);
    return NextResponse.json({ error: 'Failed to delete programme participant' }, { status: 500 });
  } finally {
    await client.close();
  }
}