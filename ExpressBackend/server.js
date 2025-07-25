//Require
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
let rateLimit;
try {
  rateLimit = require('express-rate-limit');
} catch (e) {
  console.warn('express-rate-limit not installed, skipping rate limiting');
  rateLimit = () => (req, res, next) => next();
}
require('dotenv').config();
const redisClient = require('./models/redis');
const app = express();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim()) // clean up any stray spaces
  .filter(Boolean); // remove empty values

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS Blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Log requests in development mode
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}
// Error handling middleware
const errorHandler = require('./middleware/errorHandler');

//Routes
const userAuthRoutes = require('./routes/authUser');
const adminAuthRoutes = require('./routes/authAdmin');
const salonAuthRoutes = require('./routes/authSalon');
const contactRouter = require('./routes/contact');
const bookingRouter = require('./routes/booking');
const packageRouter = require('./routes/package');
const productRouter = require('./routes/product');
const typesRouter = require('./routes/types');
const approvalRouter = require('./routes/approval');
const favoriteRoutes = require('./routes/favorites');
const serviceRouter = require('./routes/service');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/orders');
app.use('/users', userAuthRoutes);
app.use('/admins', adminAuthRoutes);
app.use('/salons', salonAuthRoutes);
app.use('/contacts', contactRouter);
app.use('/bookings', bookingRouter);
app.use('/package', packageRouter);
app.use('/product', productRouter);
app.use('/services', serviceRouter);
app.use('/types', typesRouter);
app.use('/approval', approvalRouter);
app.use('/favorites', favoriteRoutes);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
// Error handler
app.use(errorHandler);

//server execute
if (require.main === module) {
  redisClient
    .connect()
    .then(() => console.log('Connected to Redis'))
    .catch((err) => console.error('Redis connection error:', err));
  const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
}

module.exports = app;
