const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Category = require('./models/Category');
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const products = [
    {
        name: "Bio-Medical Daily Contacts",
        description: "High-oxygen permeability lenses for all-day comfort and crystal clear vision.",
        category: "OTHERS",
        image: "https://eyecareapple.com/wp-content/uploads/2025/07/5.Exogain.png",
        order: 1,
        keyBenefits: ["Provides long-lasting relief", "Suitable for all-day wear"],
        howToUse: ["Wash hands before handling", "Place lens on finger tip"],
        whoCanUse: ["Adults", "Contact lens wearers"]
    },
    {
        name: "Titanium Tech Frames",
        description: "Ultra-lightweight titanium frames designed for precision and durability.",
        category: "OTHERS",
        image: "https://eyecareapple.com/wp-content/uploads/2025/09/1.Hylorich_10ml.webp",
        order: 2
    },
    {
        name: "Aviator Gold Edition",
        description: "Classic aviator silhouette with 18k gold plating and polarized lenses.",
        category: "OTHERS",
        image: "https://eyecareapple.com/wp-content/uploads/2025/07/2.Hylo_Fresh.png",
        order: 3
    },
    {
        name: "Moisture-Lock Eye Drops",
        description: "Advanced formula for instant relief from digital eye strain and dryness.",
        category: "DRY EYES",
        image: "https://eyecareapple.com/wp-content/uploads/2025/07/3.Lubi_fresh.png",
        order: 4
    },
    {
        name: "Pro-Clean Optical Kit",
        description: "Everything you need to keep your lenses streak-free and protected.",
        category: "LID HYGIENE",
        image: "https://eyecareapple.com/wp-content/uploads/2025/07/4.Lubi-Gel.png",
        order: 5
    },
    {
        name: "Retro-Chic Reading Glasses",
        description: "Stylish reading glasses that blend vintage aesthetics with modern optics.",
        category: "OTHERS",
        image: "https://eyecareapple.com/wp-content/uploads/2025/07/5.Lubi_-Top.png",
        order: 6
    },
    {
        name: "Sport-Flex Sunglasses",
        description: "Wrap-around design for maximum coverage during high-intensity activities.",
        category: "OTHERS",
        image: "https://eyecareapple.com/wp-content/uploads/2025/07/6.Lubitop-HA.png",
        order: 7
    },
    {
        name: "Multi-Purpose Lens Solution",
        description: "Cleans, disinfects, and conditions all types of soft contact lenses.",
        category: "ANTI-INFECTIVE",
        image: "https://eyecareapple.com/wp-content/uploads/2025/07/7.Add_lubi.png",
        order: 8
    },
    {
        name: "Executive Leather Case",
        description: "Handcrafted leather case to keep your premium eyewear safe and scratch-free.",
        category: "OTHERS",
        image: "https://eyecareapple.com/wp-content/uploads/2025/07/8.Hp_Moist.png",
        order: 9
    }
];

const categoriesToSeed = [
    "DRY EYES",
    "ANTI-INFECTIVE",
    "ANTI-INFECTIVE + STEROID COMBINATION",
    "ANTI-INFLAMMATORY",
    "GLAUCOMA CARE",
    "ANTI ALLERGIC",
    "OCULAR NUTRIENT",
    "STEROIDAL ANTI-INFLAMMATORY",
    "LID HYGIENE",
    "OTHERS"
];

const seedDB = async () => {
    try {
        await Product.deleteMany({});
        await Category.deleteMany({});
        await User.deleteMany({});

        const categoryData = categoriesToSeed.map((name, index) => ({
            name,
            order: index + 1
        }));
        
        await Category.insertMany(categoryData);
        console.log("Categories Seeded!");

        // Seed products individually to trigger pre-save hooks (for slugs)
        for (const p of products) {
            await Product.create(p);
        }
        console.log("Database Seeded with products!");

        await User.create({
            name: "Admin User",
            email: "admin@eyecareapple.com",
            password: "adminpassword",
            role: "Admin"
        });
        console.log("Admin User Seeded!");
    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        process.exit();
    }
};

seedDB();
