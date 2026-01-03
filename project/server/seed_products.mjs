import mongoose from "mongoose";
import "dotenv/config";
import productModel from "./models/productModel.js";

const products = [
    // --- Best Sellers (Electronics & Gadgets) ---
    {
        name: "Apple iPhone 15 Pro Max",
        price: 159900,
        description: "The ultimate iPhone with titanium design, A17 Pro chip, and the most powerful camera system ever.",
        category: "Electronics",
        brand: "Apple",
        stock: 50,
        images: ["https://images.unsplash.com/photo-1696446701796-da112b1901e9?q=80&w=2670&auto=format&fit=crop"],
        _type: "bestseller",
        isAvailable: true,
        tags: ["smartphone", "apple", "iphone", "tech"]
    },
    {
        name: "Sony WH-1000XM5 Headphones",
        price: 29990,
        description: "Industry-leading noise cancellation headphones with exceptional sound quality and comfort.",
        category: "Electronics",
        brand: "Sony",
        stock: 100,
        images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2588&auto=format&fit=crop"],
        _type: "bestseller",
        isAvailable: true,
        tags: ["audio", "headphones", "sony", "music"]
    },
    {
        name: "Samsung Galaxy S24 Ultra",
        price: 129999,
        description: "AI-powered innovative smartphone with S Pen and ultimate zoom camera capabilities.",
        category: "Electronics",
        brand: "Samsung",
        stock: 45,
        images: ["https://images.unsplash.com/photo-1610945265078-386f3b589b96?q=80&w=2670&auto=format&fit=crop"],
        _type: "bestseller",
        isAvailable: true,
        tags: ["smartphone", "android", "samsung", "ai"]
    },
    {
        name: "PlayStation 5 Console",
        price: 54990,
        description: "Experience lightning fast loading with an ultra-high speed SSD and deeper immersion.",
        category: "Electronics",
        brand: "Sony",
        stock: 15,
        images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2672&auto=format&fit=crop"],
        _type: "bestseller",
        isAvailable: true,
        tags: ["gaming", "console", "sony", "ps5"]
    },
    {
        name: "Nike Air Jordan 1 High",
        price: 16995,
        description: "The shoe that started it all. Iconic design with premium leather and Air cushioning.",
        category: "Fashion",
        brand: "Nike",
        stock: 40,
        images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2670&auto=format&fit=crop"],
        _type: "bestseller",
        isAvailable: true,
        tags: ["shoes", "sneakers", "nike", "fashion"]
    },
    {
        name: "Modern Velvet Sofa",
        price: 45999,
        description: "Luxurious velvet sofa in emerald green with gold legs. A statement piece.",
        category: "Furniture",
        brand: "West Elm",
        stock: 10,
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2670&auto=format&fit=crop"],
        _type: "bestseller",
        isAvailable: true,
        tags: ["sofa", "living room", "luxury", "velvet"]
    },
    {
        name: "Adidas Ultraboost Light",
        price: 13999,
        description: "Experience epic energy with our lightest Ultraboost ever. Responsive cushioning.",
        category: "Sports",
        brand: "Adidas",
        stock: 75,
        images: ["https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=2631&auto=format&fit=crop"],
        _type: "bestseller",
        isAvailable: true,
        tags: ["shoes", "running", "sports", "adidas"]
    },
    {
        name: "Kindle Paperwhite",
        price: 14999,
        description: "Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life.",
        category: "Electronics",
        brand: "Amazon",
        stock: 120,
        images: ["https://images.unsplash.com/photo-1594980596853-75cfdb463eee?q=80&w=2625&auto=format&fit=crop"],
        _type: "bestseller",
        isAvailable: true,
        tags: ["reader", "ebook", "kindle", "tablet"]
    },
    {
        name: "Dyson V15 Detect",
        price: 65900,
        description: "Powerful cordless vacuum. Laser reveals microscopic dust. Intelligently optimizes suction.",
        category: "Home & Kitchen",
        brand: "Dyson",
        stock: 20,
        images: ["https://images.unsplash.com/photo-1558317374-a354d5f6d40b?q=80&w=2000&auto=format&fit=crop"],
        _type: "bestseller",
        isAvailable: true,
        tags: ["vacuum", "cleaning", "home", "dyson"]
    },

    // --- New Arrivals ---
    {
        name: "MacBook Air M3",
        price: 114900,
        description: "Supercharged by M3, the world's most popular laptop is faster and more capable than ever.",
        category: "Electronics",
        brand: "Apple",
        stock: 30,
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=2526&auto=format&fit=crop"],
        _type: "new",
        isAvailable: true,
        tags: ["laptop", "apple", "macbook", "computer"]
    },
    {
        name: "Google Pixel 8 Pro",
        price: 106999,
        description: "Power and pro-level photography with Google AI. The most advanced Pixel yet.",
        category: "Electronics",
        brand: "Google",
        stock: 40,
        images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2670&auto=format&fit=crop"],
        _type: "new",
        isAvailable: true,
        tags: ["smartphone", "android", "google", "pixel"]
    },
    {
        name: "Floral Summer Dress",
        price: 2499,
        description: "Light and breezy floral print dress, perfect for summer days and beach outings.",
        category: "Fashion",
        brand: "Zara",
        stock: 60,
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=2000&auto=format&fit=crop"],
        _type: "new",
        isAvailable: true,
        tags: ["clothing", "women", "summer", "dress"]
    },
    {
        name: "Fitbit Charge 6",
        price: 14999,
        description: "Advanced health and fitness tracker with built-in GPS and stress management tools.",
        category: "Electronics",
        brand: "Fitbit",
        stock: 85,
        images: ["https://images.unsplash.com/photo-1576243345690-8e4b78e4fe96?q=80&w=2670&auto=format&fit=crop"],
        _type: "new",
        isAvailable: true,
        tags: ["fitness", "tracker", "wearable", "health"]
    },
    {
        name: "Sonos Era 300",
        price: 49999,
        description: "Next-gen smart speaker built for spatial audio immersion.",
        category: "Electronics",
        brand: "Sonos",
        stock: 25,
        images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2666&auto=format&fit=crop"],
        _type: "new",
        isAvailable: true,
        tags: ["audio", "speaker", "home", "music"]
    },
    {
        name: "Linen Blend Shirt",
        price: 2999,
        description: "Breathable linen shirt in sage green. Relaxed fit for effortless style.",
        category: "Fashion",
        brand: "H&M",
        stock: 100,
        images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=2525&auto=format&fit=crop"],
        _type: "new",
        isAvailable: true,
        tags: ["clothing", "men", "shirt", "summer"]
    },
    {
        name: "Instax Mini 12",
        price: 7499,
        description: "Capture bright photos with automatic exposure. Features selfie mode and close-up lens.",
        category: "Electronics",
        brand: "Fujifilm",
        stock: 60,
        images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2670&auto=format&fit=crop"],
        _type: "new",
        isAvailable: true,
        tags: ["camera", "instant", "photography", "fun"]
    },
    // --- Special Offers (Featured) ---
    {
        name: "GoPro HERO12 Black",
        price: 39990,
        description: "Incredible image quality, even better HyperSmooth video stabilization and huge battery boost.",
        category: "Electronics",
        brand: "GoPro",
        stock: 60,
        images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=2472&auto=format&fit=crop"],
        _type: "featured",
        isAvailable: true,
        tags: ["camera", "action", "video", "gadget"]
    },
    {
        name: "Adjustable Dumbbell Set",
        price: 12999,
        description: "Space-saving adjustable dumbbells. Select weight from 2kg to 24kg.",
        category: "Sports",
        brand: "Bowflex",
        stock: 20,
        images: ["https://images.unsplash.com/photo-1638536531398-e71746654a93?q=80&w=2672&auto=format&fit=crop"],
        _type: "featured",
        isAvailable: true,
        tags: ["weights", "gym", "home workout", "strength"]
    },
    {
        name: "Robot Vacuum Cleaner",
        price: 24999,
        description: "Smart robot vacuum with mapping technology and self-charging capability.",
        category: "Home & Kitchen",
        brand: "Roomba",
        stock: 25,
        images: ["https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2000&auto=format&fit=crop"],
        _type: "featured",
        isAvailable: true,
        tags: ["cleaning", "smart home", "vacuum", "robot"]
    },
    {
        name: "4K Smart TV 55 Inch",
        price: 45999,
        description: "Crystal clear 4K resolution with HDR and built-in smart apps.",
        category: "Electronics",
        brand: "LG",
        stock: 30,
        images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2670&auto=format&fit=crop"],
        _type: "featured",
        isAvailable: true,
        tags: ["tv", "smart tv", "home entertainment", "video"]
    },
    {
        name: "Espresso Coffee Machine",
        price: 18999,
        description: "Barista-grade espresso machine for perfect lattes and cappuccinos at home.",
        category: "Home & Kitchen",
        brand: "Breville",
        stock: 20,
        images: ["https://images.unsplash.com/photo-1517080649362-b91c0b3779e3?q=80&w=2574&auto=format&fit=crop"],
        _type: "featured",
        isAvailable: true,
        tags: ["coffee", "kitchen", "appliance", "cafe"]
    },
    {
        name: "Men's Classic Leather Jacket",
        price: 8999,
        description: "Genuine leather jacket with a timeless design. Perfect for any casual occasion.",
        category: "Fashion",
        brand: "UrbanStyle",
        stock: 20,
        images: ["https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2670&auto=format&fit=crop"],
        _type: "featured",
        isAvailable: true,
        tags: ["jacket", "fashion", "men"]
    },
    {
        name: "Gaming Chair Racing Style",
        price: 15999,
        description: "Ergonomic gaming chair with lumbar support and adjustable armrests.",
        category: "Furniture",
        brand: "Secretlab",
        stock: 15,
        images: ["https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2656&auto=format&fit=crop"],
        _type: "featured",
        isAvailable: true,
        tags: ["chair", "gaming", "furniture", "comfort"]
    },

    // --- Standard Products (Mix) ---
    {
        name: "JBL Flip 6 Bluetooth Speaker",
        price: 9999,
        description: "Bold audio, deep bass, and waterproof design for any adventure.",
        category: "Electronics",
        brand: "JBL",
        stock: 150,
        images: ["https://images.unsplash.com/photo-1612444530582-fc66183b16f7?q=80&w=2692&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["audio", "speaker", "bluetooth", "portable"]
    },
    {
        name: "Dell XPS 15",
        price: 180000,
        description: "High-performance laptop with 4K OLED display, perfect for creators and professionals.",
        category: "Electronics",
        brand: "Dell",
        stock: 25,
        images: ["https://images.unsplash.com/photo-1593642632823-8f78536788c6?q=80&w=2670&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["laptop", "windows", "dell", "creator"]
    },
    {
        name: "Apple Watch Series 9",
        price: 41900,
        description: "Smarter, brighter, and mightier. The ultimate device for a healthy life.",
        category: "Electronics",
        brand: "Apple",
        stock: 80,
        images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2564&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["smartwatch", "wearable", "apple", "fitness"]
    },
    {
        name: "Logitech MX Master 3S",
        price: 9995,
        description: "An icon remastered. Feel every moment of your workflow with even more precision.",
        category: "Electronics",
        brand: "Logitech",
        stock: 100,
        images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=2667&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["mouse", "peripheral", "productivity", "office"]
    },
    {
        name: "Levi's 501 Original Fit Jeans",
        price: 3999,
        description: "The blueprint for every pair of jeans in existence. A cultural icon.",
        category: "Fashion",
        brand: "Levi's",
        stock: 200,
        images: ["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2670&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["jeans", "denim", "clothing", "casual"]
    },
    {
        name: "Ray-Ban Aviator Classic",
        price: 9590,
        description: "Currently one of the most iconic sunglass models in the world. Timeless style.",
        category: "Fashion",
        brand: "Ray-Ban",
        stock: 75,
        images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2000&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["accessories", "sunglasses", "summer", "style"]
    },
    {
        name: "Adidas Originals Hoodie",
        price: 4599,
        description: "Classic Trefoil hoodie made from soft French terry for everyday comfort.",
        category: "Fashion",
        brand: "Adidas",
        stock: 120,
        images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2670&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["clothing", "winter", "casual", "adidas"]
    },
    {
        name: "Classic White T-Shirt",
        price: 999,
        description: "Essential premium cotton t-shirt in white. The perfect base for any outfit.",
        category: "Fashion",
        brand: "Essentials",
        stock: 500,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["clothing", "basics", "casual", "tshirt"]
    },
    {
        name: "Leather Messenger Bag",
        price: 7999,
        description: "Handcrafted genuine leather bag perfect for office or travel. Ages beautifully.",
        category: "Fashion",
        brand: "Heritage",
        stock: 35,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2687&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["accessories", "bag", "leather", "work"]
    },
    {
        name: "Puma Running Jacket",
        price: 3299,
        description: "Lightweight windbreaker designed for runners. Reflective details for safety.",
        category: "Fashion",
        brand: "Puma",
        stock: 45,
        images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2536&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["clothing", "sports", "jacket", "activewear"]
    },
    {
        name: "Analog Classic Watch",
        price: 12499,
        description: "Minimalist design with leather strap. A sophisticated timepiece for any occasion.",
        category: "Fashion",
        brand: "Fossil",
        stock: 55,
        images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=2599&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["accessories", "watch", "timepiece", "classic"]
    },
    {
        name: "Winter Wool Scarf",
        price: 1499,
        description: "Soft and warm wool blend scarf to keep you cozy during the cold months.",
        category: "Fashion",
        brand: "Uniqlo",
        stock: 90,
        images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=2574&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["accessories", "winter", "scarf", "warm"]
    },
    {
        name: "Scandinavian Dining Table",
        price: 22999,
        description: "Minimalist solid wood dining table. Seats 6 comfortably.",
        category: "Furniture",
        brand: "Ikea",
        stock: 20,
        images: ["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=2576&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["table", "dining", "wood", "scandi"]
    },
    {
        name: "Ergonomic Office Chair",
        price: 15499,
        description: "High-back mesh chair with lumbar support for all-day comfort.",
        category: "Furniture",
        brand: "Herman Miller",
        stock: 40,
        images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2618&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["chair", "office", "work", "ergonomic"]
    },
    {
        name: "Industrial Bookshelf",
        price: 8999,
        description: "Metal and wood 5-tier bookshelf. Perfect for displaying books and plants.",
        category: "Furniture",
        brand: "Urban",
        stock: 30,
        images: ["https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=2639&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["storage", "shelf", "industrial", "decor"]
    },
    {
        name: "Queen Size Platform Bed",
        price: 34999,
        description: "Upholstered platform bed frame in grey fabric. Modern and sturdy.",
        category: "Furniture",
        brand: "SleepWell",
        stock: 15,
        images: ["https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=2636&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["bed", "bedroom", "sleep", "furniture"]
    },
    {
        name: "Mid-Century Armchair",
        price: 18999,
        description: "Classic mid-century design with wooden frame and comfortable cushioning.",
        category: "Furniture",
        brand: "Comfort",
        stock: 25,
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["chair", "living room", "vintage", "accent"]
    },
    {
        name: "Coffee Table with Storage",
        price: 11999,
        description: "Modern coffee table with hidden storage compartment and lift-top mechanism.",
        category: "Furniture",
        brand: "Ikea",
        stock: 35,
        images: ["https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=2670&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["table", "coffee", "living room", "storage"]
    },
    {
        name: "Floor Lamp",
        price: 4999,
        description: "Tall minimalist floor lamp with adjustable head. Ideal for reading corners.",
        category: "Furniture",
        brand: "Lumine",
        stock: 50,
        images: ["https://images.unsplash.com/photo-1507473888900-52e1adad8ce3?q=80&w=2670&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["lighting", "lamp", "decor", "home"]
    },
    {
        name: "Yoga Mat Pro",
        price: 2499,
        description: "Non-slip, extra thick yoga mat for ultimate comfort and stability.",
        category: "Sports",
        brand: "Lululemon",
        stock: 100,
        images: ["https://images.unsplash.com/photo-1592432678010-aec51987c964?q=80&w=2659&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["yoga", "fitness", "exercise", "gym"]
    },
    {
        name: "Professional Football",
        price: 3499,
        description: "FIFA quality pro football. Durable construction for match play.",
        category: "Sports",
        brand: "Adidas",
        stock: 60,
        images: ["https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=2670&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["football", "soccer", "ball", "sports"]
    },
    {
        name: "Carbon Fiber Tennis Racket",
        price: 14999,
        description: "Lightweight pro-level racket for precision and power on the court.",
        category: "Sports",
        brand: "Wilson",
        stock: 30,
        images: ["https://images.unsplash.com/photo-1617083934555-563d1416b6a9?q=80&w=2670&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["tennis", "racket", "sports", "outdoor"]
    },
    {
        name: "Mountain Bike",
        price: 28999,
        description: "All-terrain mountain bike with front suspension and 21-speed gears.",
        category: "Sports",
        brand: "Trek",
        stock: 10,
        images: ["https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=2548&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["cycling", "bike", "outdoor", "adventure"]
    },
    {
        name: "Running Hydration Vest",
        price: 4999,
        description: "Lightweight vest with water bottles for long distance running.",
        category: "Sports",
        brand: "Salomon",
        stock: 40,
        images: ["https://images.unsplash.com/photo-1557333610-907e40534d28?q=80&w=2670&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["running", "gear", "hydration", "marathon"]
    },
    {
        name: "Ninja Air Fryer",
        price: 11999,
        description: "Cook with up to 75% less fat. Crisp, roast, reheat, and dehydrate.",
        category: "Home & Kitchen",
        brand: "Ninja",
        stock: 55,
        images: ["https://images.unsplash.com/photo-1626176513733-4ae39f9725f3?q=80&w=2574&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["kitchen", "appliance", "cooking", "healthy"]
    },
    {
        name: "Ceramic Cookware Set",
        price: 7999,
        description: "Non-stick ceramic pots and pans set. Toxin-free and easy to clean.",
        category: "Home & Kitchen",
        brand: "Caraway",
        stock: 30,
        images: ["https://images.unsplash.com/photo-1584990347449-a08466e37257?q=80&w=2670&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["kitchen", "cookware", "pots", "pans"]
    },
    {
        name: "Vitamin C Serum",
        price: 1299,
        description: "Brightening serum for radiant, glowing skin. Reduces dark spots.",
        category: "Beauty",
        brand: "The Ordinary",
        stock: 150,
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2574&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["skincare", "serum", "face", "glow"]
    },
    {
        name: "Matte Lipstick",
        price: 1899,
        description: "Long-lasting matte lipstick with intense color payoff.",
        category: "Beauty",
        brand: "MAC",
        stock: 200,
        images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=2000&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["makeup", "lips", "beauty", "cosmetics"]
    },
    {
        name: "Luxury Perfume",
        price: 8999,
        description: "Signature floral scent with notes of jasmine and rose. Elegant and lasting.",
        category: "Beauty",
        brand: "Chanel",
        stock: 40,
        images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2504&auto=format&fit=crop"],
        isAvailable: true,
        tags: ["fragrance", "perfume", "luxury", "scent"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database");

        // Force delete again just in case
        await productModel.deleteMany({});
        console.log("Cleared existing products");

        await productModel.insertMany(products);
        console.log(`Added ${products.length} seed products`);

        mongoose.connection.close();
        console.log("Database connection closed");
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
