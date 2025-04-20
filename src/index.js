const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()

const authRouters = require('./routes/auth.route')
const userRouters = require('./routes/user.route')
const productRouter = require('./routes/product.route')
const adminproductRouter = require('./routes/adminproduct.route')
const cartRouter = require('./routes/cart.route')
const cartItemRouter = require('./routes/cartItem.route')
const orderRouter = require('./routes/order.route')
const paymentRouter=require("./routes/payment.route");
const reviewRouter = require('./routes/review.route')
const ratingRouter = require('./routes/rating.route')
const adminOrderRouter = require('./routes/adminOrder.route')
 
 
dotenv.config({
    path: "./env"
});  
 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => { 
    return res.status(200).send({ message: "welcome api", status: true });
})

app.use('/auth', authRouters);
app.use('/api/users', userRouters)
app.use('/api/admin/products', adminproductRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/cart_items', cartItemRouter)
app.use('/api/orders', orderRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/ratings', ratingRouter) 
app.use('/api/admin/orders', adminOrderRouter)
app.use('/api/payments',paymentRouter)



module.exports = app;