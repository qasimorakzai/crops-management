const jwt = require('jsonwebtoken'); 
const crypto = require("crypto");
const OTPModel = require("../models/OTPModel");
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const sendEmail = require("../services/sendEmail");
const dotenv = require('dotenv');
dotenv.config(); 

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
       
            email, user = new User({ 
            name,  
            email,
            password: hashedPassword 
        });

        await user.save();

        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Login successful', token, userId: user._id });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found!" });

        
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); 
        const hashedOTP = await bcrypt.hash(otp, 10);


        await OTPModel.findOneAndUpdate(
            { email },
            { otp,hashedOTP, expiresAt: Date.now() + 10 * 60 * 1000 },
            { upsert: true }
        );

        
        await sendEmail(email, "Password Reset OTP", `Your OTP: ${otp} `);

        res.status(200).json({ message: "OTP sent to email!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};






const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OTPModel.findOne({ email });
        if (!otpRecord) return res.status(400).json({ message: "OTP not found!" });

        if (otpRecord.expiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP expired!" });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP!" });
        }

       
        res.status(200).json({ message: "OTP verified successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match!" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found!" });

        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        
        await OTPModel.deleteOne({ email });

        res.status(200).json({ message: "Password reset successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};







module.exports = {
    register,
    login,
    sendOTP,
    verifyOTP,
    resetPassword
};