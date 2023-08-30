const express = require('express');
const router = express.Router();
const authService = require('./authService');
const DevUserRepository = require('./userRepository'); // Use your repository implementation

const userRepository = new DevUserRepository(); // Instantiate your repository

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        await userRepository.connect();
        const user = await userRepository.getByUsername(username);
        await userRepository.disconnect();
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await authService.comparePasswords(password, user.passwordHash);

        if (passwordMatch) {
            const token = await authService.generateToken({ username: user.username });
            return res.status(200).json({ message: 'Login successful', token });
        } else {
            return res.status(401).json({ message: 'Invalid password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/protected', async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decoded = await authService.verifyToken(token);

        // You can access decoded information here, e.g., decoded.username

        return res.status(200).json({ message: 'Access granted' });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Token invalid' });
    }
});

module.exports = router;