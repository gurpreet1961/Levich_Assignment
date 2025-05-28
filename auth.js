const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

function generateTokens(user) {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
}

// Signup
async function signup(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        function (err) {
            if (err) return res.status(400).json({ error: 'Email already exists' });
            db.run(
                'INSERT INTO permissions (user_id, can_read, can_write, can_delete) VALUES (?, 1, 0, 0)',
                [this.lastID],
                (err2) => {
                    if (err2) return res.status(500).json({ error: 'Permission setup failed' });
                    res.status(201).json({ message: 'User registered' });
                }
            );
        }
    );
}

// Login
function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
        const tokens = generateTokens(user);
        db.run(
            'INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES (?, ?, datetime("now", "+7 days"))',
            [user.id, tokens.refreshToken],
            (err2) => {
                if (err2) return res.status(500).json({ error: 'Session error' });
                res.json(tokens);
            }
        );
    });
}

// Token refresh
function refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);
    db.get('SELECT * FROM sessions WHERE refresh_token = ?', [refreshToken], (err, session) => {
        if (err || !session) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err2, user) => {
            if (err2) return res.sendStatus(403);
            const tokens = generateTokens(user);
            db.run('UPDATE sessions SET refresh_token = ?, expires_at = datetime("now", "+7 days") WHERE id = ?', [tokens.refreshToken, session.id], (err3) => {
                if (err3) return res.sendStatus(500);
                res.json(tokens);
            });
        });
    });
}

// Logout
function logout(req, res) {
    db.run('DELETE FROM sessions WHERE user_id = ?', [req.user.id], (err) => {
        if (err) return res.sendStatus(500);
        res.json({ message: 'Logged out' });
    });
}

// Forgot password (mocked)
function forgotPassword(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });
        const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ message: 'Password reset token (mocked)', resetToken });
    });
}

// Reset password (mocked)
async function resetPassword(req, res) {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) return res.status(400).json({ error: 'Missing fields' });
    jwt.verify(resetToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        const hashed = await bcrypt.hash(newPassword, 10);
        db.run('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id], (err2) => {
            if (err2) return res.status(500).json({ error: 'Password reset failed' });
            res.json({ message: 'Password reset successful' });
        });
    });
}

module.exports = {
    signup,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    generateTokens
};
