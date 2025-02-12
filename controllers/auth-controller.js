const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
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



const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = {
    register,
    login,
    getProfile
};