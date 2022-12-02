const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoute = require('./src/routes/user');
const cookieParser = require('cookie-parser')
dotenv.config();
const path = require('path')
require('./src/config/passport')

// Set up default mongoose connection
const mongoDB = process.env.MONGODB_URI_RAIL || process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/users', userRoute);



app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000!')
})