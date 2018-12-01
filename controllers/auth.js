const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async (req, res) => {
  const candidate = await User.findOne({email: req.body.email});
  if (candidate) {
    // Checking password if exist
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
    if (passwordResult) {
      // Generation Token
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keys.jwt, {expiresIn: 120});

      res.status(200).json({
        token: `JWT ${token}`,
      })
    } else {
      res.status(401).json({
        message: 'Пароли не совпадают. Пробуйте снова.'
      })
    }
  } else {
    // User not found
    res.status(404).json({
      message: 'Пользователь с таким email не найден.'
    })
  }
};


module.exports.register = async (req, res) => {
  const candidate = await User.findOne({email: req.body.email});

  if (candidate) {
    res.status(409).json({
      message: 'Такой email занят, попробуйте другой.'
    })
  } else {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt)
    });
    try {
      await user.save();
      res.status(201).json(user)
    } catch (e) {
      errorHandler(res, e);
    }
  }
};