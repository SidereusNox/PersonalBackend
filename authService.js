const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async comparePasswords(plainPassword, hashedPassword) {
        try {
            const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
            return isMatch;
        } catch (error) {
            console.error('Error comparing passwords:', error);
            throw error;
        }
    }

    async generateToken(payload) {
        try {
            const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });
            return token;
        } catch (error) {
            console.error('Error generating JWT token:', error);
            throw error;
        }
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, 'your_secret_key');
            return decoded;
        } catch (error) {
            console.error('Error verifying JWT token:', error);
            throw error;
        }
    }
}

module.exports = new AuthService();
