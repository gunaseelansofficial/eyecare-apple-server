const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function checkAllImages() {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db();
    const products = await db.collection('products').find({}, { projection: { name: 1, image: 1 } }).toArray();
    
    let localhost = 0, external = 0, renderUploads = 0, relativeUploads = 0, other = 0;
    
    products.forEach(p => {
        const img = p.image || '';
        if (img.includes('localhost')) { localhost++; console.log(`[LOCALHOST] ${p.name}: ${img}`); }
        else if (img.startsWith('https://eyecareapple.com')) { external++; }
        else if (img.includes('onrender.com/uploads')) { renderUploads++; console.log(`[RENDER-UPLOAD] ${p.name}: ${img}`); }
        else if (img.startsWith('/uploads')) { relativeUploads++; console.log(`[RELATIVE] ${p.name}: ${img}`); }
        else { other++; console.log(`[OTHER] ${p.name}: ${img}`); }
    });
    
    console.log(`\n--- Summary (${products.length} total) ---`);
    console.log(`External (eyecareapple.com): ${external}`);
    console.log(`Render uploads: ${renderUploads}`);
    console.log(`Localhost: ${localhost}`);
    console.log(`Relative uploads: ${relativeUploads}`);
    console.log(`Other: ${other}`);
    
    await client.close();
}
checkAllImages().catch(console.error);
