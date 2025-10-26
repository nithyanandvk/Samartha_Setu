require('dotenv').config();
const mongoose = require('mongoose');

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📁 Collections in database:');
    console.log('─────────────────────────────');
    
    if (collections.length === 0) {
      console.log('⚠️  No collections found! Database is empty.');
      console.log('\n💡 Run "npm run seed" to populate the database.');
    } else {
      for (const coll of collections) {
        const count = await db.collection(coll.name).countDocuments();
        console.log(`  ✓ ${coll.name.padEnd(20)} ${count} documents`);
      }
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkDatabase();
