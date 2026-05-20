const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const REMOTE_URI = process.env.MONGO_URI;

async function fixImages() {
    console.log("Connecting to Remote DB...");
    const client = new MongoClient(REMOTE_URI);
    
    try {
        await client.connect();
        const db = client.db(); 
        const productsCol = db.collection('products');
        
        const products = await productsCol.find({ image: { $regex: /^http:\/\/localhost:5000/ } }).toArray();
        console.log(`Found ${products.length} products with localhost image URLs.`);
        
        let count = 0;
        for (let p of products) {
            const newImageUrl = p.image.replace('http://localhost:5000', 'https://eyecare-apple-server.onrender.com');
            await productsCol.updateOne(
                { _id: p._id },
                { $set: { image: newImageUrl } }
            );
            count++;
        }
        
        console.log(`Successfully updated ${count} image URLs to point to https://eyecare-apple-server.onrender.com!`);
    } catch (err) {
        console.error("Error fixing images:", err);
    } finally {
        await client.close();
    }
}

fixImages();
