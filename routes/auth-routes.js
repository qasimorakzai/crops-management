const express = require('express');
const { register, login, sendOTP, verifyOTP, resetPassword } = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post("/forgot-password",authMiddleware, sendOTP);  

router.post("/verify-otp",authMiddleware, verifyOTP);     

router.post("/reset-password",authMiddleware, resetPassword);

module.exports = router;
