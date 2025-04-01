const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/user');
const { logSession } = require('../models/sessionLog');
const { logger, obfuscateSensitiveData } = require('../utils/logger');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, first_name, last_name, role_id } = req.body;
    
    if (!first_name || !username || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(username, hashedPassword, first_name, last_name, role_id);
        logger.info('User registered successfully', { username });
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        logger.error('Error registering user', { error: err.message, ...obfuscateSensitiveData({ username }) });
        res.status(500).json({ error: 'Error registering user.' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await findUserByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            logger.warn('Failed login attempt', { ...obfuscateSensitiveData({ username }) });
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.user_id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log successful login
        logger.info('User logged in successfully', { ...obfuscateSensitiveData({ username }) });
        
        res.json({
            message: 'Login successful.',
            token,
            user: {
                userId: user.user_id,
                username: user.username,
                role: user.role_id
            }
        });
    } catch (err) {
        logger.error('Error during login', { error: err.message, ...obfuscateSensitiveData({ username }) });
        res.status(500).json({ error: 'Error logging in.' });
    }
});

router.post('/logout', (req, res) => {
    // Since we're using JWT, the client should remove the token
    res.json({ message: 'Logout successful.' });
});

module.exports = router;
