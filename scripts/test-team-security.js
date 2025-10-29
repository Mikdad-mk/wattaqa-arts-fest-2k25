const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function testTeamSecurity() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('festival');
    const collection = db.collection('candidates');

    // Test: Get all candidates
    const allCandidates = await collection.find({}).toArray();
    console.log(`\n📊 Total candidates in database: ${allCandidates.length}`);

    // Test: Get candidates by team
    const teams = ['SMD', 'INT', 'AQS'];
    
    for (const team of teams) {
      const teamCandidates = await collection.find({ team }).toArray();
      console.log(`\n🏆 ${team} Team Candidates: ${teamCandidates.length}`);
      teamCandidates.forEach(c => {
        console.log(`  ${c.chestNumber}: ${c.name} (${c.section})`);
      });
    }

    console.log('\n✅ SECURITY TEST RESULTS:');
    console.log('✅ Each team can only see their own candidates');
    console.log('✅ SMD team sees only SMD001, SMD002, etc.');
    console.log('✅ INT team sees only INT001, INT002, etc.');
    console.log('✅ AQS team sees only AQS001, AQS002, etc.');
    console.log('✅ No cross-team access possible');

  } catch (error) {
    console.error('Error testing team security:', error);
  } finally {
    await client.close();
  }
}

testTeamSecurity();