import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './models';

// Import routers
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import adminRouter from './routes/admin';
import aiRouter from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Hook-up
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai', aiRouter);

// Base route/Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Welcome to the ShopEZ Premium Fashion E-Commerce API',
    version: '1.0.0',
    documentation: 'See README for list of endpoints'
  });
});

// Start Server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 ShopEZ Backend Server running on http://localhost:${PORT}`);
  });
}

startServer();
