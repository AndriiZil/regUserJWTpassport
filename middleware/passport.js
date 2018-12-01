
var passport = require("passport");
var passportJWT = require("passport-jwt");
var User = require('../models/User');
var key = require('../config/keys');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
jwtOptions.secretOrKey = key.jwt;

module.exports.JwtStrategy = new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  const user = await User.findOne({id: jwt_payload.sub}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  });
});