const db = require('./db');

// Get permissions
function getPermissions(req, res) {
    const { userId } = req.params;
    db.get('SELECT can_read, can_write, can_delete FROM permissions WHERE user_id = ?', [userId], (err, perms) => {
        if (err || !perms) return res.status(404).json({ error: 'Permissions not found' });
        res.json(perms);
    });
}

// Update permissions
function updatePermissions(req, res) {
    const { userId } = req.params;
    const { can_read, can_write, can_delete } = req.body;
    db.run(
        'UPDATE permissions SET can_read = ?, can_write = ?, can_delete = ? WHERE user_id = ?',
        [can_read ? 1 : 0, can_write ? 1 : 0, can_delete ? 1 : 0, userId],
        function (err) {
            if (err) return res.status(500).json({ error: 'Failed to update permissions' });
            res.json({ message: 'Permissions updated' });
        }
    );
}

module.exports = { getPermissions, updatePermissions };
