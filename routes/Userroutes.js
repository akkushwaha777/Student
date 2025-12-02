const express = require('express');
const router = express.Router();
const User = require('../models/User'); 


router.post('/register', async (req, res) => {
    const { name, mobile, address, email, password } = req.body;

    try {
        
        let user = await User.findOne({ $or: [{ email }, { mobile }] });

        if (user) {
            return res.status(400).json({ msg: 'User with this email or mobile already exists.' });
        }
        
       
        user = new User({
            name,
            mobile,
            address,
            email,
            password 
        });

        
        await user.save();

        res.status(201).json({ 
            msg: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err.message);
        
        res.status(500).send('Server Error during registration.');
    }
});


router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error creating user.');
    }
});


router.get('/', async (req, res) => {
    try {
       
        const users = await User.find().select('-password'); 
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error retrieving users.');
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error updating user.');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        res.json({ message: "User successfully removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error deleting user.');
    }
});


router.get('/test', (req, res) => {
    res.send('User API test route running!');
});

module.exports = router;