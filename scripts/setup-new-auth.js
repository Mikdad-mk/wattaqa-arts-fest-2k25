const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function setupNewAuth() {
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db('festival');
    const usersCollection = db.collection('users');
    const notificationsCollection = db.collection('notifications');
    
    // Clear existing users and notifications
    await usersCollection.deleteMany({});
    await notificationsCollection.deleteMany({});
    console.log('🗑️ Cleared existing users and notifications');
    
    // Create main admin account
    const adminUser = {
      name: 'Main Administrator',
      email: 'admin@festival.com',
      password: 'admin123', // Plain text password
      userType: 'admin',
      teamCode: null,
      status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await usersCollection.insertOne(adminUser);
    console.log('✅ Created main admin account');
    
    // Create indexes
    await usersCollection.createIndex({ email: 1, userType: 1 }, { unique: true });
    await usersCollection.createIndex({ userType: 1 });
    await usersCollection.createIndex({ teamCode: 1 });
    await notificationsCollection.createIndex({ createdAt: -1 });
    await notificationsCollection.createIndex({ read: 1 });
    await notificationsCollection.createIndex({ type: 1 });
    
    console.log('\n🔐 NEW AUTHENTICATION SYSTEM SETUP COMPLETE!');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│                  AUTHENTICATION FLOW                   │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 1. ADMIN LOGIN:                                         │');
    console.log('│    Email: admin@festival.com                           │');
    console.log('│    Password: admin123                                   │');
    console.log('│    Access: Full system control                         │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 2. TEAM ADMIN REQUEST:                                  │');
    console.log('│    - Users request access via /request-access          │');
    console.log('│    - Admin receives notification                       │');
    console.log('│    - Admin approves/rejects via /admin/team-admins     │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 3. TEAM ADMIN LOGIN:                                    │');
    console.log('│    - Only after admin approval                         │');
    console.log('│    - Login with assigned credentials                   │');
    console.log('│    - Access only their team data                       │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 4. PASSWORD MANAGEMENT:                                 │');
    console.log('│    - Admin can modify team admin passwords             │');
    console.log('│    - Plain text storage for easy management            │');
    console.log('└─────────────────────────────────────────────────────────┘');
    
    console.log('\n🌐 Available URLs:');
    console.log('- Admin Login: http://localhost:3000/login');
    console.log('- Request Access: http://localhost:3000/request-access');
    console.log('- Admin Dashboard: http://localhost:3000/admin');
    console.log('- Team Admin Management: http://localhost:3000/admin/team-admins');
    console.log('- Team Admin Dashboard: http://localhost:3000/team-admin');
    
    console.log('\n📝 How to Test:');
    console.log('1. Login as admin (admin@festival.com / admin123)');
    console.log('2. Go to /request-access and submit a team admin request');
    console.log('3. As admin, go to /admin/team-admins to see the request');
    console.log('4. Approve the request (creates team admin account)');
    console.log('5. Login as team admin with generated credentials');
    console.log('6. Admin can modify team admin passwords anytime');
    
    console.log('\n✅ Features:');
    console.log('- Simple admin authentication');
    console.log('- Team admin request system');
    console.log('- Notification-based approval workflow');
    console.log('- Password management by admin');
    console.log('- Team-specific access control');
    console.log('- Plain text passwords for easy management');
    
  } catch (error) {
    console.error('❌ Error setting up authentication:', error);
  } finally {
    await client.close();
  }
}

setupNewAuth();