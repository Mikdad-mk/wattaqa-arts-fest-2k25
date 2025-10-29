import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('festival');
    const usersCollection = db.collection('users');

    const teamAdmins = await usersCollection.find(
      { userType: 'team-admin' },
      { projection: { password: 1, name: 1, email: 1, teamCode: 1, status: 1, createdAt: 1, lastLogin: 1 } }
    ).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(teamAdmins);
  } catch (error) {
    console.error('Error fetching team admins:', error);
    return NextResponse.json({ error: 'Failed to fetch team admins' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('festival');
    const usersCollection = db.collection('users');
    const teamsCollection = db.collection('teams');

    const body = await request.json();
    const { name, email, teamCode, password } = body;

    if (!name || !email || !teamCode || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Validate team code
    const team = await teamsCollection.findOne({ code: teamCode });
    if (!team) {
      return NextResponse.json({ error: 'Invalid team code' }, { status: 400 });
    }

    // Create team admin
    const newTeamAdmin = {
      name,
      email: email.toLowerCase(),
      password, // Plain text password
      userType: 'team-admin',
      teamCode,
      status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(newTeamAdmin);

    return NextResponse.json({
      success: true,
      message: 'Team admin created successfully',
      teamAdmin: {
        id: result.insertedId,
        name,
        email,
        teamCode
      }
    });

  } catch (error) {
    console.error('Error creating team admin:', error);
    return NextResponse.json({ error: 'Failed to create team admin' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PUT(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('festival');
    const usersCollection = db.collection('users');
    const teamsCollection = db.collection('teams');

    const body = await request.json();
    const { adminId, name, email, teamCode, password } = body;

    if (!adminId || !name || !email || !teamCode || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate team code
    const team = await teamsCollection.findOne({ code: teamCode });
    if (!team) {
      return NextResponse.json({ error: 'Invalid team code' }, { status: 400 });
    }

    // Update team admin
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(adminId), userType: 'team-admin' },
      { 
        $set: { 
          name,
          email: email.toLowerCase(),
          teamCode,
          password,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Team admin not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Team admin updated successfully'
    });

  } catch (error) {
    console.error('Error updating team admin:', error);
    return NextResponse.json({ error: 'Failed to update team admin' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('festival');
    const usersCollection = db.collection('users');

    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('id');

    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    const result = await usersCollection.deleteOne({ 
      _id: new ObjectId(adminId),
      userType: 'team-admin'
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Team admin not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Team admin deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting team admin:', error);
    return NextResponse.json({ error: 'Failed to delete team admin' }, { status: 500 });
  } finally {
    await client.close();
  }
}