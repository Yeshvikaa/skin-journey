require("dns").setDefaultResultOrder("ipv4first");

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const scanRoutes = require('./routes/scan.routes');
const carebotRoutes = require('./routes/carebot.routes');
const skinJourneyRoutes = require('./routes/skinJourney.routes');
const cabinetRoutes = require('./routes/cabinet.routes');
const communityRoutes = require('./routes/community.routes');
const notificationRoutes = require('./routes/notification.routes');
const cycleSyncRoutes = require('./routes/cycleSync.routes');

const app = express();

/* ---------------- CORS FIX ---------------- */

const allowedOrigins = [
  'https://skin-journey-3.onrender.com', // frontend
  'https://skin-journey.onrender.com',   // old/alternate frontend
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(null, true); // allow for now to avoid blocking (safe for debugging)
    }
  },
  credentials: true
}));

// IMPORTANT: handle preflight requests
app.options('*', cors());

/* ---------------- Middleware ---------------- */

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/* ---------------- Rate Limiting ---------------- */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

// app.use('/api', limiter); // optional

/* ---------------- Routes ---------------- */

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/carebot', carebotRoutes);
app.use('/api/skin-journey', skinJourneyRoutes);
app.use('/api/cabinet', cabinetRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/cycle-sync', cycleSyncRoutes);

/* ---------------- Health Check ---------------- */

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Skin Journey API is running ✨',
    timestamp: new Date()
  });
});

/* ---------------- Error Handler ---------------- */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* ---------------- 404 Handler ---------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* ---------------- DB + Server ---------------- */

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb+srv://yeshu:yeshu@cluster0.y4urud2.mongodb.net/yeshu?retryWrites=true&w=majority'
)
.then(() => {
  console.log('✅ MongoDB connected successfully');

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Skin Journey Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

module.exports = app;
