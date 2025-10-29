const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function setupSimpleAuth() {
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db('festival');
    const usersCollection = db.collection('users');
    
    // Clear existing users
    await usersCollection.deleteMany({});
    console.log('🗑️ Cleared existing users');
    
    // Create demo users with plain text passwords
    const demoUsers = [
      {
        name: 'Main Administrator',
        email: 'admin@festival.com',
        password: 'admin123', // Plain text password
        userType: 'admin',
        teamCode: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'SMD Team Admin',
        email: 'smd@team.com',
        password: 'smd123',
        userType: 'team-admin',
        teamCode: 'SMD',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'INT Team Admin',
        email: 'int@team.com',
        password: 'int123',
        userType: 'team-admin',
        teamCode: 'INT',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'AQS Team Admin',
        email: 'aqs@team.com',
        password: 'aqs123',
        userType: 'team-admin',
        teamCode: 'AQS',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Regular User',
        email: 'user@festival.com',
        password: 'user123',
        userType: 'user',
        teamCode: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const result = await usersCollection.insertMany(demoUsers);
    console.log(`✅ Created ${result.insertedCount} demo users`);
    
    // Create indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ userType: 1 });
    await usersCollection.createIndex({ teamCode: 1 });
    
    console.log('\n📧 Demo Accounts Created:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│                    LOGIN CREDENTIALS                    │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ MAIN ADMIN:                                             │');
    console.log('│   Email: admin@festival.com                            │');
    console.log('│   Password: admin123                                    │');
    console.log('│   Access: Full system access                           │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ TEAM ADMINS:                                            │');
    console.log('│   SMD: smd@team.com / smd123                           │');
    console.log('│   INT: int@team.com / int123                           │');
    console.log('│   AQS: aqs@team.com / aqs123                           │');
    console.log('│   Access: Team-specific management                     │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ REGULAR USER:                                           │');
    console.log('│   Email: user@festival.com                             │');
    console.log('│   Password: user123                                     │');
    console.log('│   Access: Basic user access                            │');
    console.log('└─────────────────────────────────────────────────────────┘');
    
    console.log('\n🔐 Simple Authentication System Features:');
    console.log('✅ Plain text passwords (no bcrypt)');
    console.log('✅ First user becomes main admin automatically');
    console.log('✅ Role-based redirection on login');
    console.log('✅ Admin can change user roles in database');
    console.log('✅ Team admins get team-specific access');
    
    console.log('\n🌐 URLs to Test:');
    console.log('- Login: http://localhost:3000/login');
    console.log('- Signup: http://localhost:3000/signup');
    console.log('- Admin Panel: http://localhost:3000/admin');
    console.log('- User Management: http://localhost:3000/admin/users');
    console.log('- Team Admin: http://localhost:3000/team-admin');
    
    console.log('\n📝 How It Works:');
    console.log('1. First user to signup becomes main admin');
    console.log('2. Users with team codes become team admins');
    console.log('3. Users without team codes become regular users');
    console.log('4. Admin can change roles via /admin/users page');
    console.log('5. Role changes take effect on next login');
    
  } catch (error) {
    console.error('❌ Error setting up authentication:', error);
  } finally {
    await client.close();
  }
}

setupSimpleAuth();