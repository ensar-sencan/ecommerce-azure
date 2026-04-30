const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const categoryRoutes = require('./routes/category.routes');
const reviewRoutes = require('./routes/review.routes');
const sellerRoutes = require('./routes/seller.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const uploadRoutes = require('./routes/upload.routes');

const errorHandler = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

const app = express();

// Security & utilities
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://green-ground-037b99003.7.azurestaticapps.net',
    'http://localhost:3000'
  ],
  credentials: true,
}));

// Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products/:productId/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
