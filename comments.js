const db = require('./db');

function checkPermission(userId, perm, cb) {
    db.get('SELECT * FROM permissions WHERE user_id = ?', [userId], (err, perms) => {
        if (err || !perms) return cb(false);
        cb(!!perms[perm]);
    });
}

// Get all comments
function getComments(req, res) {
    checkPermission(req.user.id, 'can_read', (allowed) => {
        if (!allowed) return res.status(403).json({ error: 'No read permission' });
        db.all('SELECT comments.id, comments.content, comments.created_at, users.name FROM comments JOIN users ON comments.user_id = users.id', [], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Failed to fetch comments' });
            res.json(rows);
        });
    });
}

// Add a comment
function addComment(req, res) {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Missing content' });
    checkPermission(req.user.id, 'can_write', (allowed) => {
        if (!allowed) return res.status(403).json({ error: 'No write permission' });
        db.run('INSERT INTO comments (user_id, content) VALUES (?, ?)', [req.user.id, content], function (err) {
            if (err) return res.status(500).json({ error: 'Failed to add comment' });
            res.status(201).json({ id: this.lastID, content });
        });
    });
}

// Delete a comment
function deleteComment(req, res) {
    checkPermission(req.user.id, 'can_delete', (allowed) => {
        if (!allowed) return res.status(403).json({ error: 'No delete permission' });
        db.run('DELETE FROM comments WHERE id = ?', [req.params.id], function (err) {
            if (err) return res.status(500).json({ error: 'Failed to delete comment' });
            if (this.changes === 0) return res.status(404).json({ error: 'Comment not found' });
            res.json({ message: 'Comment deleted' });
        });
    });
}

module.exports = { getComments, addComment, deleteComment };
