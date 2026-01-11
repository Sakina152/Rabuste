import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import workshopRoutes from './routes/workshopRoutes.js';
import artRoutes from './routes/artRoutes.js';
import franchiseRoutes from './routes/franchiseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminStatsRoutes from './routes/adminStatsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import profileRoutes from './routes/profileRoutes.js';



// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 2. UPDATED CORS CONFIGURATION
app.use(cors({
  origin: [
    "http://localhost:5173", // Vite default port
    "http://localhost:8080", // Your current frontend port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
    "https://rabuste-omegon.vercel.app"
  ],
  credentials: true // Important for headers/cookies
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/ai', aiRoutes);

// Make uploads folder static
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.mkdirSync(path.join(uploadsDir, 'menu'), { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/art', artRoutes);
app.use('/api/franchise', franchiseRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/stats', adminStatsRoutes);
app.use('/api/profile', profileRoutes);
// Basic route
app.get('/', (req, res) => {
  res.send('Rabuste Coffee API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});