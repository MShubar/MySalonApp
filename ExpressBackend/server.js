//Require
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter((o) => o)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(express.json())

//Routes
const userAuthRoutes = require('./routes/authUser')
const adminAuthRoutes = require('./routes/authAdmin')
const salonAuthRoutes = require('./routes/authSalon')
const contactRouter = require('./routes/contact')
const bookingRouter = require('./routes/booking')
const packageRouter = require('./routes/package')
const productRouter = require('./routes/product')
const typesRouter = require('./routes/types')
const approvalRouter = require('./routes/approval')
const favoriteRoutes = require('./routes/favorites')
const serviceRouter = require('./routes/service')
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/orders')
app.use('/users', userAuthRoutes)
app.use('/admins', adminAuthRoutes)
app.use('/salons', salonAuthRoutes)
app.use('/contacts', contactRouter)
app.use('/bookings', bookingRouter)
app.use('/package', packageRouter)
app.use('/product', productRouter)
app.use('/services', serviceRouter)
app.use('/types', typesRouter)
app.use('/approval', approvalRouter)
app.use('/favorites', favoriteRoutes)
app.use('/cart', cartRouter)
app.use('/orders', orderRouter)

//server execute
if (require.main === module) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  })
}

module.exports = app
