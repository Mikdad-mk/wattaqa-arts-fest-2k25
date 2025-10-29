const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function setupAuthentication() {
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db('festival');
    const usersCollection = db.collection('users');
    const notificationsCollection = db.collection('notifications');
    
    // Check if users already exist
    const existingUsers = await usersCollection.find({}).toArray();
    console.log(`📊 Existing users: ${existingUsers.length}`);
    
    if (existingUsers.length === 0) {
      console.log('🔧 Creating demo accounts...');
      
      // Create admin account
      const adminPassword = await bcrypt.hash('admin123', 12);
      const adminUser = {
        name: 'System Administrator',
        email: 'admin@festival.com',
        password: adminPassword,
        userType: 'admin',
        teamCode: null,
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Create team admin accounts for each team
      const teams = ['SMD', 'INT', 'AQS'];
      const teamAdminPassword = await bcrypt.hash('team123', 12);
      
      const teamAdmins = teams.map(teamCode => ({
        name: `${teamCode} Team Admin`,
        email: `team@${teamCode.toLowerCase()}.com`,
        password: teamAdminPassword,
        userType: 'team-admin',
        teamCode: teamCode,
        status: 'approved', // Pre-approved for demo
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      // Insert all users
      const allUsers = [adminUser, ...teamAdmins];
      const result = await usersCollection.insertMany(allUsers);
      
      console.log(`✅ Created ${result.insertedCount} demo accounts:`);
      console.log('📧 Admin Account:');
      console.log('   Email: admin@festival.com');
      console.log('   Password: admin123');
      console.log('   Type: System Admin');
      
      console.log('\n📧 Team Admin Accounts:');
      teams.forEach(team => {
        console.log(`   ${team}: team@${team.toLowerCase()}.com / team123`);
      });
      
      // Create a sample notification
      await notificationsCollection.insertOne({
        type: 'system',
        title: 'Authentication System Setup',
        message: 'Authentication system has been successfully configured with demo accounts.',
        read: false,
        createdAt: new Date()
      });
      
    } else {
      console.log('✅ Users already exist in database');
      existingUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.userType}) - Status: ${user.status}`);
      });
    }
    
    // Create indexes for better performance
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ userType: 1 });
    await usersCollection.createIndex({ teamCode: 1 });
    await notificationsCollection.createIndex({ createdAt: -1 });
    await notificationsCollection.createIndex({ read: 1 });
    
    console.log('\n🔐 Authentication System Setup Complete!');
    console.log('📝 Next Steps:');
    console.log('1. Install required packages: npm install bcryptjs jsonwebtoken');
    console.log('2. Add JWT_SECRET to your .env.local file');
    console.log('3. Visit /login to test the authentication');
    console.log('4. Visit /signup to create new accounts');
    console.log('5. Team admin signups will require admin approval');
    
    console.log('\n🌐 URLs:');
    console.log('- Login: http://localhost:3000/login');
    console.log('- Signup: http://localhost:3000/signup');
    console.log('- Admin Dashboard: http://localhost:3000/admin');
    console.log('- Team Admin Dashboard: http://localhost:3000/team-admin');
    
  } catch (error) {
    console.error('❌ Error setting up authentication:', error);
  } finally {
    await client.close();
  }
}

setupAuthentication();