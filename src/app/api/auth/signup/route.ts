import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('festival');
    const usersCollection = db.collection('users');
    const teamsCollection = db.collection('teams');
    const notificationsCollection = db.collection('notifications');

    const body = await request.json();
    const { name, email, teamCode, message } = body;

    if (!name || !email || !teamCode) {
      return NextResponse.json({ error: 'Name, email, and team code are required' }, { status: 400 });
    }

    // Validate team code
    const team = await teamsCollection.findOne({ code: teamCode });
    if (!team) {
      return NextResponse.json({ error: 'Invalid team code' }, { status: 400 });
    }

    // Check if request already exists
    const existingRequest = await notificationsCollection.findOne({
      type: 'team-admin-request',
      'data.email': email.toLowerCase(),
      'data.teamCode': teamCode
    });

    if (existingRequest) {
      return NextResponse.json({ error: 'Request already submitted for this team' }, { status: 400 });
    }

    // Create notification for admin
    await notificationsCollection.insertOne({
      type: 'team-admin-request',
      title: 'Team Admin Access Request',
      message: `${name} (${email}) is requesting team admin access for ${teamCode}`,
      data: {
        name,
        email: email.toLowerCase(),
        teamCode,
        message: message || '',
        requestedAt: new Date()
      },
      read: false,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Your request has been submitted to the admin for approval.'
    });

  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await client.close();
  }
}