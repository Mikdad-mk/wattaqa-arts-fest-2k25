import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('festival');
    const collection = db.collection('notifications');

    const notifications = await collection.find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PUT(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('festival');
    const notificationsCollection = db.collection('notifications');
    const usersCollection = db.collection('users');

    const body = await request.json();
    const { notificationId, action } = body; // action: 'approve' | 'reject' | 'mark-read'

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    const notification = await notificationsCollection.findOne({ 
      _id: new ObjectId(notificationId) 
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    if (action === 'mark-read') {
      await notificationsCollection.updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { read: true } }
      );
      return NextResponse.json({ success: true, message: 'Notification marked as read' });
    }

    if (notification.type === 'team-admin-signup' && (action === 'approve' || action === 'reject')) {
      const userId = notification.data.userId;
      const newStatus = action === 'approve' ? 'approved' : 'rejected';

      // Update user status
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { status: newStatus, updatedAt: new Date() } }
      );

      // Mark notification as read
      await notificationsCollection.updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { read: true, action: action, actionAt: new Date() } }
      );

      // Create a response notification for the user
      await notificationsCollection.insertOne({
        type: 'approval-response',
        title: `Account ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        message: action === 'approve' 
          ? `Your team admin account has been approved. You can now login.`
          : `Your team admin account has been rejected. Please contact the administrator.`,
        userId: new ObjectId(userId),
        read: false,
        createdAt: new Date()
      });

      return NextResponse.json({ 
        success: true, 
        message: `Team admin ${action === 'approve' ? 'approved' : 'rejected'} successfully` 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  } finally {
    await client.close();
  }
}