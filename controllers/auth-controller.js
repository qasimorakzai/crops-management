const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const sendEmail = require("../services/sendEmail");
const dotenv = require('dotenv');
dotenv.config(); 

const register = async (req, res) => {
    const { name, email, phone, address, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
       
            email, user = new User({ 
            name,  
            email,
            phone, 
            address, 
            password: hashedPassword 
        });

        await user.save();

        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
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



const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found!" });

        
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
        await sendEmail(email, "Password Reset Request", `Click here to reset your password: ${resetLink}`);

        res.status(200).json({ message: "Reset link sent to email!", resetLink });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};




const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(400).json({ message: "Invalid or expired token!" });

        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password reset successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};





module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
};