const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const cors = require('cors');
const User = require('../src/models/User')

const app = express();

// Set up default mongoose connection
const dev_db_url = "mongodb+srv://mongo:iPm0U6pSZUGjURgs@cluster0.0zbyfys.mongodb.net/?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Middleware - manipulates the response and passes it
app.use(cors());
app.use(express.json());
app.use(session({secret:'secret123', resave:false, saveUninitialized:false}));
// resave will not resave to the session store unless the session is modified. Modified means adding a property to req.session or changing a variable value.
// An uninitialized session is an unmodified one. When set to false, the session won’t be saved unless we modify it. It also won’t send the id back to the browser.

// takes email and pw, tries to find user in our DB and makes sure pw matches
passport.use(
  new LocalStrategy((email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }

      bcryptjs.compare(password, user.password, (err, res) => {
          if (res) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" });    
          }
      })
      
   });
 })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.post('/api/register', async (req, res) => {
  console.log(req.body)
  try {
    await User.create({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password
    })
    res.json({status: 'ok'})
  } catch (err) {
    res.json({status:'error', error: 'Duplicate email'});
  }  
})

app.post('/api/login', (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log(user)
    if (err) throw err;
    if (!user) res.json({status: "error"});
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.json({status:'ok'})
        console.log(req.user)
      })
    }
  })(req, res, next)
});

app.get('/ecommerce', (req, res) => {
  res.json({status: 'ok'});
  console.log('logged in!')
})

app.listen(1337, () => {
  console.log('app started on host 1337')
})