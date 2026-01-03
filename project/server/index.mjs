import express from "express";
const app = express();
import "dotenv/config";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { readdirSync } from "fs";
import dbConnect from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

const port = process.env.PORT;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'http://localhost:3000', // Common React port
  'http://localhost:8000', // Server
  'http://127.0.0.1:5173', // Alternative localhost
  'http://127.0.0.1:3000', // Alternative localhost
  'http://10.0.2.2:8000',  // Android emulator
  'http://10.0.2.2:8081'   // Android emulator alternative
].filter(Boolean);

console.log('Server running in', process.env.NODE_ENV || 'development', 'mode');
console.log('Allowed CORS Origins:', allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In development, allow all origins for easier testing
      if (process.env.NODE_ENV !== 'production') {
        console.log('Development mode: allowing origin:', origin);
        return callback(null, true);
      }

      // In production, only allow specific origins
      if (allowedOrigins.includes(origin)) {
        console.log('Origin allowed:', origin);
        return callback(null, true);
      }

      console.log('Origin blocked:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(express.json());

dbConnect();
connectCloudinary();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesPath = path.resolve(__dirname, "./routes");
const routeFiles = readdirSync(routesPath);
routeFiles.map(async (file) => {
  const routeModule = await import(`./routes/${file}`);
  app.use("/", routeModule.default);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Default route
app.get("/", (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
      <h1>Welcome to the E-commerce API</h1>
      <p>Server is running in <strong>${process.env.NODE_ENV || 'development'}</strong> mode</p>
      <p>Check the <a href="/api/health">health endpoint</a> for more information</p>
    </div>
  `);
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
