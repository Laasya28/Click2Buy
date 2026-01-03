import mongoose from "mongoose";
import productModel from "./models/productModel.js";
import "dotenv/config";

const cleanupProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to database");

    // Get all products
    const allProducts = await productModel.find({}).sort({ createdAt: 1 });
    console.log(`\n📦 Total products in database: ${allProducts.length}`);

    // Products that were likely seeded (not added by admin)
    // These typically have placeholder image paths like "/products/..." instead of Cloudinary URLs
    const seededProducts = allProducts.filter((product) => {
      const hasLocalImagePath = product.images.some(
        (img) => img.startsWith("/products/") || !img.includes("cloudinary")
      );
      return hasLocalImagePath;
    });

    console.log(`\n🔍 Found ${seededProducts.length} products with local/non-Cloudinary images (likely seeded)`);
    
    if (seededProducts.length > 0) {
      console.log("\nFirst 10 products to be deleted:");
      seededProducts.slice(0, 10).forEach((p, index) => {
        console.log(`${index + 1}. ${p.name} - Images: ${p.images[0]?.substring(0, 50)}...`);
      });
      
      if (seededProducts.length > 10) {
        console.log(`... and ${seededProducts.length - 10} more`);
      }

      // Delete seeded products
      const productIds = seededProducts.map(p => p._id);
      const result = await productModel.deleteMany({ _id: { $in: productIds } });
      
      console.log(`\n✅ Deleted ${result.deletedCount} seeded products`);
      
      // Check remaining products
      const remainingProducts = await productModel.find({});
      console.log(`\n📦 Remaining products (admin-added): ${remainingProducts.length}`);
      
      if (remainingProducts.length > 0) {
        console.log("\nRemaining products:");
        remainingProducts.slice(0, 10).forEach((p, index) => {
          console.log(`${index + 1}. ${p.name} - $${p.price}`);
        });
        if (remainingProducts.length > 10) {
          console.log(`... and ${remainingProducts.length - 10} more`);
        }
      }
    } else {
      console.log("\n✅ No seeded products found. All products appear to be admin-added.");
    }

    await mongoose.disconnect();
    console.log("\n🎯 Cleanup completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

cleanupProducts();
