var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const strategy = require('./middleware/passport');

// connect to MongoDB
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/nodeDB', { useNewUrlParser: true });
let db = mongoose.connection;
db.once('open', () => console.log('Connected to Mongodb'));
// Check for Err
db.on('error', () => console.log(err));


var passport = require("passport");
passport.use(strategy.JwtStrategy);

app.use(passport.initialize());

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('cors')());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


app.get("/", function(req, res) {
  res.json({message: "Express is up!"});
});


app.listen(port, () => console.log(`Server has sterted on address http://localhost:3000/`));