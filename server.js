const express = require('express');
const router = require('./router');
const authService = require('./authService');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


// Middleware to protect routes
app.use('/protected', async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        await authService.verifyToken(token);
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Token invalid' });
    }
});

app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
