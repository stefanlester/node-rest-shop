const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/product')
const orderRoutes = require('./api/routes/orders')

mongoose.connect("mongodb://localhost/3000", { useNewUrlParser: true }); //hmm

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// CORS Handler to prevent cross site request forgery(csrf)
// Also prevents API from external access
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); //chnage "*" to domains you want access to
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });

//Routes which should handle requests
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)


//error handler for web server 1
app.use((req, res, next) => {
    const error = new Error('not found')
    error.status = 404 
    next(error)
})

//protecting routes without API routes
//error handler for web server 1.1
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app