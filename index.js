require('dotenv').config();
const express = require('express');
const app = express();
const { authenticateToken } = require('./middleware');
const auth = require('./auth');
const permissions = require('./permissions');
const comments = require('./comments');

app.use(express.json());

// Auth routes
app.post('/signup', auth.signup);
app.post('/login', auth.login);
app.post('/refresh-token', auth.refreshToken);
app.post('/logout', authenticateToken, auth.logout);
app.post('/forgot-password', auth.forgotPassword);
app.post('/reset-password', auth.resetPassword);

// Permissions routes
app.get('/permissions/:userId', authenticateToken, permissions.getPermissions);
app.post('/permissions/:userId', authenticateToken, permissions.updatePermissions);

// Comments routes
app.get('/comments', authenticateToken, comments.getComments);
app.post('/comments', authenticateToken, comments.addComment);
app.delete('/comments/:id', authenticateToken, comments.deleteComment);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
