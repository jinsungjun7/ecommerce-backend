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
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

app.use('/api/users', userRoute);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './public')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './public', 'index.html'));
    });
}


app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000!')task
})