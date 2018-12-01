const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');


// localhost:3000/api/auth/login
router.post('/login', controller.login);

// localhost:3000/api/auth/register
router.post('/register', controller.register);


module.exports = router;