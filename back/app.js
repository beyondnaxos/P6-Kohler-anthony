const express = require('express') 
const mongoose = require('mongoose') 
const path = require('path') 
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
require('dotenv').config()

const sauceRoutes = require('./routes/sauce') 
const userRoutes = require('./routes/user')   

const limiter = rateLimit({
  windowMs: 0.1 * 60 * 1000,
  max: 100 
})

mongoose.connect(process.env.MONGODB,
{ useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !')) 

    const app = express() 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*') 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization') 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS') 
    next() 
  }) 

app.use(express.json()) 
app.use(helmet())
app.use(limiter)
app.use('/images', express.static(path.join(__dirname, 'images'))) 
app.use('/api/sauces', sauceRoutes) 
app.use('/api/auth', userRoutes) 

module.exports = app 