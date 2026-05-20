const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const LOCAL_URI = 'mongodb://127.0.0.1:27017/eyecareapple';
const REMOTE_URI = process.env.MONGO_URI;

async function migrate() {
    console.log("Connecting to Local DB...", LOCAL_URI);
    const localClient = new MongoClient(LOCAL_URI);
    await localClient.connect();
    const localDb = localClient.db('eyecareapple');

    console.log("Connecting to Remote DB...");
    const remoteClient = new MongoClient(REMOTE_URI);
    await remoteClient.connect();
    const remoteDb = remoteClient.db(); // Uses the DB name from the connection string or 'test' by default

    const collections = await localDb.listCollections().toArray();
    
    for (const col of collections) {
        if (col.name.startsWith('system.')) continue;
        
        console.log(`\nMigrating collection: ${col.name}`);
        const localCol = localDb.collection(col.name);
        const remoteCol = remoteDb.collection(col.name);
        
        const docs = await localCol.find({}).toArray();
        console.log(`Found ${docs.length} documents in local ${col.name}`);
        
        if (docs.length > 0) {
            // Delete existing documents in remote collection
            await remoteCol.deleteMany({});
            console.log(`Cleared remote collection ${col.name}`);
            
            // Insert documents
            await remoteCol.insertMany(docs);
            console.log(`Successfully inserted ${docs.length} documents into remote ${col.name}`);
        } else {
            console.log(`Skipped ${col.name} (0 documents)`);
        }
    }

    console.log("\nMigration Complete!");
    await localClient.close();
    await remoteClient.close();
}

migrate().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
