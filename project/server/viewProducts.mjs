import mongoose from "mongoose";
import productModel from "./models/productModel.js";
import "dotenv/config";

const viewProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to database\n");

        const products = await productModel.find({}).sort({ category: 1, name: 1 });
        console.log(`📦 Total products: ${products.length}\n`);

        // Group by category
        const byCategory = {};
        products.forEach(p => {
            if (!byCategory[p.category]) {
                byCategory[p.category] = [];
            }
            byCategory[p.category].push(p);
        });

        // Display by category
        Object.keys(byCategory).sort().forEach(category => {
            console.log(`\n📁 ${category} (${byCategory[category].length} products)`);
            console.log("─".repeat(60));
            byCategory[category].forEach((p, i) => {
                const imgPreview = p.images[0]?.substring(0, 40) || "No image";
                console.log(`${i + 1}. ${p.name}`);
                console.log(`   Price: ₹${p.price} | Stock: ${p.stock} | Available: ${p.isAvailable}`);
                console.log(`   Image: ${imgPreview}...`);
            });
        });

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

viewProducts();
