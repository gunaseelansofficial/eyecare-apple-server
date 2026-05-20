const { MongoClient } = require('mongodb');

async function listDbs() {
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    try {
        await client.connect();
        const dbs = await client.db().admin().listDatabases();
        console.log(dbs.databases.map(db => db.name));
    } catch (err) {
        console.error("Error connecting to local MongoDB:", err.message);
    } finally {
        await client.close();
    }
}
listDbs();
